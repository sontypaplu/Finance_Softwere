'use client';

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, Radar, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, ResponsiveContainer, Scatter, ScatterChart, Tooltip, Treemap, XAxis, YAxis, ZAxis } from 'recharts';

const tooltipStyle = {
  borderRadius: 18,
  border: '1px solid rgba(255,255,255,0.6)',
  background: 'rgba(255,255,255,0.94)',
  boxShadow: '0 20px 50px rgba(15,23,40,0.12)'
};

export function DrawdownChart({ data }: { data: { month: string; portfolio: number; benchmark: number }[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="ddPortfolio" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fb7185" stopOpacity={0.20} />
              <stop offset="95%" stopColor="#fb7185" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Area type="monotone" dataKey="benchmark" stroke="#f59e0b" fill="transparent" strokeWidth={2.0} />
          <Area type="monotone" dataKey="portfolio" stroke="#e11d48" fill="url(#ddPortfolio)" strokeWidth={2.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RollingRiskChart({ data }: { data: { month: string; volatility: number; sharpe: number; sortino: number }[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Bar yAxisId="left" dataKey="volatility" fill="#dbeafe" radius={[10,10,0,0]} />
          <Line yAxisId="right" type="monotone" dataKey="sharpe" stroke="#4f46e5" strokeWidth={2.4} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="sortino" stroke="#0f766e" strokeWidth={2.4} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

const TREE_COLORS = ['#4f46e5', '#0f766e', '#0ea5e9', '#8b5cf6', '#f59e0b', '#fb7185', '#14b8a6', '#64748b'];

export function AllocationTreemapChart({ data }: { data: { name: string; size: number }[] }) {
  return (
    <div className="h-[320px] w-full overflow-hidden rounded-[28px] bg-slate-50/60 p-2">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap data={data} dataKey="size" aspectRatio={4 / 3} stroke="#fff" fill="#4f46e5">
          {data.map((_, index) => (
            <Cell key={index} fill={TREE_COLORS[index % TREE_COLORS.length]} />
          ))}
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}

export function RadarScoreChart({ data }: { data: { subject: string; portfolio: number; benchmark: number }[] }) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <PolarRadiusAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <Radar name="Portfolio" dataKey="portfolio" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.20} />
          <Radar name="Benchmark" dataKey="benchmark" stroke="#0f766e" fill="#0f766e" fillOpacity={0.12} />
          <Legend />
          <Tooltip contentStyle={tooltipStyle} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RiskReturnScatterChart({ data }: { data: { name: string; risk: number; return: number; size: number }[] }) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 10, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.16)" />
          <XAxis type="number" dataKey="risk" name="Volatility" unit="%" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis type="number" dataKey="return" name="Return" unit="%" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
          <ZAxis type="number" dataKey="size" range={[100, 700]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={tooltipStyle} />
          <Scatter data={data} fill="#4f46e5" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RealizedUnrealizedChart({ data }: { data: { label: string; realized: number; unrealized: number }[] }) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Bar dataKey="realized" fill="#0f766e" radius={[10,10,0,0]} />
          <Bar dataKey="unrealized" fill="#4f46e5" radius={[10,10,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FreeCashFlowLine({ data }: { data: { month: string; value: number }[] }) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="fcfFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0f766e" stopOpacity={0.20} />
              <stop offset="95%" stopColor="#0f766e" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="value" stroke="#0f766e" fill="url(#fcfFill)" strokeWidth={2.4} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
