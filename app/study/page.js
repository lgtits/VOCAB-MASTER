"use client";
import { useState, useEffect } from "react";
import { getTodayVocab, saveStudySession } from "../../services/api";
import VocabCard from "../../components/VocabCard";
import Link from "next/link";

export default function StudyPage() {
  const [vocabList, setVocabList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  // 初始化取得資料
  useEffect(() => {
    async function initFetch() {
      try {
        const data = await getTodayVocab();
        setVocabList(data);
      } catch (error) {
        console.error("Failed to fetch today's vocab:", error);
      } finally {
        setLoading(false);
      }
    }
    initFetch();
  }, []);

  const currentWord = vocabList[currentIndex];

  const handleScore = async (score) => {
    if (!currentWord) return;

    // 呼叫 api.js 定義的儲存功能
    await saveStudySession(currentWord.id, score);

    if (currentIndex < vocabList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  // 載入狀態
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-indigo-600 font-black tracking-widest animate-pulse">
          LOADING TODAY'S LIST...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col">
      <div className="max-w-xl mx-auto w-full">
        <header className="mb-10 flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              結束學習
            </Link>
            <h1 className="text-2xl font-black text-slate-800">每日複習</h1>
          </div>

          {!isFinished && vocabList.length > 0 && (
            <div className="text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase block tracking-wider">
                Progress
              </span>
              <span className="text-2xl font-black text-indigo-600">
                {currentIndex + 1}
                <span className="text-slate-300 text-lg">
                  /{vocabList.length}
                </span>
              </span>
            </div>
          )}
        </header>

        {/* 進度條 */}
        {!isFinished && vocabList.length > 0 && (
          <div className="w-full h-3 bg-gray-200 rounded-full mb-12 shadow-inner overflow-hidden border border-gray-100">
            <div
              className="h-full bg-indigo-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(79,70,229,0.3)]"
              style={{
                width: `${((currentIndex + 1) / vocabList.length) * 100}%`,
              }}
            />
          </div>
        )}

        {/* 單字卡渲染邏輯 */}
        {!isFinished && currentWord ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <VocabCard data={currentWord} onScore={handleScore} />
          </div>
        ) : (
          <div className="text-center p-16 bg-white rounded-[3rem] shadow-xl border border-gray-100 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🏆</span>
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">
              太棒了！
            </h2>
            <p className="text-slate-400 font-medium mb-10">
              你已完成今日所有單字的練習。
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/history"
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
              >
                查看我的進度
              </Link>
              <Link
                href="/"
                className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
              >
                回到首頁
              </Link>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-auto pt-10 text-center">
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
          Focus on consistency, not perfection.
        </p>
      </footer>
    </div>
  );
}
