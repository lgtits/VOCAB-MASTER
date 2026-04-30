"use client";
import Link from "next/link";

export default function EnToZhMenu() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <header className="w-full max-w-xl pt-12 pb-12 text-center">
        <Link
          href="/quiz"
          className="text-slate-400 font-bold text-sm hover:text-indigo-600 mb-4 inline-block"
        >
          ← 返回模式選擇
        </Link>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          英翻中測試
        </h1>
        <p className="text-slate-500 mt-2 font-medium">請選擇測驗方式</p>
      </header>

      <div className="flex flex-col gap-6 w-full max-w-xl">
        <Link
          href="/quiz/en-to-zh/choice"
          className="group p-8 bg-white border-2 border-slate-900 rounded-[2rem] hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-6">
            <span className="text-5xl">📑</span>
            <div>
              <h2 className="font-black text-2xl text-slate-900 mb-1">
                多重選擇
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                看英文選中文，適合快速複習。
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/quiz/en-to-zh/input"
          className="group p-8 bg-white border-2 border-indigo-600 rounded-[2rem] hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-6">
            <span className="text-5xl">⌨️</span>
            <div>
              <h2 className="font-black text-2xl text-indigo-600 mb-1">
                手寫填空
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                直接輸入中文，挑戰精準記憶。
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
