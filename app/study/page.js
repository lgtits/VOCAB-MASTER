"use client";
import { useState } from "react";
import { mockVocab } from "../../data/mockVocab";
import VocabCard from "../../components/VocabCard";
import Link from "next/link";

export default function StudyPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentWord = mockVocab[currentIndex];

  const handleScore = (score) => {
    // 這裡可以加入 logic: 根據 score 計算下一次複習時間
    if (currentIndex < mockVocab.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("今日單字已全數練習完畢！");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <header className="mb-10 flex justify-between items-center">
          <Link href="/" className="text-indigo-600 font-medium">
            ← 返回
          </Link>
          <span className="text-lg font-black text-slate-800">
            {currentIndex + 1} / {mockVocab.length}
          </span>
        </header>

        <div className="w-full h-2 bg-gray-200 rounded-full mb-12 overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / mockVocab.length) * 100}%`,
            }}
          />
        </div>

        {currentWord ? (
          <VocabCard data={currentWord} onScore={handleScore} />
        ) : (
          <div className="text-center p-10 bg-white rounded-3xl shadow-sm">
            <h2 className="text-2xl font-bold">🎉 完成了！</h2>
            <Link href="/" className="mt-4 inline-block text-indigo-500">
              回到首頁
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
