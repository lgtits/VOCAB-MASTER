import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen p-6 bg-white">
      {/* Header 區域 */}
      <header className="w-full max-w-xl pt-12 pb-12 text-center">
        <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-4">
          VOCAB <span className="text-indigo-600">MASTER</span>
        </h1>
        <div className="flex justify-center items-center gap-2">
          <span className="h-px w-8 bg-slate-200"></span>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
            高中英單系統
          </p>
          <span className="h-px w-8 bg-slate-200"></span>
        </div>
      </header>

      {/* 功能導航區域 - 垂直排列且背景統一為白色 */}
      <div className="flex flex-col gap-6 w-full max-w-xl">
        {/* 1. 開始學習 */}
        <Link
          href="/study"
          className="group relative overflow-hidden p-8 bg-white shadow-sm rounded-[2rem] border border-slate-100 hover:shadow-xl hover:shadow-indigo-50 hover:border-indigo-100 transition-all text-left"
        >
          <div className="relative z-10 flex items-center gap-6">
            <span className="text-5xl">📖</span>
            <div>
              <h2 className="font-black text-2xl text-slate-800 mb-1">
                開始學習
              </h2>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                掌握今日新增的必考單字與發音。
              </p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-6 text-slate-50 font-black text-8xl group-hover:text-indigo-50 transition-colors pointer-events-none">
            01
          </div>
        </Link>

        {/* 2. 測驗挑戰 - 背景改為白色，利用邊框強調 */}
        <Link
          href="/quiz"
          className="group relative overflow-hidden p-8 bg-white shadow-sm rounded-[2rem] border-2  hover:shadow-xl hover:shadow-indigo-100 transition-all text-left"
        >
          <div className="relative z-10 flex items-center gap-6">
            <span className="text-5xl">🎯</span>
            <div>
              <h2 className="font-black text-2xl text-indigo-600 mb-1">
                測驗挑戰
              </h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                挑戰拼寫正確度，強化長期記憶。
              </p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-6 text-slate-50 font-black text-8xl group-hover:text-indigo-50 transition-colors pointer-events-none">
            02
          </div>
        </Link>

        {/* 3. 學習歷史 */}
        <Link
          href="/history"
          className="group relative overflow-hidden p-8 bg-white shadow-sm rounded-[2rem] border border-slate-100 hover:shadow-xl hover:shadow-emerald-50 hover:border-emerald-100 transition-all text-left"
        >
          <div className="relative z-10 flex items-center gap-6">
            <span className="text-5xl">🕒</span>
            <div>
              <h2 className="font-black text-2xl text-slate-800 mb-1">
                學習歷史
              </h2>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                檢視已練習單字的掌握度數據。
              </p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-6 text-slate-50 font-black text-8xl group-hover:text-emerald-50 transition-colors pointer-events-none">
            03
          </div>
        </Link>

        {/* 4. 數據統計 (預留) - 使用淡灰色邊框區分 */}
        <div className="group relative overflow-hidden p-8 bg-white rounded-[2rem] border border-slate-100 opacity-50 cursor-not-allowed text-left">
          <div className="relative z-10 flex items-center gap-6">
            <span className="text-5xl grayscale">📊</span>
            <div>
              <h2 className="font-black text-2xl text-slate-400 mb-1">
                學習分析
              </h2>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                視覺化你的遺忘規律 (開發中)。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-12 text-center">
        <div className="flex gap-4 text-[10px] font-black text-slate-200 uppercase tracking-[0.25em]">
          <span>Consistent</span>
          <span>•</span>
          <span>Scientific</span>
          <span>•</span>
          <span>Efficient</span>
        </div>
      </footer>
    </main>
  );
}
