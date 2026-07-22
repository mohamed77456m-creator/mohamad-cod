export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white flex items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center">

        <div className="bg-[#15151D] border border-white/10 rounded-3xl p-10 shadow-2xl">
          <h1 className="text-5xl font-bold mb-4">
            Mohamad Cod
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Create AI Videos Easily
          </p>

          <div className="grid md:grid-cols-3 gap-5">

            <button className="bg-blue-600 hover:bg-blue-700 rounded-2xl p-5 transition">
              🎬 New Project
            </button>

            <button className="bg-white/10 hover:bg-white/20 rounded-2xl p-5 transition">
              🤖 AI Video Generator
            </button>

            <button className="bg-white/10 hover:bg-white/20 rounded-2xl p-5 transition">
              ⚙️ Settings
            </button>

          </div>

          <div className="mt-10 text-sm text-gray-400">
            AI Video Studio • Characters • Voice • Effects • Rendering
          </div>

        </div>

      </div>
    </main>
  );
}
