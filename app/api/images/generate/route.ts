import { NextResponse } from 'next/server';

type Body = {
  prompt?: string;
  style?: string;
  width?: number;
  height?: number;
  seed?: number;
};

export async function POST(req: Request) {
  try {
    const body: Body = await req.json().catch(() => ({}));

    const prompt = String(body.prompt ?? '').trim();
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const style = String(body.style ?? 'Cinematic').trim();
    const width = Number(body.width ?? 1024);
    const height = Number(body.height ?? 1024);
    const seed = Number.isFinite(body.seed) ? Number(body.seed) : Date.now();

    const fullPrompt = [
      prompt,
      `Style: ${style}.`,
      'Cinematic, high detail, clean composition, professional lighting, sharp focus, commercial quality.',
    ]
      .filter(Boolean)
      .join(' ');

    const params = new URLSearchParams({
      model: 'flux',
      width: String(width),
      height: String(height),
      seed: String(seed),
      enhance: 'true',
    });

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?${params.toString()}`;

    return NextResponse.json({
      imageUrl,
      prompt: fullPrompt,
    });
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
