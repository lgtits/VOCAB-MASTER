// 模擬 API 存取層
import todayData from "../data/todayVocab.json";
import historyData from "../data/historyVocab.json";

/**
 * 取得今日待複習單字
 * 未來可在此加入過濾邏輯（例如：根據日期抓取）
 */
export const getTodayVocab = async () => {
  // 模擬網路延遲
  await new Promise((resolve) => setTimeout(resolve, 500));
  return todayData;
};

/**
 * 取得歷史學習紀錄
 * 未來可加入分頁或排序功能
 */
export const getHistoryVocab = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // 依時間排序，最新的在前
  return [...historyData].sort(
    (a, b) => new Date(b.lastTested) - new Date(a.lastTested),
  );
};

/**
 * 儲存學習結果 (預留接口)
 * 目前僅先印出 Log，未來可對接 Supabase 或 LocalStorage
 */
export const saveStudySession = async (wordId, score) => {
  console.log(`[API] Saving progress for ${wordId}: Score ${score}`);
  // 實作持久化邏輯...
  return { success: true };
};
