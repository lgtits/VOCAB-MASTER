"use client";
import Link from "next/link";

export default function QuizMenuPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      {/* Header 區域 */}
      <header className="w-full max-w-xl pt-12 pb-12 text-center">
        <Link
          href="/"
          className="text-slate-400 font-bold text-sm hover:text-indigo-600 flex items-center justify-center gap-1 mb-6 transition-colors"
        >
          ← 返回首頁
        </Link>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          挑戰測驗
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          請選擇你想要練習的模式
        </p>
      </header>

      <div className="flex flex-col gap-6 w-full max-w-xl">
        {/* 1. 中翻英挑戰 (已經完成) */}
        <Link
          href="/quiz/zh-to-en"
          className="group relative overflow-hidden p-8 bg-white shadow-sm rounded-[2rem] border-2 border-indigo-600 hover:shadow-xl hover:shadow-indigo-100 transition-all text-left"
        >
          <div className="relative z-10 flex items-center gap-6">
            <span className="text-5xl group-hover:scale-110 transition-transform">
              ✍️
            </span>
            <div>
              <h2 className="font-black text-2xl text-indigo-600 mb-1">
                中翻英挑戰
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                看到中文解釋，拼寫出正確的英文單字。
              </p>
            </div>
          </div>
          {/* 背景裝飾文字 */}
          <div className="absolute -right-2 -bottom-4 text-slate-50 font-black text-7xl opacity-50 pointer-events-none">
            ZH-EN
          </div>
        </Link>

        {/* 2. 英翻中測試 (即將實作) */}
        <Link
          href="/quiz/en-to-zh"
          className="group relative overflow-hidden p-8 bg-white shadow-sm rounded-[2rem] border-2 border-slate-900 hover:shadow-xl hover:shadow-slate-200 transition-all text-left"
        >
          <div className="relative z-10 flex items-center gap-6">
            <span className="text-5xl group-hover:scale-110 transition-transform">
              👁️
            </span>
            <div>
              <h2 className="font-black text-2xl text-slate-900 mb-1">
                英翻中測試
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                看著英文單字與發音，從選項中選出正確定義。
              </p>
            </div>
          </div>
          {/* 背景裝飾文字 */}
          <div className="absolute -right-2 -bottom-4 text-slate-50 font-black text-7xl opacity-50 pointer-events-none">
            EN-ZH
          </div>
        </Link>
      </div>

      {/* 提示訊息 */}
      <footer className="mt-12 text-slate-400 text-xs font-bold uppercase tracking-widest">
        Select a mode to begin your session
      </footer>
    </div>
  );
}
