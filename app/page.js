import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50">
      <h1 className="text-4xl font-black mb-12 text-slate-800 tracking-tight">
        VOCAB <span className="text-indigo-600">MASTER</span>
      </h1>

      <div className="grid grid-cols-1 gap-6 w-full max-w-sm">
        <Link
          href="/study"
          className="group p-8 bg-white shadow-sm rounded-3xl border-2 border-transparent hover:border-indigo-500 transition-all text-center"
        >
          <span className="text-5xl block mb-4 group-hover:scale-110 transition-transform">
            📖
          </span>
          <span className="font-bold text-xl text-slate-700">開始複習單字</span>
        </Link>

        <div className="p-8 bg-gray-100 rounded-3xl text-center opacity-50">
          <span className="text-5xl block mb-4">📊</span>
          <span className="font-bold text-xl text-slate-400">
            數據統計 (開發中)
          </span>
        </div>
      </div>
    </main>
  );
}
