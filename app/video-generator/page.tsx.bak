'use client';

import { useMemo, useState } from 'react';
import PromptEditor from '../../components/video/PromptEditor';
import PromptEnhancer from '../../components/video/PromptEnhancer';
import SceneGenerator from '../../components/video/SceneGenerator';
import ImageGenerator from '../../components/video/ImageGenerator';
import UploadPanel from '../../components/video/UploadPanel';
import VideoSettingsPanel from '../../components/video/VideoSettingsPanel';
import PreviewPanel from '../../components/video/PreviewPanel';
import GenerateButton from '../../components/video/GenerateButton';

type Scene = {
  title: string;
  description: string;
  camera: string;
  lighting: string;
  duration: string;
};

export default function VideoGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Cinematic');
  const [duration, setDuration] = useState(10);
  const [aspect, setAspect] = useState('16:9');
  const [quality, setQuality] = useState('1080p');
  const [image, setImage] = useState<File | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);

  const imageName = useMemo(() => image?.name ?? null, [image]);

  const handleGenerate = () => {
    alert('Generator pipeline will be connected next.');
  };

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-white/45">Mohamad Cod Studio</p>
            <h1 className="text-4xl font-bold tracking-tight">AI Video Generator</h1>
            <p className="mt-2 text-white/55">
              Build scenes, control style, and prepare the pipeline for AI generation.
            </p>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-2">
          <PromptEditor value={prompt} onChange={setPrompt} />
          <PromptEnhancer onApplyPrompt={setPrompt} />
        </div>

        <SceneGenerator prompt={prompt} onScenesGenerated={setScenes} />

        <ImageGenerator scenes={scenes} style={style} />

        <UploadPanel file={image} onChange={setImage} />

        <VideoSettingsPanel
          style={style}
          duration={duration}
          aspect={aspect}
          quality={quality}
          onStyleChange={setStyle}
          onDurationChange={setDuration}
          onAspectChange={setAspect}
          onQualityChange={setQuality}
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <PreviewPanel
            prompt={prompt}
            style={style}
            duration={duration}
            aspect={aspect}
            quality={quality}
            imageName={imageName}
          />

          <div className="rounded-3xl border border-white/10 bg-[#15151D] p-5 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Pipeline</h2>
            <div className="space-y-3 text-sm text-white/70">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                1. Prompt refinement with Gemini
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                2. Scene and shot planning
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                3. Image generation
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                4. Voice synthesis and sync
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                5. FFmpeg render and MP4 export
              </div>
            </div>

            <div className="mt-6">
              <GenerateButton onClick={handleGenerate} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
