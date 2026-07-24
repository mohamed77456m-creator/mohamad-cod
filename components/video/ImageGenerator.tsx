'use client';

import { useRef, useState, type ChangeEvent } from 'react';

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

type SceneStatus = 'idle' | 'generating' | 'done' | 'error';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ImageGenerator({ scenes, style }: ImageGeneratorProps) {
  const [images, setImages] = useState<Record<number, string>>({});
  const [status, setStatus] = useState<Record<number, SceneStatus>>({});
  const [error, setError] = useState('');
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingUploadIndexRef = useRef<number | null>(null);

  const openUploadPicker = (index: number) => {
    pendingUploadIndexRef.current = index;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleUploadFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const index = pendingUploadIndexRef.current;

    if (!file || index === null) return;
    if (!file.type.startsWith('image/')) return;

    const url = URL.createObjectURL(file);

    setImages((current) => ({
      ...current,
      [index]: url,
    }));

    setStatus((prev) => ({ ...prev, [index]: 'done' }));
    pendingUploadIndexRef.current = null;
  };


  const generateImageForScene = async (scene: Scene, index: number) => {
    setStatus((prev) => ({ ...prev, [index]: 'generating' }));
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
          width: 768,
          height: 768,
seed: (prompt + style).split('').reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 2147483647, 7),        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.imageUrl) {
        throw new Error(data?.error || 'Image generation failed');
      }

      setImages((current) => ({
        ...current,
        [index]: data.imageUrl,
      }));

      setStatus((prev) => ({ ...prev, [index]: 'done' }));
      return true;
    } catch (err) {
      setStatus((prev) => ({ ...prev, [index]: 'error' }));
      setError(err instanceof Error ? err.message : 'Unexpected error');
      return false;
    }
  };

  const generateAllImages = async () => {
    if (isGeneratingAll || !scenes.length) return;

    setIsGeneratingAll(true);
    setError('');

    try {
      for (let index = 0; index < scenes.length; index += 1) {
        await generateImageForScene(scenes[index], index);

        if (index < scenes.length - 1) {
          await sleep(2000);
        }
      }
    } finally {
      setIsGeneratingAll(false);
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
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="image/*"
        onChange={handleUploadFile}
      />
      <h2 className="text-xl font-semibold mb-4">Image Generator</h2>
      <p className="text-sm text-white/50">
        Generate a cinematic AI image for each scene.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={generateAllImages}
          disabled={isGeneratingAll}
          className="rounded-2xl bg-blue-600 px-5 py-2 text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
        >
          {isGeneratingAll ? 'Generating All Images...' : 'Generate All Images'}
        </button>
      </div>

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
                disabled={status[index] === 'generating' || isGeneratingAll}
                className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
              >
                {status[index] === 'generating'
                  ? 'Generating...'
                  : status[index] === 'done'
                    ? 'Regenerate'
                    : 'Generate Image'}
              </button>

              <button
                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition"
              >
                Upload Image
              </button>
            </div>

            <div className="mt-3 text-xs text-white/45">
              {status[index] === 'generating' && 'Status: Generating...'}
              {status[index] === 'done' && 'Status: Done ✅'}
              {status[index] === 'error' && 'Status: Failed ❌'}
              {status[index] === 'idle' || !status[index] ? 'Status: Waiting' : null}
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
