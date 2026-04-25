'use client';

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const tooltipStyle = {
  borderRadius: 18,
  border: '1px solid rgba(255,255,255,0.6)',
  background: 'rgba(255,255,255,0.92)',
  boxShadow: '0 20px 50px rgba(15,23,40,0.12)'
};

export function PerformanceChart({ data }: { data: { month: string; portfolio: number; benchmark: number }[] }) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 14, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.24} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="benchmarkFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0f766e" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#0f766e" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="benchmark" stroke="#0f766e" fill="url(#benchmarkFill)" strokeWidth={2.2} />
          <Area type="monotone" dataKey="portfolio" stroke="#4f46e5" fill="url(#portfolioFill)" strokeWidth={2.6} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const COLORS = ['#4f46e5', '#0f766e', '#0ea5e9', '#8b5cf6', '#f59e0b'];

export function AllocationChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={72} outerRadius={108} paddingAngle={3} stroke="none">
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RollingReturnChart({ data }: { data: { month: string; oneMonth: number; threeMonth: number; sixMonth: number }[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Bar dataKey="oneMonth" fill="#c7d2fe" radius={[8, 8, 0, 0]} />
          <Line type="monotone" dataKey="threeMonth" stroke="#4f46e5" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="sixMonth" stroke="#0f766e" strokeWidth={2.5} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AttributionChart({ data }: { data: { sleeve: string; contribution: number }[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, left: 20, bottom: 0 }}>
          <CartesianGrid horizontal={false} stroke="rgba(148,163,184,0.12)" />
          <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis type="category" dataKey="sleeve" tickLine={false} axisLine={false} tick={{ fill: '#334155', fontSize: 12 }} width={96} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="contribution" fill="#4f46e5" radius={[0, 10, 10, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ExposureBarChart({ data, dataKey = 'value', labelKey = 'name' }: { data: Record<string, string | number>[]; dataKey?: string; labelKey?: string }) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" />
          <XAxis dataKey={labelKey} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey={dataKey} fill="#0f766e" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CashFlowChart({ data }: { data: { month: string; income: number; expenses: number; invested: number }[] }) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Bar dataKey="income" fill="#4f46e5" radius={[10, 10, 0, 0]} />
          <Bar dataKey="expenses" fill="#fda4af" radius={[10, 10, 0, 0]} />
          <Line type="monotone" dataKey="invested" stroke="#0f766e" strokeWidth={2.5} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PassiveIncomeChart({ data }: { data: { month: string; dividends: number; interest: number; rent: number }[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="dividendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Area type="monotone" dataKey="dividends" stroke="#4f46e5" fill="url(#dividendFill)" strokeWidth={2.2} />
          <Line type="monotone" dataKey="interest" stroke="#0f766e" strokeWidth={2.1} dot={false} />
          <Line type="monotone" dataKey="rent" stroke="#f59e0b" strokeWidth={2.1} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CompareBarChart({ data }: { data: { name: string; current: number; target: number }[] }) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Bar dataKey="current" fill="#4f46e5" radius={[10, 10, 0, 0]} />
          <Bar dataKey="target" fill="#0f766e" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
