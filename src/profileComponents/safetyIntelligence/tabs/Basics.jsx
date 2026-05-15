import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { 
    CalendarMonth, IosShare, TrendingUp, TrendingDown, 
    HorizontalRule, ErrorOutlined, Search, FilterList, 
    ChevronLeft, ChevronRight, CheckCircle, Cancel 
} from '@mui/icons-material';

// ALL COLORS DEFINED LOCALLY
const CATEGORY_COLORS = {
    'UNSAFE DRIVING': { text: '#2563eb', bg: '#eff6ff', main: '#2563eb' },
    'HOS COMPL.': { text: '#d97706', bg: '#fffbeb', main: '#f59e0b' },
    'VEHICLE MAINT.': { text: '#dc2626', bg: '#fef2f2', main: '#ef4444' },
    'DRIVER FITNESS': { text: '#059669', bg: '#ecfdf5', main: '#10b981' },
    'HAZMAT': { text: '#7c3aed', bg: '#f5f3ff', main: '#8b5cf6' },
    'CRASH INDICATOR': { text: '#334155', bg: '#f8fafc', main: '#64748b' }
};

const METRIC_CONFIG = [
    { key: 'unsafeDriving', label: 'UNSAFE DRIVING', color: '#2563eb' },
    { key: 'crashIndicator', label: 'CRASH INDICATOR', color: '#3b82f6' },
    { key: 'hosCompliance', label: 'HOS COMPLIANCE', color: '#dc2626' },
    { key: 'vehicleMaint', label: 'MAINTENANCE', color: '#b91c1c' },
    { key: 'controlledSubstances', label: 'DRUG & ALCOHOL', color: '#cbd5e1' },
    { key: 'driverFitness', label: 'DRIVER FITNESS', color: '#3b82f6' },
    { key: 'hazmat', label: 'HAZMAT COMPL.', color: '#2563eb' },
];

const Basics = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAllViolations, setShowAllViolations] = useState(false);
    const [page, setPage] = useState(1);
    const [selectedRange, setSelectedRange] = useState('12');
    const itemsPerPage = 3;

    const basics = data;

    // Filter Logic
    const filteredLogs = useMemo(() => {
        if (!basics?.comprehensiveLog) return [];
        return basics.comprehensiveLog.filter(log => 
            log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, basics]);

    const filteredTrendData = useMemo(() => {
    const months = parseInt(selectedRange);

    if (!months) return basics.trendData;

    return basics.trendData.slice(-months);
}, [selectedRange, basics.trendData]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const paginatedData = filteredLogs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    if (!basics) return <div className="p-20 text-center font-bold">Loading Safety Intelligence...</div>;

    return (
        <div className="p-6 bg-[#f8fafc] space-y-6">
            {/* CSS to hide scrollbar */}
            <style>
                {`
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}
            </style>

            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-extrabold text-[#001b3d]">Safety Performance</h2>
                    <p className="text-[10px] font-bold text-[#94a3b8] tracking-widest mt-1 uppercase">
                        Real-time compliance monitoring and risk assessment
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 border border-gray-300 bg-white px-3 py-1.5 rounded-lg text-[12px] font-bold text-[#001b3d] shadow-sm">
                        <CalendarMonth sx={{ fontSize: 18 }} /> October 2023
                    </div>
                    <button className="flex items-center gap-2 border border-gray-300 bg-white px-3 py-1.5 rounded-lg text-[12px] font-bold text-[#001b3d] shadow-sm">
                        <IosShare sx={{ fontSize: 18 }} /> EXPORT
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-4">
                {METRIC_CONFIG.map((config) => {
                    const metric = basics.basics_data?.[config.key] || { val: '0%', trend: '--' };
                    const isUp = metric.trend.includes('↑');
                    return (
                        <div key={config.key} className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm">
                            <p className="text-[10px] font-bold text-[#94a3b8] mb-2 uppercase">{config.label}</p>
                            <div className="flex items-end gap-1">
                                <span className="text-[20px] font-extrabold text-[#001b3d]">{metric.val}</span>
                                {metric.trend !== '--' && (
                                    <span className={`flex items-center text-[10px] font-bold mb-1 ${isUp ? 'text-red-500' : 'text-green-500'}`}>
                                        {isUp ? <TrendingUp sx={{fontSize:14}}/> : <TrendingDown sx={{fontSize:14}}/>}
                                        {metric.trend.replace(/[↑↓]/g, '')}
                                    </span>
                                )}
                            </div>
                            <div className="w-full bg-slate-100 h-[4px] mt-3 rounded-full overflow-hidden">
                                <div className="h-full transition-all duration-500" style={{ width: metric.val, backgroundColor: config.color }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Warning Banner */}
            <div className="bg-[#fff1f2] border border-[#fecaca] px-6 py-4 rounded-2xl flex justify-between items-center mt-10 ">
                <div className="flex items-center gap-3 text-[#991b1b] text-[13px] font-extrabold">
                    <ErrorOutlined sx={{ fontSize: 22 }} />
                    Critical Maintenance Warning: {basics.criticalWarning}
                </div>
                <button className="bg-white border border-[#fecaca] text-[#991b1b] px-6 py-2 rounded-xl text-[11px] font-[900] uppercase tracking-wider hover:bg-red-50">
                    View List
                </button>
            </div>

            <div className="grid grid-cols-12 gap-6">
  <div className="col-span-8 h-[500px] bg-white p-8 rounded-[24px] border border-[#e2e8f0] shadow-sm flex flex-col">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-[17px] font-[900] text-[#001b3d]">Basic Measures Trend</h3>
                            <p className="text-[12px] mb:3 text-slate-400  ">Historical percentile scores by month</p>
                        </div>
<select
    value={selectedRange}
    onChange={(e) => setSelectedRange(e.target.value)}
    className="border bg-[#f8fafc] px-4 py-2 rounded-xl text-[11px] font-black outline-none text-[#475569]"
>
    {basics.dropdownOptions?.map((option) => (
        <option key={option.value} value={option.value}>
            {option.label}
        </option>
    ))}
</select>
                    </div>
                    
<div className="h-[360px] w-full ">
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart
      data={filteredTrendData}
      margin={{
        top: 10,
        right: 0,
        left: 0,
        bottom: 0,
      }}
    >
      {/* Gradient */}
      <defs>
        <linearGradient id="mainGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity={0.18} />
          <stop offset="70%" stopColor="#2563eb" stopOpacity={0.08} />
          <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
        </linearGradient>
      </defs>

      {/* Grid */}
      <CartesianGrid
        vertical={false}
        stroke="#edf2f7"
        strokeDasharray="3 3"
      />

      {/* X Axis */}
      <XAxis
        dataKey="month"
        axisLine={false}
        tickLine={false}
        dy={12}
        tick={{
          fill: "#94a3b8",
          fontSize: 11,
          fontWeight: 700,
        }}
      />

      {/* Y Axis */}
      <YAxis
        domain={[0, 100]}
        axisLine={false}
        tickLine={false}
        tickFormatter={(v) => `${v}%`}
        tick={{
          fill: "#94a3b8",
          fontSize: 11,
          fontWeight: 700,
        }}
      />

      {/* Tooltip */}
      <Tooltip
        cursor={false}
        contentStyle={{
          border: "1px solid #e2e8f0",
          borderRadius: "18px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          fontSize: "12px",
        }}
      />

      {/* Maintenance Line */}
      <Line
        type="basis"
        dataKey="maint"
        stroke="#94a3b8"
        strokeWidth={2}
        strokeDasharray="4 4"
        dot={false}
        activeDot={false}
      />

      {/* Crash Indicator Line */}
      <Line
        type="basis"
        dataKey="crash"
        stroke="#d1d5db"
        strokeWidth={2}
        dot={false}
        activeDot={false}
      />

      {/* Unsafe Driving Area */}
      <Area
        type="basis"
        dataKey="unsafe"
        stroke="#2563eb"
        strokeWidth={3}
        fill="url(#mainGradient)"
        dot={{
          r: 4,
          strokeWidth: 2,
          fill: "#fff",
          stroke: "#2563eb",
        }}
        activeDot={{
          r: 6,
          strokeWidth: 2,
          fill: "#fff",
          stroke: "#2563eb",
        }}
      />
    </AreaChart>
  </ResponsiveContainer>

  {/* Bottom Legend */}
  <div className="flex items-center justify-center gap-8 mt-6">

    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-[#2563eb]" />
      <span className="text-[13px] font-bold text-[#475569]">
        Unsafe Driving
      </span>
    </div>

    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-[#94a3b8]" />
      <span className="text-[13px] font-bold text-[#475569]">
        Maintenance
      </span>
    </div>

    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-[#d1d5db]" />
      <span className="text-[13px] font-bold text-[#cbd5e1]">
        Crash Indicator
      </span>
    </div>

  </div>
</div>
                </div>

                {/* Recent Violations - Scrollbar Hidden */}
                <div className="col-span-4 bg-white p-6 rounded-[24px] border border-[#e2e8f0] shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-9">
                        <h3 className="text-[14px] font-[900] text-[#001b3d]">Recent Violations</h3>
                        <button 
                            onClick={() => setShowAllViolations(!showAllViolations)}
                            className="text-[11px] font-black text-blue-600 uppercase tracking-tighter"
                        >
                            View All
                        </button>
                    </div>
                    <div className={`space-y-6 overflow-y-auto no-scrollbar ${showAllViolations ? 'max-h-[400px]' : 'max-h-[360px]'}`}>
                        {basics.recentViolations.map((v) => (
                            <div key={v.id} className="border-b border-slate-50 pb-4 last:border-0">
                                <div className="flex justify-between text-[9px] font-black mb-2">
                                    <span style={{ color: CATEGORY_COLORS[v.type]?.text || '#64748b' }} className="px-2 py-0.5 mb-2 bg-slate-50 rounded uppercase">
                                        {v.type}
                                    </span>
                                    <span className="text-slate-400">{v.date}</span>
                                </div>
                                <p className="text-[13px] font-[800] text-[#001b3d] leading-tight ">{v.title}</p>
                                <div className="flex items-center gap-3 mt-4">
                                    <span className="h-6 w-6  rounded-full bg-red-50 text-red-600 flex items-center justify-center text-[11px] font-[900]">
                                        {v.severity}
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-400">Vehicle {v.vehicle}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Comprehensive Log (Table) */}
            <div className="bg-white rounded-[24px] border border-[#e2e8f0] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-[16px] font-[900] text-[#001b3d]">Comprehensive Log</h3>
                        <p className="text-[13px] text-slate-400  mt-1">Filter and export violation history</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 !text-[20px]" />
                            <input 
                                type="text" 
                                placeholder="Search by ID, driver, or type..."
                                className="pl-12 pr-4 py-2  border-0 rounded-2xl text-[13px] w-[300px] outline-none ring-1 ring-slate-200 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}}
                            />
                        </div>
                        <button className="flex items-center gap-2 border border-gray-300 bg-white px-5 py-2 rounded-2xl text-[13px] font-extrabold text-[#475569] shadow-sm">
                            <FilterList sx={{fontSize:20}}/> Filters
                        </button>
                    </div>
                </div>
                
                <table className="w-full">
                    <thead className="bg-[#f8fafc] text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-5 text-left">Date</th>
                            <th className="px-8 py-5 text-left">BASIC Category</th>
                            <th className="px-8 py-5 text-left">Subgroup</th>
                            <th className="px-8 py-5 text-left">Violation Description</th>
                            <th className="px-8 py-5 text-center">Severity</th>
                            <th className="px-8 py-5 text-center">OOS Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {paginatedData.map((log, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6 text-[12px] font-bold text-[#475569]">{log.date}</td>
                                <td className="px-8 py-6">
                                    <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase" 
                                          style={{ background: CATEGORY_COLORS[log.category]?.bg, color: CATEGORY_COLORS[log.category]?.text }}>
                                        {log.category}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-[12px] font-bold text-slate-400">{log.subgroup}</td>
                                <td className="px-8 py-6 text-[13px] font-extrabold text-[#001b3d]">{log.description}</td>
                                <td className="px-8 py-6 text-center">
                                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[12px] font-black">{log.severity}</span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    {log.oos ? <Cancel className="text-red-500 !text-[24px]" /> : <CheckCircle className="text-emerald-500 !text-[24px]" />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p-6 bg-white border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[12px] font-black text-slate-400 uppercase">
                        Showing {(page-1)*itemsPerPage + 1}-{Math.min(page*itemsPerPage, filteredLogs.length)} of {filteredLogs.length} results
                    </span>
                    <div className="flex gap-3">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-6 py-2 border rounded-xl text-[11px] font-black tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all"
                        >
                            Previous
                        </button>
                        <button 
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-6 py-2 border rounded-xl text-[11px] font-black tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Basics;