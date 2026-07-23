import { NextResponse } from 'next/server';

function extractText(data: any): string {
  const candidates = Array.isArray(data?.candidates) ? data.candidates : [];

  for (const candidate of candidates) {
    const parts = candidate?.content?.parts;
    if (Array.isArray(parts)) {
      for (const part of parts) {
        if (typeof part?.text === 'string') {
          return part.text;
        }
      }
    }
  }

  return '';
}

function cleanJson(text: string): string {
  return text
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim();
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing GEMINI_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const prompt = String(body?.prompt ?? '').trim();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: [
                    'You are an expert cinematic scene planner for AI video generation.',
                    'Turn the idea below into a JSON array of 4 scene objects only.',
                    'Each object must have exactly these keys: title, description, camera, lighting, duration.',
                    'Return only valid JSON. No markdown. No explanation.',
                    '',
                    `Idea: ${prompt}`,
                  ].join('\n'),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const details = await response.text();
      return NextResponse.json(
        { error: 'Gemini request failed', details },
        { status: 500 }
      );
    }

    const data = await response.json();
    const rawText = extractText(data);
    const cleaned = cleanJson(rawText);

    try {
      const scenes = JSON.parse(cleaned);
      return NextResponse.json({ scenes });
    } catch {
      return NextResponse.json(
        {
          error: 'Could not parse Gemini JSON',
          rawText: cleaned,
        },
        { status: 500 }
      );
    }
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
