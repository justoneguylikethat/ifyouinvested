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
By ${result.endDate}, the investment is worth $${result.finalValue.toFixed(2)}, resulting in a total ${profitStr} of $${Math.abs(result.totalReturn).toFixed(2)} and an ROI of ${result.percentageReturn.toFixed(2)}%.
The CAGR is ${result.cagr.toFixed(2)}%.

Provide a short, concise analysis consisting of 3-4 bullet points highlighting the key reasons for this performance, and 1-2 bullet points for major historical events during this period. Do not write long paragraphs. Keep it extremely brief and strictly use bullet points.
Format the output as clean markdown without any generic greetings.`;

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
