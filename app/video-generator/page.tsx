'use client';

import { useState } from 'react';

export default function VideoGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Cinematic');
  const [duration, setDuration] = useState(10);
  const [image, setImage] = useState<File | null>(null);

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          AI Video Generator
        </h1>

        <p className="text-gray-400 mb-8">
          Create cinematic AI videos from text and images.
        </p>

        <div className="bg-[#15151D] rounded-3xl border border-white/10 p-6 space-y-6">

          <div>
            <label className="block mb-2 font-medium">
              Prompt
            </label>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              placeholder="Describe your video..."
              className="w-full rounded-xl bg-[#0F1117] p-4 outline-none border border-white/10"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Upload Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files?.[0] ?? null)
              }
              className="w-full"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 font-medium">
                Style
              </label>

              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-xl bg-[#0F1117] p-3 border border-white/10"
              >
                <option>Cinematic</option>
                <option>Realistic</option>
                <option>Animation</option>
                <option>Anime</option>
                <option>3D</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Duration
              </label>

              <select
                value={duration}
                onChange={(e) =>
                  setDuration(Number(e.target.value))
                }
                className="w-full rounded-xl bg-[#0F1117] p-3 border border-white/10"
              >
                <option value={5}>5 sec</option>
                <option value={10}>10 sec</option>
                <option value={15}>15 sec</option>
                <option value={30}>30 sec</option>
              </select>
            </div>

          </div>

          <button
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 transition py-4 text-lg font-bold"
          >
            Generate Video
          </button>

        </div>

      </div>
    </main>
  );
}
