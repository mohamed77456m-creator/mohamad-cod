'use client';

import { useMemo, useState } from 'react';

type PromptEnhancerProps = {
  onApplyPrompt?: (value: string) => void;
};

export default function PromptEnhancer({
  onApplyPrompt,
}: PromptEnhancerProps) {
  const [input, setInput] = useState('');
  const [enhanced, setEnhanced] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const wordCount = useMemo(() => {
    return input.trim() ? input.trim().split(/\s+/).length : 0;
  }, [input]);

  const handleEnhance = async () => {
    const text = input.trim();

    if (!text) {
      setError('Write a short idea first.');
      return;
    }

    setLoading(true);
    setError('');
    setEnhanced('');

    try {
      const res = await fetch('/api/gemini/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: text,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.details || data?.error || 'Failed to enhance prompt'
        );
      }

      setEnhanced(data.enhancedPrompt || '');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unexpected error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#15151D] p-6 shadow-xl">
      <h2 className="mb-4 text-xl font-semibold">
        Prompt Enhancer
      </h2>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={5}
        placeholder="Write a short idea..."
        className="w-full rounded-2xl border border-white/10 bg-[#0F1117] p-4 text-white outline-none resize-none"
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="text-sm text-white/45">
          {wordCount} words
        </div>

        <button
          onClick={handleEnhance}
          disabled={loading}
          className="rounded-2xl bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Enhancing...' : 'Enhance with Gemini'}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-white/10 bg-[#0F1117] p-4">
        <div className="mb-2 text-sm text-white/45">
          Enhanced Prompt
        </div>

        <div className="break-words text-sm leading-6 text-white/85">
          {enhanced || 'The improved prompt will appear here.'}
        </div>

        <button
          onClick={() => enhanced && onApplyPrompt?.(enhanced)}
          disabled={!enhanced}
          className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          Use in Main Prompt
        </button>
      </div>
    </div>
  );
}
