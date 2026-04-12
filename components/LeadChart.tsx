"use client"
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', leads: 4 },
  { name: 'Tue', leads: 7 },
  { name: 'Wed', leads: 5 },
  { name: 'Thu', leads: 12 },
  { name: 'Fri', leads: 10 },
  { name: 'Sat', leads: 15 },
  { name: 'Sun', leads: 14 },
];

export const LeadChart = () => {
  return (
    <div className="nothing-glass p-6 h-[300px] w-full mt-6">
      <h3 className="nothing-dot-matrix text-[10px] text-white/50 mb-4">Lead Growth Trend</h3>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="rgba(255,255,255,0.3)" 
            fontSize={10} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.3)" 
            fontSize={10} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
            itemStyle={{ color: '#ff0031' }}
          />
          <Line 
            type="monotone" 
            dataKey="leads" 
            stroke="#ff0031" 
            strokeWidth={2} 
            dot={{ r: 3, fill: '#ff0031' }}
            activeDot={{ r: 5, fill: '#ffffff', stroke: '#ff0031' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
