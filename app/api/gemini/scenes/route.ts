import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type Scene = {
  title: string;
  description: string;
  camera: string;
  lighting: string;
  duration: string;
};

function stripCodeFences(text: string): string {
  return text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
}

function parseScenesPayload(text: string): Scene[] {
  const cleaned = stripCodeFences(text);
  let parsed: unknown;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (!match) {
      throw new Error('Gemini did not return valid JSON');
    }
    parsed = JSON.parse(match[0]);
  }

  const rawScenes = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { scenes?: unknown })?.scenes)
      ? (parsed as { scenes: unknown[] }).scenes
      : [];

  const normalized = rawScenes
    .map((scene) => {
      if (!scene || typeof scene !== 'object') return null;

      const s = scene as Partial<Scene>;
      const title = String(s.title ?? '').trim();
      const description = String(s.description ?? '').trim();

      if (!title || !description) return null;

      return {
        title,
        description,
        camera: String(s.camera ?? 'Cinematic wide shot').trim() || 'Cinematic wide shot',
        lighting: String(s.lighting ?? 'Cinematic lighting').trim() || 'Cinematic lighting',
        duration: String(s.duration ?? '5s').trim() || '5s',
      };
    })
    .filter(Boolean) as Scene[];

  if (!normalized.length) {
    throw new Error('No scenes returned');
  }

  return normalized;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing GEMINI_API_KEY in environment' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const prompt = String((body as { prompt?: unknown })?.prompt ?? '').trim();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents:
        `Create 5 cinematic video scenes from this prompt. ` +
        `Return only JSON. The response must be an array of scene objects. ` +
        `Each object must have exactly these fields: title, description, camera, lighting, duration.\n\nPrompt:\n${prompt}`,
      config: {
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              camera: { type: 'string' },
              lighting: { type: 'string' },
              duration: { type: 'string' },
            },
            required: ['title', 'description', 'camera', 'lighting', 'duration'],
            additionalProperties: false,
          },
        },
      },
    });

    const scenes = parseScenesPayload(String(response.text ?? ''));
    return NextResponse.json({ scenes });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Unexpected server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
