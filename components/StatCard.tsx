import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
}

export const StatCard = ({ title, value, change, isPositive }: StatCardProps) => {
  return (
    <div className="nothing-glass p-6 min-w-[200px] flex flex-col justify-between group hover:border-nothing-red transition-all duration-500">
      <div>
        <h3 className="nothing-dot-matrix text-[10px] text-white/50 mb-2">{title}</h3>
        <p className="text-4xl font-bold tracking-tighter">{value}</p>
      </div>
      {change && (
        <div className={`mt-4 text-xs font-medium ${isPositive ? 'text-green-400' : 'text-nothing-red'}`}>
          {isPositive ? '↑' : '↓'} {change} <span className="text-white/30 ml-1">vs last month</span>
        </div>
      )}
      <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-nothing-red opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};
