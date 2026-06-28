import Link from "next/link";
import { AlertTriangle, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mb-8 border border-rose-500/30">
        <AlertTriangle className="w-10 h-10 text-rose-400" />
      </div>
      <h1 className="text-6xl font-black text-white mb-4 tracking-tight">404</h1>
      <h2 className="text-2xl font-bold text-slate-300 mb-6">Page Not Found</h2>
      <p className="text-slate-400 max-w-md mx-auto mb-10 text-lg">
        We couldn't find the comparison or asset you're looking for. It might have been moved or doesn't exist.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2">
          <Home className="w-4 h-4" />
          Go Home
        </Link>
        <Link href="/compare" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
          <Search className="w-4 h-4" />
          Browse Comparisons
        </Link>
      </div>
    </div>
  );
}
