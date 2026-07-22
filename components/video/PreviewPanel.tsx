type PreviewPanelProps = {
  prompt: string;
  style: string;
  duration: number;
  aspect: string;
  quality: string;
  imageName: string | null;
};

export default function PreviewPanel({
  prompt,
  style,
  duration,
  aspect,
  quality,
  imageName,
}: PreviewPanelProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#15151D] p-6 shadow-xl">
      <h2 className="text-xl font-semibold mb-5">Preview</h2>

      <div className="rounded-2xl border border-white/10 bg-[#0F1117] p-4">
        <div className="aspect-video rounded-xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-cyan-400/10 flex items-center justify-center text-center p-6">
          <div>
            <div className="text-sm text-white/60">Video Preview</div>
            <div className="mt-2 text-lg font-semibold">{style}</div>
            <div className="text-sm text-white/45 mt-1">
              {aspect} • {quality} • {duration}s
            </div>
          </div>
        </div>        <div className="mt-5 space-y-3 text-sm">

          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <span className="text-white/50">Image:</span>{" "}
            {imageName ?? "No image selected"}
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <span className="text-white/50">Prompt:</span>
            <div className="mt-2 text-white/80 break-words">
              {prompt || "No prompt yet"}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
