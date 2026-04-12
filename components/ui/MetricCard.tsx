"use client";

import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  isPositive?: boolean;
  delay?: number;
}

export function MetricCard({ title, value, trend, isPositive, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02 }}
      className="nothing-glass p-6 flex flex-col justify-between h-32 cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <h3 className="nothing-dot-matrix text-xs text-gray-400 font-bold">{title}</h3>
      </div>
      <div className="flex items-end gap-3 mt-4">
        <span className="text-3xl font-light tracking-tight text-white">{value}</span>
        {trend && (
          <span className={`text-xs mb-1 font-mono ${isPositive ? 'text-green-400' : 'text-[#ff0031]'}`}>
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
}
