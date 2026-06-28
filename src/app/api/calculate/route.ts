import { NextResponse } from 'next/server';
import { calculateInvestment } from '@/lib/calculator';
import { generateAIInsights } from '@/lib/services/groq';
import { Asset } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { assets, amount, startDate, endDate } = body;

    if (!assets || !Array.isArray(assets) || assets.length === 0) {
      return NextResponse.json({ error: 'At least one asset is required' }, { status: 400 });
    }
    
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }
    
    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Start and end dates are required' }, { status: 400 });
    }

    const results = [];
    for (const asset of assets) {
      try {
        const result = await calculateInvestment(asset as Asset, amount, startDate, endDate);
        results.push(result);
      } catch (err: any) {
        console.error(`Failed to calculate for ${asset.symbol}:`, err);
        // Continue with other assets
      }
    }

    if (results.length === 0) {
       return NextResponse.json({ error: 'Could not fetch data for any of the requested assets.' }, { status: 500 });
    }

    // Generate AI Insights asynchronously (don't block the main response too long)
    // Actually we will await it since the UI might want it immediately, Groq is fast.
    let aiInsights = null;
    try {
        aiInsights = await generateAIInsights(results);
    } catch (e) {
        console.error("AI insights failed", e);
    }

    return NextResponse.json({ results, aiInsights });
  } catch (error: any) {
    console.error('API /calculate error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
