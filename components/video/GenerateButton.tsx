'use client';

type GenerateButtonProps = {
  onClick: () => void;
};

export default function GenerateButton({
  onClick,
}: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 transition py-4 text-lg font-bold"
    >
      Generate AI Video
    </button>
  );
}
