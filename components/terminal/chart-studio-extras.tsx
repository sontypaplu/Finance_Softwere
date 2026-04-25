'use client';

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Funnel, FunnelChart, LabelList, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const tooltipStyle = {
  borderRadius: 18,
  border: '1px solid rgba(255,255,255,0.6)',
  background: 'rgba(255,255,255,0.94)',
  boxShadow: '0 20px 50px rgba(15,23,40,0.12)'
};

export function DailyPnlBars({ data }: { data: { day: string; value: number }[] }) {
  return <div className="h-[280px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}><CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" /><XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill:'#64748b', fontSize:12 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill:'#64748b', fontSize:12 }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="value" radius={[10,10,0,0]} fill="#4f46e5" /></BarChart></ResponsiveContainer></div>;
}

export function RollingWithOneYear({ data }: { data: { month: string; oneMonth: number; threeMonth: number; sixMonth: number; oneYear: number }[] }) {
  return <div className="h-[300px] w-full"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={data} margin={{ top:10, right:10, left:-10, bottom:0 }}><CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" /><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill:'#64748b', fontSize:12 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill:'#64748b', fontSize:12 }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="oneMonth" fill="#c7d2fe" radius={[8,8,0,0]} /><Line type="monotone" dataKey="threeMonth" stroke="#4f46e5" strokeWidth={2.2} dot={false} /><Line type="monotone" dataKey="sixMonth" stroke="#0f766e" strokeWidth={2.2} dot={false} /><Line type="monotone" dataKey="oneYear" stroke="#f59e0b" strokeWidth={2.2} dot={false} /></ComposedChart></ResponsiveContainer></div>;
}

export function IncomeCapitalSplit({ data }: { data: { name: string; value: number }[] }) {
  const colors = ['#4f46e5','#0f766e'];
  return <div className="h-[280px] w-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={108} stroke="none">{data.map((_,i)=><Cell key={i} fill={colors[i%colors.length]} />)}</Pie><Tooltip contentStyle={tooltipStyle} /></PieChart></ResponsiveContainer></div>;
}

export function WaterfallContribution({ data }: { data: { name: string; value: number }[] }) {
  return <div className="h-[280px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top:10, right:10, left:-10, bottom:0 }}><CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" /><XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill:'#64748b', fontSize:12 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill:'#64748b', fontSize:12 }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="value" radius={[10,10,0,0]} fill="#0f766e" /></BarChart></ResponsiveContainer></div>;
}

export function CorrelationHeatmap({ labels, matrix }: { labels: string[]; matrix: number[][] }) {
  const tone = (v:number)=> v>0.75 ? 'bg-indigo-600 text-white' : v>0.5 ? 'bg-indigo-300 text-slate-900' : v>0.2 ? 'bg-sky-100 text-slate-800' : v>0 ? 'bg-slate-100 text-slate-700' : 'bg-rose-100 text-rose-700';
  return <div className="overflow-x-auto"><div className="min-w-[520px]"><div className="grid gap-2" style={{gridTemplateColumns:`110px repeat(${labels.length}, minmax(0,1fr))`}}><div></div>{labels.map((l, idx)=><div key={`col-${l}-${idx}`} className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{l}</div>)}{labels.map((row,rowIdx)=><div key={`row-${row}-${rowIdx}`} className="contents"><div className="flex items-center text-sm font-semibold text-slate-600">{row}</div>{matrix[rowIdx].map((v,colIdx)=><div key={`cell-${rowIdx}-${colIdx}`} className={`rounded-2xl px-3 py-4 text-center text-sm font-medium ${tone(v)}`}>{v.toFixed(2)}</div>)}</div>)}</div></div></div>;
}

export function SavingsRateTrend({ data }: { data: { month: string; rate: number }[] }) {
  return <div className="h-[260px] w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top:10, right:10, left:-10, bottom:0 }}><CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" /><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill:'#64748b', fontSize:12 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill:'#64748b', fontSize:12 }} /><Tooltip contentStyle={tooltipStyle} /><Line type="monotone" dataKey="rate" stroke="#4f46e5" strokeWidth={2.5} dot={false} /></LineChart></ResponsiveContainer></div>;
}

export function DebtPayoffChart({ data }: { data: { month: string; home: number; auto: number; credit: number }[] }) {
  return <div className="h-[280px] w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top:10, right:10, left:-10, bottom:0 }}><CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" /><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill:'#64748b', fontSize:12 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill:'#64748b', fontSize:12 }} /><Tooltip contentStyle={tooltipStyle} /><Line type="monotone" dataKey="home" stroke="#4f46e5" strokeWidth={2.3} dot={false} /><Line type="monotone" dataKey="auto" stroke="#0f766e" strokeWidth={2.3} dot={false} /><Line type="monotone" dataKey="credit" stroke="#f59e0b" strokeWidth={2.3} dot={false} /></LineChart></ResponsiveContainer></div>;
}

export function RunwayChart({ data }: { data: { month: string; value: number }[] }) {
  return <div className="h-[260px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ top:10, right:10, left:-10, bottom:0 }}><defs><linearGradient id="runwayFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0f766e" stopOpacity={0.2} /><stop offset="95%" stopColor="#0f766e" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" /><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill:'#64748b', fontSize:12 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill:'#64748b', fontSize:12 }} /><Tooltip contentStyle={tooltipStyle} /><Area type="monotone" dataKey="value" stroke="#0f766e" fill="url(#runwayFill)" strokeWidth={2.4} /></AreaChart></ResponsiveContainer></div>;
}

export function GoalProgressCards({ items }: { items: { title: string; funded: number; target: string; current: string }[] }) {
  return <div className="grid gap-4 md:grid-cols-3">{items.map(item=><div key={item.title} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4"><div className="text-sm font-semibold text-slate-950">{item.title}</div><div className="mt-2 flex items-end justify-between gap-3"><div className="text-xl font-semibold tracking-[-0.03em] text-slate-950">{item.funded}%</div><div className="text-sm text-slate-500">{item.current} / {item.target}</div></div><div className="mt-3 h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-indigo-500" style={{width:`${item.funded}%`}} /></div></div>)}</div>;
}

export function FunnelView({ data }: { data: { stage: string; value: number }[] }) {
  return <div className="h-[300px] w-full"><ResponsiveContainer width="100%" height="100%"><FunnelChart><Tooltip contentStyle={tooltipStyle} /><Funnel dataKey="value" data={data} isAnimationActive><LabelList position="right" fill="#475569" stroke="none" dataKey="stage" /></Funnel></FunnelChart></ResponsiveContainer></div>;
}

export function SankeyLike({ data }: { data: { from: string; to: string; value: string }[] }) {
  return <div className="grid gap-3 md:grid-cols-2">{data.map((flow,i)=><div key={i} className="rounded-[22px] border border-slate-100 bg-slate-50/80 p-4"><div className="flex items-center justify-between gap-3"><div className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700">{flow.from}</div><div className="text-sm font-semibold text-slate-400">→</div><div className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700">{flow.to}</div></div><div className="mt-3 text-center text-lg font-semibold tracking-[-0.03em] text-slate-950">{flow.value}</div></div>)}</div>;
}
