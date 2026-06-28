"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HistoricalEvent } from "@/lib/game/game-types";

export function EventToast({ event, onDismiss }: { event: HistoricalEvent | null, onDismiss: () => void }) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#0F172A]/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl max-w-sm w-full z-50 text-center"
        >
          <div className="text-xs text-slate-400 font-bold mb-1">{event.date.substring(0, 4)}</div>
          <h4 className="font-bold text-white text-lg mb-2">{event.title}</h4>
          <p className="text-sm text-slate-300">{event.description}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
