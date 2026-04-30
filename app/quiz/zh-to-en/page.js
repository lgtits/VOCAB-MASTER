"use client";
import { useState, useEffect } from "react";
import { getTodayVocab, getHistoryVocab } from "../../../services/api";
import { checkAnswer, filterQuizData } from "../../../lib/quiz";
import Link from "next/link";

export default function ZhToEnQuizPage() {
  const [step, setStep] = useState("setup");
  const [source, setSource] = useState("today");
  const [difficulty, setDifficulty] = useState("all");
  const [quizList, setQuizList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  // 發音函式
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // 停止之前的發音
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const startQuiz = async () => {
    let data = [];
    if (source === "today") {
      data = await getTodayVocab();
    } else {
      const rawHistory = await getHistoryVocab();
      data = filterQuizData(rawHistory, difficulty);
    }

    if (data.length === 0) {
      alert("範圍內沒有單字！");
      return;
    }

    setQuizList(data.sort(() => Math.random() - 0.5));
    setStep("testing");
    setCurrentIndex(0);
    setScore(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback) return;

    const currentWord = quizList[currentIndex];
    const isCorrect = checkAnswer(userInput, currentWord.word);

    if (isCorrect) {
      setFeedback({ isCorrect: true, msg: "Excellent!" });
      setScore((s) => s + 1);
      speak(currentWord.word); // 答對時自動發音
    } else {
      setFeedback({
        isCorrect: false,
        msg: `Correct answer: ${currentWord.word}`,
      });
    }

    setTimeout(() => {
      if (currentIndex < quizList.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setUserInput("");
        setFeedback(null);
      } else {
        setStep("result");
      }
    }, 1500); // 延長一點時間讓使用者看清楚答案
  };

  // 1. 設定頁面
  if (step === "setup") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-black text-slate-900 mb-8 text-center tracking-tight">
            中翻英：設定範圍
          </h1>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSource("today")}
                className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                  source === "today"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                    : "bg-white text-slate-600 border-slate-100 hover:border-slate-200"
                }`}
              >
                今日單字
              </button>
              <button
                onClick={() => setSource("history")}
                className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                  source === "history"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                    : "bg-white text-slate-600 border-slate-100 hover:border-slate-200"
                }`}
              >
                歷史紀錄
              </button>
            </div>
            {source === "history" && (
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 focus:border-indigo-600 outline-none"
              >
                <option value="all">全部單字</option>
                <option value="1-2">需要加強 (Lv 1-2)</option>
                <option value="3">普通熟悉 (Lv 3)</option>
                <option value="4-5">完全掌握 (Lv 4-5)</option>
              </select>
            )}
            <button
              onClick={startQuiz}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xl active:scale-95 transition-all shadow-xl"
            >
              START
            </button>
            <Link
              href="/quiz"
              className="block text-center text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors"
            >
              取消返回
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. 測驗頁面
  if (step === "testing") {
    const current = quizList[currentIndex];
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4 relative">
        {/* 中斷按鈕 */}
        <button
          onClick={() => {
            if (confirm("確定要結束測驗嗎？進度將不會被保存。"))
              setStep("setup");
          }}
          className="absolute top-6 right-6 bg-indigo-500 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg"
        >
          ✕ 結束測驗
        </button>

        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl w-full max-w-md text-center relative">
          <div className="flex justify-between items-center mb-8">
            <span className="text-sm font-black text-slate-400 tracking-widest uppercase">
              Q {currentIndex + 1} / {quizList.length}
            </span>
            {/* 手動發音按鈕 */}
            <button
              onClick={() => speak(current.word)}
              className="text-indigo-600 hover:scale-110 active:scale-90 transition-all p-2 bg-indigo-50 rounded-full"
              title="聽取讀音"
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
          </div>

          <h2 className="text-4xl font-black text-slate-900 mb-2 leading-tight">
            {current.definition}
          </h2>
          <p className="text-indigo-600 font-black mb-8 uppercase tracking-[0.2em] text-sm bg-indigo-50 inline-block px-3 py-1 rounded-lg">
            {current.pos}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              autoFocus
              type="text"
              placeholder="Type in English..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={feedback}
              className={`w-full p-6 rounded-2xl text-center text-2xl font-black border-4 transition-all outline-none ${
                feedback
                  ? feedback.isCorrect
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-red-500 bg-red-50 text-red-700"
                  : "border-slate-100 focus:border-indigo-600 bg-slate-50 text-slate-900 placeholder:text-slate-300"
              }`}
            />
            <div className="h-8">
              {feedback && (
                <p
                  className={`font-black uppercase tracking-tight text-lg ${feedback.isCorrect ? "text-green-500" : "text-red-600"}`}
                >
                  {feedback.msg}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 3. 結算頁面
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center w-full max-w-md">
        <div className="text-8xl mb-6">🎯</div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">測驗結算</h2>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
          Final Score
        </p>
        <p className="text-7xl font-black text-indigo-600 my-4">
          {Math.round((score / quizList.length) * 100)}%
        </p>
        <p className="text-slate-600 font-medium mb-10">
          你答對了 {score} 題，共 {quizList.length} 題
        </p>
        <div className="space-y-3">
          <button
            onClick={() => setStep("setup")}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-indigo-100 active:scale-95 transition-all"
          >
            再次挑戰
          </button>
          <Link
            href="/quiz"
            className="block w-full py-5 bg-slate-100 text-slate-700 rounded-2xl font-black text-lg hover:bg-slate-200 transition-colors"
          >
            返回模式選擇
          </Link>
        </div>
      </div>
    </div>
  );
}
