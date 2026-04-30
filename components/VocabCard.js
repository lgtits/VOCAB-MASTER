"use client";
import { useState } from "react";

export default function VocabCard({ data, onScore }) {
  const [showDefinition, setShowDefinition] = useState(false);

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all">
      <div className="text-center">
        <h2 className="text-5xl font-extrabold text-indigo-600 mb-2">
          {data.word}
        </h2>
        <p className="text-gray-400 font-mono italic mb-6">{data.phonetic}</p>

        <div className="min-h-[160px] flex flex-col justify-center items-center">
          {showDefinition ? (
            <div className="animate-in fade-in duration-500 text-center">
              <p className="text-2xl text-gray-800 font-semibold mb-4 underline decoration-indigo-200 underline-offset-8">
                {data.definition}
              </p>
              <p className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg">
                "{data.example}"
              </p>
            </div>
          ) : (
            <button
              onClick={() => setShowDefinition(true)}
              className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors font-medium"
            >
              點擊翻開解釋
            </button>
          )}
        </div>
      </div>

      {showDefinition && (
        <div className="mt-10 flex flex-col gap-3">
          <p className="text-center text-xs text-gray-400 font-bold tracking-widest uppercase">
            自我評估掌握度
          </p>
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => {
                  onScore(s);
                  setShowDefinition(false);
                }}
                className="flex-1 py-3 bg-gray-100 hover:bg-indigo-600 hover:text-white rounded-xl transition-all font-bold"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
