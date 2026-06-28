import Groq from "groq-sdk";
import { InvestmentResult } from "../types";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "dummy_key_for_build",
});

export async function generateAIInsights(results: InvestmentResult[]) {
    if (results.length === 0) return null;

    const result = results[0]; // Primary asset
    const profitStr = result.totalReturn >= 0 ? "profit" : "loss";
    
    const prompt = `You are a financial expert. Analyze the following investment scenario:
A user invested $${result.initialInvestment} in ${result.asset.name} (${result.asset.symbol}) on ${result.startDate}.
By ${result.endDate}, the investment is worth $${result.finalValue.toFixed(2)}.

Provide exactly 3 bullet points:
1. The ROI percentage.
2. The total profit/loss amount.
3. The most significant historical event or market catalyst for this asset during this timeframe.

Do not write anything else. No greetings, no conclusion. Just the 3 bullet points.`;

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "dummy_key_for_build") {
        return "Please set your GROQ_API_KEY environment variable in Google Cloud Run to enable AI Analysis.";
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant", // Updated model
        });
        return chatCompletion.choices[0]?.message?.content || "No insights could be generated at this time.";
    } catch (error) {
        console.error("Groq AI Error:", error);
        return "Failed to generate AI insights due to an API error.";
    }
}
