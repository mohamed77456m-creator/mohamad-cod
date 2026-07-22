'use client';

import { useState } from 'react';

type Scene = {
  title: string;
  description: string;
  camera: string;
  lighting: string;
  duration: string;
};

type SceneGeneratorProps = {
  prompt: string;
  onScenesGenerated?: (scenes: Scene[]) => void;
};

export default function SceneGenerator({
  prompt,
  onScenesGenerated,
}: SceneGeneratorProps) {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateScenes = async () => {
    const text = prompt.trim();

    if (!text) {
      setError('Write a prompt first.');
      return;
    }

    setLoading(true);
    setError('');
    setScenes([]);

    try {
      const res = await fetch('/api/gemini/scenes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.details || data?.error || 'Failed to generate scenes');
      }

      const nextScenes = Array.isArray(data.scenes) ? data.scenes : [];
      setScenes(nextScenes);
      onScenesGenerated?.(nextScenes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#15151D] p-6 shadow-xl">
      <h2 className="text-xl font-semibold mb-4">Scene Generator</h2>

      <p className="text-sm text-white/50">
        Converts the main prompt into cinematic scene blocks.
      </p>

      <button
        onClick={handleGenerateScenes}
        disabled={loading}
        className="mt-4 rounded-2xl bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700 transition disabled:opacity-60"
      >
        {loading ? 'Generating...' : 'Generate Scenes'}
      </button>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {scenes.length > 0 ? (
          scenes.map((scene, index) => (
            <div
              key={`${scene.title}-${index}`}
              className="rounded-2xl border border-white/10 bg-[#0F1117] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold">
                  Scene {index + 1}: {scene.title}
                </h3>
                <span className="text-xs text-white/45">{scene.duration}</span>
              </div>

              <p className="mt-2 text-sm leading-6 text-white/75">
                {scene.description}
              </p>

              <div className="mt-3 grid gap-2 text-sm text-white/60">
                <div>
                  <span className="text-white/40">Camera:</span> {scene.camera}
                </div>
                <div>
                  <span className="text-white/40">Lighting:</span> {scene.lighting}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/45">
            Generated scenes will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
