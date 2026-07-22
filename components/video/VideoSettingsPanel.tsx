'use client';

type Props = {
  style: string;
  duration: number;
  quality: string;
  aspect: string;
  onStyleChange: (value: string) => void;
  onDurationChange: (value: number) => void;
  onQualityChange: (value: string) => void;
  onAspectChange: (value: string) => void;
};

export default function VideoSettingsPanel({
  style,
  duration,
  quality,
  aspect,
  onStyleChange,
  onDurationChange,
  onQualityChange,
  onAspectChange,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#15151D] p-6 shadow-xl">
      <h2 className="text-xl font-semibold mb-6">
        Video Settings
      </h2>

      <div className="grid gap-5 md:grid-cols-2">

        <div>
          <label className="block text-sm mb-2">Style</label>

          <select
            value={style}
            onChange={(e) => onStyleChange(e.target.value)}
            className="w-full rounded-xl bg-[#0F1117] border border-white/10 p-3"
          >
            <option>Cinematic</option>
            <option>Realistic</option>
            <option>Animation</option>
            <option>Anime</option>
            <option>3D</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">
            Duration
          </label>

          <select
            value={duration}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            className="w-full rounded-xl bg-[#0F1117] border border-white/10 p-3"
          >
            <option value={5}>5 Seconds</option>
            <option value={10}>10 Seconds</option>
            <option value={15}>15 Seconds</option>
            <option value={30}>30 Seconds</option>
          </select>
        </div>        <div>
          <label className="block text-sm mb-2">
            Aspect Ratio
          </label>

          <select
            value={aspect}
            onChange={(e) => onAspectChange(e.target.value)}
            className="w-full rounded-xl bg-[#0F1117] border border-white/10 p-3"
          >
            <option>16:9</option>
            <option>9:16</option>
            <option>1:1</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">
            Quality
          </label>

          <select
            value={quality}
            onChange={(e) => onQualityChange(e.target.value)}
            className="w-full rounded-xl bg-[#0F1117] border border-white/10 p-3"
          >
            <option>720p</option>
            <option>1080p</option>
            <option>2K</option>
            <option>4K</option>
          </select>
        </div>

      </div>
    </div>
  );
}
