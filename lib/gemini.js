import { GoogleGenerativeAI } from "@google/generative-ai";

// const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const apiKey = "AIzaSyAEb6Ut5UsS2lOzIe8eRypsMeIgx9ThUdQ";
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * 使用 Gemini 1.5 Flash 判定中文翻譯是否正確（含自動重試機制）
 */
export async function checkZhAnswerByGemini(
  userInput,
  vocabData,
  retryCount = 0,
) {
  const MAX_RETRIES = 2; // 最多額外重試 2 次

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const systemPrompt = `
      You are a linguistic expert. 
      Determine if the user's Chinese translation is a correct or acceptable synonym.
      
      Context:
      - Word: "${vocabData.word}" (${vocabData.pos})
      - Standard Definition: "${vocabData.definition}"
      - User Input: "${userInput}"
      
      Response Format: {"answer_correct": true/false}
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    // 嘗試解析 JSON
    try {
      const jsonResponse = JSON.parse(text);

      // 檢查必要的 Key 是否存在
      if (typeof jsonResponse.answer_correct === "boolean") {
        return jsonResponse.answer_correct;
      }

      // 如果 JSON 格式對但沒有對應的 Key，拋出錯誤進入 retry
      throw new Error("Missing answer_correct key");
    } catch (parseError) {
      if (retryCount < MAX_RETRIES) {
        console.warn(`JSON 解析失敗，正在進行第 ${retryCount + 1} 次重試...`);
        return await checkZhAnswerByGemini(
          userInput,
          vocabData,
          retryCount + 1,
        );
      }
      throw parseError; // 超過重試次數，丟給外部 catch
    }
  } catch (error) {
    console.error("Gemini API Error:", error);

    // 如果是 API 層級的錯誤（如 429 或 500），也可以視情況決定是否重試
    if (retryCount < MAX_RETRIES) {
      return await checkZhAnswerByGemini(userInput, vocabData, retryCount + 1);
    }

    // 最終失敗的退路：回歸最基礎的字串包含判定，或回傳 false
    return (
      userInput.includes(vocabData.definition) ||
      vocabData.definition.includes(userInput)
    );
  }
}
