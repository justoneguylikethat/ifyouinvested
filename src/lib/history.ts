export type HistoryItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: 'Bitcoin' | 'Calculator' | 'Coffee' | 'TrendingUp' | 'Search' | 'PieChart' | 'Clock' | 'Bot' | 'Rocket';
  href: string;
  color: string;
  bg: string;
  timestamp: number;
};

export const getHistory = (): HistoryItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('user_history');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: Math.random().toString(36).substring(7),
    timestamp: Date.now()
  };
  
  // Remove duplicates with the same href
  const filtered = history.filter(h => h.href !== item.href);
  
  // Add to top, keep max 6
  const updated = [newItem, ...filtered].slice(0, 6);
  localStorage.setItem('user_history', JSON.stringify(updated));
};
