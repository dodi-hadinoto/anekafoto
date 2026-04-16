'use client';

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface ChartData {
  date: string;
  leads: number;
}

interface LeadChartProps {
  data: ChartData[];
}

export default function LeadChart({ data }: LeadChartProps) {
  return (
    <div className="mt-6 nothing-glass p-8 h-[400px] flex flex-col justify-between group overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="nothing-dot-matrix text-[10px] text-white/50 mb-2 uppercase tracking-[0.2em]">Growth Analytics</h3>
          <p className="text-3xl font-bold tracking-tighter">Daily Lead Distribution</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-[#ff0031] animate-pulse" />
           <span className="nothing-dot-matrix text-[8px] text-white/30 uppercase tracking-widest">Live Flow Active</span>
        </div>
      </div>

      <div className="flex-1 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff0031" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#ff0031" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="rgba(255,255,255,0.03)" 
            />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'Nothing Dot Matrix, Courier' }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'Nothing Dot Matrix, Courier' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0A0A0A', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '1rem',
                fontSize: '10px',
                fontFamily: 'Nothing Dot Matrix, Courier'
              }}
              itemStyle={{ color: '#ff0031' }}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
            />
            <Area 
              type="monotone" 
              dataKey="leads" 
              stroke="#ff0031" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorLeads)" 
              animationDuration={2000}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center opacity-40">
         <span className="nothing-dot-matrix text-[8px] uppercase tracking-widest">Database: ANEKAFOTO_LEADS</span>
         <span className="nothing-dot-matrix text-[8px] uppercase tracking-widest">Reference: TIME_SERIES_Q2</span>
      </div>
    </div>
  );
}
