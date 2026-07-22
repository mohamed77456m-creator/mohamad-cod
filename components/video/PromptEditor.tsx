'use client';

type PromptEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function PromptEditor({
  value,
  onChange,
}: PromptEditorProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#15151D] p-6 shadow-xl">
      <h2 className="text-xl font-semibold mb-4">
        AI Prompt
      </h2>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder="Describe your video..."
        className="w-full rounded-2xl bg-[#0F1117] border border-white/10 p-4 text-white outline-none resize-none"
      />

      <div className="mt-3 text-sm text-white/50">
        The better your prompt, the better your AI video.
      </div>
    </div>
  );
}
