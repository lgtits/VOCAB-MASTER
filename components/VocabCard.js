"use client";
import { useState, useEffect } from "react";

export default function VocabCard({ data, onScore }) {
  const [showDefinition, setShowDefinition] = useState(false);

  // 發音邏輯
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

  // 翻開時自動發音
  useEffect(() => {
    if (showDefinition) {
      handleSpeak(data.word);
    }
  }, [showDefinition, data.word]);

  // 確保語音清單正確載入
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

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 transition-all">
      <div className="text-center">
        {/* 單字與發音按鈕 */}
        <div className="flex justify-center items-center gap-3 mb-1">
          <h2 className="text-5xl font-black text-indigo-600 tracking-tight">
            {data.word}
          </h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSpeak(data.word);
            }}
            className="p-2 hover:bg-indigo-50 rounded-full transition-colors text-indigo-300 hover:text-indigo-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          </button>
        </div>

        {/* 詞性與音標 */}
        <div className="flex justify-center items-center gap-2 mt-3 mb-6">
          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded uppercase tracking-wider">
            {data.pos}
          </span>
          <p className="text-gray-400 font-mono italic">{data.phonetic}</p>
        </div>

        {/* 解釋區域 */}
        <div className="min-h-[180px] flex flex-col justify-center items-center">
          {showDefinition ? (
            <div className="animate-in fade-in zoom-in duration-300 text-center w-full">
              <p className="text-2xl text-gray-800 font-bold mb-5">
                {data.definition}
              </p>
              <div
                className="group relative text-sm text-gray-500 italic bg-gray-50 p-4 rounded-2xl cursor-pointer hover:bg-indigo-50 transition-all"
                onClick={() => handleSpeak(data.example)}
              >
                <p className="pr-6">"{data.example}"</p>
                <div className="absolute right-3 top-4 text-indigo-200 group-hover:text-indigo-400">
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
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDefinition(true)}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all font-bold text-lg"
            >
              翻開看解釋
            </button>
          )}
        </div>
      </div>

      {/* 評分區塊 */}
      {showDefinition && (
        <div className="mt-10 border-t pt-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-center items-center mb-5 px-1">
            <p className="text-xs font-black text-gray-400 tracking-[0.2em] uppercase">
              自我評估熟悉程度
            </p>
          </div>

          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map((s) => {
              const colors = [
                "hover:bg-red-500",
                "hover:bg-orange-400",
                "hover:bg-yellow-400",
                "hover:bg-blue-400",
                "hover:bg-green-500",
              ];
              return (
                <button
                  key={s}
                  onClick={() => {
                    onScore(s);
                    setShowDefinition(false);
                  }}
                  className={`
                    flex-1 py-4 text-xl font-black rounded-2xl transition-all duration-200
                    bg-gray-100 text-gray-400 border-b-4 border-gray-200
                    hover:text-white hover:scale-105 hover:border-transparent hover:shadow-lg
                    active:scale-95 ${colors[s - 1]}
                  `}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
