"use client";
import { useState, useEffect } from "react";
import { getTodayVocab } from "../../../../services/api";
import { speak } from "../../../../lib/quiz";
import Link from "next/link";

export default function ChoiceQuiz() {
  const [quizList, setQuizList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function load() {
      const data = await getTodayVocab();
      const shuffled = data.sort(() => Math.random() - 0.5);
      setQuizList(shuffled);
      if (shuffled.length > 0) setupQuestion(0, shuffled);
    }
    load();
  }, []);

  const setupQuestion = (index, list) => {
    const current = list[index];
    const others = list
      .filter((v) => v.word !== current.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setOptions([...others, current].sort(() => Math.random() - 0.5));
    speak(current.word);
  };

  const handleSelect = (opt) => {
    if (feedback) return;
    const isCorrect = opt.word === quizList[currentIndex].word;
    setFeedback({ isCorrect, selected: opt.word });
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (currentIndex < quizList.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setupQuestion(nextIndex, quizList);
        setFeedback(null);
      } else {
        setFeedback({ done: true });
      }
    }, 1200);
  };

  const handleQuit = () => {
    if (window.confirm("確定要退出測驗嗎？")) {
      window.location.href = "/quiz/en-to-zh";
    }
  };

  if (quizList.length === 0)
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black">
        Loading...
      </div>
    );

  // 結算畫面
  if (feedback?.done)
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <h2 className="text-4xl font-black text-slate-900 mb-2">測驗完成</h2>
        <p className="text-7xl md:text-8xl font-black text-indigo-600 my-8">
          {Math.round((score / quizList.length) * 100)}%
        </p>
        <p className="text-slate-500 font-bold mb-10 text-lg">
          準確率：{score} / {quizList.length}
        </p>
        <Link
          href="/quiz/en-to-zh"
          className="w-full max-w-xs text-center p-5 bg-slate-900 text-white rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-all"
        >
          返回
        </Link>
      </div>
    );

  const current = quizList[currentIndex];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* 右上角取消按鈕 */}
      <button
        onClick={handleQuit}
        className="absolute top-6 right-6 text-slate-400 hover:text-white font-bold transition-colors p-2"
      >
        ✕ QUIT
      </button>

      <div className="w-full max-w-lg text-center">
        {/* 進度文字 */}
        <span className="text-xs font-black text-slate-500 tracking-[0.3em] uppercase mb-4 block">
          Step {currentIndex + 1} of {quizList.length}
        </span>

        {/* 單字顯示：調整 mobile 字體 */}
        <h2 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter break-words">
          {current.word}
        </h2>

        {/* 發音按鈕 */}
        <button
          onClick={() => speak(current.word)}
          className="mb-10 p-4 bg-slate-800 hover:bg-slate-700 rounded-full text-indigo-400 transition-all active:scale-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </button>

        {/* 選項清單 */}
        <div className="grid w-full gap-3">
          {options.map((opt) => (
            <button
              key={opt.word}
              disabled={!!feedback}
              onClick={() => handleSelect(opt)}
              className={`p-5 md:p-6 rounded-2xl text-left font-bold border-2 transition-all active:scale-[0.98] ${
                feedback
                  ? opt.word === current.word
                    ? "bg-green-500 border-green-500 text-white"
                    : feedback.selected === opt.word
                      ? "bg-red-500 border-red-500 text-white"
                      : "bg-slate-800 border-slate-800 opacity-30"
                  : "bg-slate-800 border-slate-700 hover:border-indigo-500 text-slate-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-lg md:text-xl">{opt.definition}</span>
                <span className="text-[10px] font-black opacity-40 uppercase tracking-tighter bg-black/20 px-2 py-1 rounded">
                  {opt.pos}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 底部進度條 */}
      <div className="absolute bottom-0 left-0 h-1 bg-slate-800 w-full">
        <div
          className="h-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / quizList.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
