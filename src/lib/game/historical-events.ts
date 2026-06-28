import { HistoricalEvent } from "./game-types";

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: "dot-com-crash",
    title: "Dot-Com Crash",
    description: "The bubble bursts! Tech stocks plummet as internet companies fail to show profitability.",
    date: "2000-03-10",
    impact: "negative"
  },
  {
    id: "iphone-launch",
    title: "iPhone Announced",
    description: "Apple announces the first iPhone, revolutionizing mobile technology forever.",
    date: "2007-01-09",
    impact: "positive"
  },
  {
    id: "financial-crisis",
    title: "Global Financial Crisis",
    description: "Lehman Brothers collapses. Markets worldwide crash due to the subprime mortgage crisis.",
    date: "2008-09-15",
    impact: "negative"
  },
  {
    id: "bitcoin-genesis",
    title: "Bitcoin Genesis Block",
    description: "Satoshi Nakamoto mines the first block of the Bitcoin blockchain.",
    date: "2009-01-03",
    impact: "neutral"
  },
  {
    id: "flash-crash",
    title: "Flash Crash",
    description: "The Dow Jones drops nearly 1,000 points in minutes before recovering.",
    date: "2010-05-06",
    impact: "negative"
  },
  {
    id: "facebook-ipo",
    title: "Facebook IPO",
    description: "Facebook goes public in one of the biggest tech IPOs in history.",
    date: "2012-05-18",
    impact: "positive"
  },
  {
    id: "brexit",
    title: "Brexit Vote",
    description: "The UK votes to leave the European Union, causing market uncertainty.",
    date: "2016-06-23",
    impact: "negative"
  },
  {
    id: "covid-crash",
    title: "COVID-19 Crash",
    description: "Global pandemic declared. Markets experience the fastest drop in history.",
    date: "2020-03-11",
    impact: "negative"
  },
  {
    id: "fed-rate-cuts",
    title: "Fed Slashes Rates to Zero",
    description: "Federal Reserve cuts rates to zero and launches massive quantitative easing.",
    date: "2020-03-15",
    impact: "positive"
  },
  {
    id: "meme-stock-mania",
    title: "Meme Stock Mania",
    description: "Retail investors on Reddit trigger massive short squeezes on GameStop and AMC.",
    date: "2021-01-27",
    impact: "neutral"
  },
  {
    id: "crypto-ath",
    title: "Crypto All-Time Highs",
    description: "Bitcoin reaches $69,000 amidst massive retail and institutional interest.",
    date: "2021-11-10",
    impact: "positive"
  },
  {
    id: "fed-hikes",
    title: "Aggressive Fed Rate Hikes",
    description: "Fed begins aggressively raising rates to combat 40-year high inflation.",
    date: "2022-03-16",
    impact: "negative"
  },
  {
    id: "chatgpt-launch",
    title: "ChatGPT Launched",
    description: "OpenAI releases ChatGPT, sparking a massive boom in Artificial Intelligence investments.",
    date: "2022-11-30",
    impact: "positive"
  },
  {
    id: "svb-collapse",
    title: "Silicon Valley Bank Collapse",
    description: "The second-largest bank failure in US history triggers regional banking fears.",
    date: "2023-03-10",
    impact: "negative"
  }
];

export function getEventsForPeriod(startYear: number, endYear: number): HistoricalEvent[] {
  return HISTORICAL_EVENTS.filter(event => {
    const eventYear = parseInt(event.date.split("-")[0]);
    return eventYear >= startYear && eventYear <= endYear;
  });
}
