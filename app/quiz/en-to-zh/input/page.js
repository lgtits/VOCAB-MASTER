"use client";
import { useState, useEffect } from "react";
import { getTodayVocab } from "../../../../services/api";
import { speak, checkZhAnswer } from "../../../../lib/quiz";
import { checkZhAnswerByGemini } from "../../../../lib/gemini"; // 引入你寫的 lib
import Link from "next/link";

// 控制是否使用 Gemini 的開關
const USE_GEMINI_AI = true;

export default function InputQuiz() {
  const [quizList, setQuizList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState(null); // { isCorrect }
  const [score, setScore] = useState(0);
  const [isChecking, setIsChecking] = useState(false); // 新增：等待 AI 檢查的狀態

  useEffect(() => {
    async function load() {
      const data = await getTodayVocab();
      const shuffled = data.sort(() => Math.random() - 0.5);
      setQuizList(shuffled);
      if (shuffled.length > 0) speak(shuffled[0].word);
    }
    load();
  }, []);

  const handleNext = () => {
    if (currentIndex < quizList.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setUserInput("");
      setFeedback(null);
      setIsChecking(false);
      speak(quizList[nextIndex].word);
    } else {
      setFeedback({ ...feedback, done: true });
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // 狀態 1: 已有反饋 -> 跳下一題
    if (feedback) {
      handleNext();
      return;
    }

    // 狀態 2: 檢查輸入內容
    if (!userInput.trim() || isChecking) return;

    setIsChecking(true); // 開始檢查，禁用按鈕與輸入

    let isCorrect = false;
    const currentVocab = quizList[currentIndex];

    try {
      if (USE_GEMINI_AI) {
        // 使用 Gemini 進行語義判定
        isCorrect = await checkZhAnswerByGemini(userInput, {
          word: currentVocab.word,
          definition: currentVocab.definition,
          pos: currentVocab.pos, // 確保 api 回傳有包含詞性
        });
      } else {
        // 使用傳統字串比對
        isCorrect = checkZhAnswer(userInput, currentVocab.definition);
      }
    } catch (error) {
      console.error("Check Answer Error:", error);
      // 如果 AI 失敗， fallback 到基礎比對
      isCorrect = checkZhAnswer(userInput, currentVocab.definition);
    }

    setFeedback({ isCorrect });
    if (isCorrect) {
      setScore((s) => s + 1);
      speak(currentVocab.word);
    }
    setIsChecking(false); // 檢查結束
  };

  const handleQuit = () => {
    if (window.confirm("確定要放棄本次測驗嗎？")) {
      window.location.href = "/quiz/en-to-zh";
    }
  };

  if (quizList.length === 0) return null;

  // 結算畫面
  if (feedback?.done)
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest">
          Quiz Finished
        </h2>
        <p className="text-7xl md:text-8xl font-black text-indigo-600 my-6">
          {Math.round((score / quizList.length) * 100)}%
        </p>
        <p className="text-slate-500 font-bold mb-10 text-lg">
          Correct: {score} / Total: {quizList.length}
        </p>
        <Link
          href="/quiz/en-to-zh"
          className="w-full max-w-xs p-5 bg-slate-900 text-white rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-all"
        >
          返回選單
        </Link>
      </div>
    );

  const current = quizList[currentIndex];

  return (
    <div className="min-h-[100dvh] bg-indigo-600 flex flex-col p-6 text-white relative overflow-hidden">
      {/* 頂部導覽 */}
      <div className="flex justify-between items-center w-full mb-8 z-10">
        <span className="text-sm font-black text-indigo-200 tracking-wider">
          {currentIndex + 1} / {quizList.length}
        </span>
        <button
          onClick={handleQuit}
          className="bg-black/20 px-4 py-2 rounded-xl font-bold text-xs backdrop-blur-md"
        >
          ✕ 結束
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto text-center">
        {/* 單字顯示 */}
        <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter break-all px-4">
          {current.word}
        </h2>

        <button
          onClick={() => speak(current.word)}
          className="mb-8 bg-white/10 p-4 rounded-full active:scale-90 transition-all"
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

        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <input
            autoFocus
            type="text"
            enterKeyHint={feedback ? "next" : "done"}
            className={`w-full p-5 md:p-6 rounded-2xl text-slate-900 text-xl md:text-2xl font-bold text-center outline-none border-4 transition-all shadow-2xl ${
              feedback
                ? feedback.isCorrect
                  ? "border-green-400 bg-green-50 text-green-700"
                  : "border-red-400 bg-red-50 text-red-700"
                : isChecking
                  ? "border-yellow-400 bg-yellow-50 animate-pulse"
                  : "border-indigo-400 focus:border-white bg-white"
            }`}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={
              isChecking ? "評分中..." : feedback ? "" : "在此輸入中文..."
            }
            readOnly={!!feedback || isChecking}
          />

          <div className="mt-6 min-h-[160px]">
            {feedback ? (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="mb-4">
                  <p className="text-xs font-bold text-indigo-200 uppercase mb-1">
                    正確定義
                  </p>
                  <p className="text-2xl md:text-3xl font-black leading-tight">
                    {current.definition}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-all"
                >
                  下一題 (NEXT)
                </button>
              </div>
            ) : (
              userInput.trim().length > 0 && (
                <button
                  type="submit"
                  disabled={isChecking}
                  className={`w-full py-5 rounded-2xl font-black text-xl shadow-lg transition-all ${
                    isChecking
                      ? "bg-indigo-300 cursor-not-allowed"
                      : "bg-indigo-400 hover:bg-indigo-300 active:scale-95"
                  }`}
                >
                  {isChecking ? "AI 檢查中..." : "檢查答案 (CHECK)"}
                </button>
              )
            )}
          </div>
        </form>
      </div>

      {/* 底部進度條 */}
      <div className="absolute bottom-0 left-0 h-2 bg-black/10 w-full">
        <div
          className="h-full bg-white transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex + 1) / quizList.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
