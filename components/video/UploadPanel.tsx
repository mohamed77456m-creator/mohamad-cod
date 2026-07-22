'use client';

type UploadPanelProps = {
  file: File | null;
  onChange: (file: File | null) => void;
};

export default function UploadPanel({
  file,
  onChange,
}: UploadPanelProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#15151D] p-6 shadow-xl">
      <h2 className="text-xl font-semibold mb-4">
        Upload Image
      </h2>

      <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-10 cursor-pointer hover:border-blue-500 transition">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />

        <div className="text-lg font-medium">
          {file ? file.name : "Choose Image"}
        </div>

        <div className="text-sm text-white/50 mt-2">
          PNG • JPG • WEBP
        </div>
      </label>
    </div>
  );
}
