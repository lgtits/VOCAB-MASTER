"use client";
import historyData from "../../data/historyVocab.json";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HistoryPage() {
  const [history] = useState(historyData);

  // --- 發音邏輯開始 ---
  const handleSpeak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice =
      voices.find((v) => v.lang === "en-US" && v.name.includes("Google")) ||
      voices.find((v) => v.lang === "en-US") ||
      voices.find((v) => v.lang.startsWith("en"));

    if (selectedVoice) utterance.voice = selectedVoice;
    window.speechSynthesis.speak(utterance);
  };

  // 確保語音清單載入
  useEffect(() => {
    window.speechSynthesis.getVoices();
    const handleVoicesChanged = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener(
      "voiceschanged",
      handleVoicesChanged,
    );
    return () =>
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        handleVoicesChanged,
      );
  }, []);
  // --- 發音邏輯結束 ---

  const getScoreColor = (score) => {
    if (score >= 4) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 3) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10 flex justify-between items-center">
          <Link
            href="/"
            className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回首頁
          </Link>
          <h1 className="text-2xl font-black text-slate-800">學習歷史</h1>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">
                  單字詳情
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-center">
                  掌握度
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">
                  上次測試
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {history.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* 發音按鈕 */}
                      <button
                        onClick={() => handleSpeak(item.word)}
                        className="p-2 bg-slate-100 text-slate-400 rounded-full hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        title="播放發音"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                      </button>

                      <div>
                        <div className="font-black text-slate-700 text-lg flex items-center gap-2">
                          {item.word}
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded uppercase font-bold">
                            {item.pos}
                          </span>
                        </div>
                        <div className="text-sm text-slate-400 font-medium">
                          {item.definition}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-black border ${getScoreColor(item.lastScore)}`}
                    >
                      LVL {item.lastScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-xs text-slate-400 font-mono">
                      {item.lastTested}
                    </div>
                    <div className="text-[10px] text-slate-300 uppercase font-bold">
                      Reviewed: {item.reviewCount}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {history.length === 0 && (
            <div className="p-20 text-center text-slate-300">
              <span className="text-4xl block mb-2">🧊</span>
              目前還沒有任何學習紀錄
            </div>
          )}
        </div>

        <footer className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            點擊單字旁的喇叭圖示可重複聽取正確發音
          </p>
        </footer>
      </div>
    </div>
  );
}
