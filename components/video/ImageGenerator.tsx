'use client';

import { useState } from 'react';

type Scene = {
  title: string;
  description: string;
  camera: string;
  lighting: string;
  duration: string;
};

type ImageGeneratorProps = {
  scenes: Scene[];
  style: string;
};

export default function ImageGenerator({
  scenes,
  style,
}: ImageGeneratorProps) {
  const [images, setImages] = useState<Record<number, string>>({});
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  const generateImageForScene = async (scene: Scene, index: number) => {
    setLoadingIndex(index);
    setError('');

    try {
      const prompt = [
        scene.title,
        scene.description,
        `Camera: ${scene.camera}.`,
        `Lighting: ${scene.lighting}.`,
      ].join(' ');

      const res = await fetch('/api/images/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          style,
          width: 1024,
          height: 1024,
          seed: Math.floor(Math.random() * 2147483647) + index,
        }),
      });

const data = await res.json();

console.log(data.imageUrl);
window.open(data.imageUrl, "_blank");
       
      alert(data.imageUrl);

      if (!res.ok) {
        throw new Error(data?.details || data?.error || 'Failed to generate image');
      }

      setImages((current) => ({
        ...current,
        [index]: data.imageUrl,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setLoadingIndex(null);
    }
  };

  if (!scenes.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#15151D] p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-3">Image Generator</h2>
        <p className="text-sm text-white/50">
          Generate scenes first, then create one image for each scene.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-[#15151D] p-6 shadow-xl">
      <h2 className="text-xl font-semibold mb-4">Image Generator</h2>
      <p className="text-sm text-white/50">
        Generate a cinematic AI image for each scene.
      </p>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mt-5 grid gap-4">
        {scenes.map((scene, index) => (
          <div
            key={`${scene.title}-${index}`}
            className="rounded-2xl border border-white/10 bg-[#0F1117] p-4"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-base font-semibold">
                  Scene {index + 1}: {scene.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  {scene.description}
                </p>
              </div>

              <button
                onClick={() => generateImageForScene(scene, index)}
                disabled={loadingIndex === index}
                className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loadingIndex === index ? 'Generating...' : 'Generate Image'}
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
              {images[index] ? (
                <img
                  src={images[index]}
                  alt={scene.title}
                  className="h-auto w-full object-cover"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center text-sm text-white/35">
                  No image generated yet
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
