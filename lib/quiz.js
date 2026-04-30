// lib/quiz.js

/**
 * 中翻英：比對使用者輸入的單字（忽略大小寫與前後空格）
 */
export const checkAnswer = (input, correctWord) => {
  if (!input || !correctWord) return false;
  return input.trim().toLowerCase() === correctWord.trim().toLowerCase();
};

export const checkZhAnswer = (input, correctDefinition) => {
  if (!input || !correctDefinition) return false;

  const normalize = (str) =>
    str
      .trim()
      .replace(/[\s，。、；]/g, "") // 去除空白與常見中文標點
      .toLowerCase();

  const userNorm = normalize(input);
  const correctNorm = normalize(correctDefinition);

  // 只要使用者的回答包含在正確答案中，或是正確答案包含使用者輸入（視情況調整嚴格度）
  return userNorm === correctNorm || correctNorm.includes(userNorm);
};

/**
 * 英翻中：驗證選擇的選項是否正確
 */
export const checkMultipleChoice = (selectedId, correctId) => {
  return selectedId === correctId;
};

/**
 * 語音發音工具 (Browser-based TTS)
 */
export const speak = (text, rate = 0.9) => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  }
};

/**
 * 根據難度與來源過濾資料
 */
export const filterQuizData = (data, difficulty) => {
  if (difficulty === "all") return data;
  if (difficulty === "1-2") return data.filter((v) => v.level <= 2);
  if (difficulty === "3") return data.filter((v) => v.level === 3);
  if (difficulty === "4-5") return data.filter((v) => v.level >= 4);
  return data;
};
