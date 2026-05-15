import React, { useMemo, useState } from "react";

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  FileDownloadOutlined,
  Search,
  CheckCircle,
  WarningAmber,
  AccessTime,
  KeyboardArrowDown,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

const Inspection = ({ data }) => {
  const inspection = data || {};

  const [activeTab, setActiveTab] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const STATUS_CONFIG = {
    clean: {
      label: "Clean Pass",
      className:
        "bg-[#eaf8ef] text-[#16a34a] border border-[#cdeed8]",
    },

    violation: {
      label: "1 Violation",
      className:
        "bg-[#fff7eb] text-[#d97706] border border-[#fde7b2]",
    },

    oos: {
      label: "Out of Service",
      className:
        "bg-[#fef0f0] text-[#dc2626] border border-[#fecaca]",
    },
  };

  const filteredTable = useMemo(() => {
    let filtered = inspection?.tableData || [];

    // TOP TABS
    if (activeTab !== "all") {
      filtered = filtered.filter(
        (item) => item.status === activeTab
      );
    }

    // DROPDOWN FILTER
    if (levelFilter !== "all") {

      // CLEAN
      if (levelFilter === "clean") {
        filtered = filtered.filter(
          (item) => item.status === "clean"
        );
      }

      // RISK / VIOLATION
      else if (levelFilter === "risk") {
        filtered = filtered.filter(
          (item) => item.status === "violation"
        );
      }

      // OOS
      else if (levelFilter === "oos") {
        filtered = filtered.filter(
          (item) => item.status === "oos"
        );
      }

      // LEVEL TYPE
      else {
        filtered = filtered.filter((item) =>
          item.type
            ?.toLowerCase()
            .includes(levelFilter.toLowerCase())
        );
      }
    }

    // SEARCH
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.refId
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          item.region
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    // Reset to first page when filters change
    return filtered;
  }, [inspection, activeTab, levelFilter, search]);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredTable.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecords = filteredTable.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="px-[28px] py-[30px] bg-[#f8fafc]">

      {/* HEADER */}
      <div className="flex items-start justify-between mb-8">

        <div>
          <h2 className="text-[24px] leading-[38px] font-[600] tracking-[-0.04em] text-[#111827]">
            Inspection Analysis
          </h2>

          <p className="mt-1 text-[13px] font-[500] text-[#94a3b8]">
            Real-time safety compliance and vehicle performance metrics
          </p>
        </div>

        <button
          onClick={exportPDF}
          className="h-[42px] px-3 rounded-[14px] border border-[#dbe3ef] bg-white flex items-center gap-2 text-[12px] font-[700] text-[#334155] shadow-sm hover:bg-[#f8fafc] transition-all"
        >
          <FileDownloadOutlined sx={{ fontSize: 17 }} />

          Export PDF
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-4 gap-5 mb-8">

        {(inspection?.summaryCards || []).map((card) => {

          const ICONS = {
            clean: (
              <CheckCircle className="!text-[#2563eb] !text-[19px]" />
            ),

            risk: (
              <WarningAmber className="!text-[#c2410c] !text-[19px]" />
            ),

            stable: (
              <CheckCircle className="!text-[#16a34a] !text-[19px]" />
            ),

            neutral: (
              <AccessTime className="!text-[#64748b] !text-[19px]" />
            ),
          };

          return (
            <div
              key={card.id}
              className="bg-white border border-[#dbe3ef] rounded-[26px] px-6 py-6"
            >

              {/* TOP */}
{/* SUMMARY CARDS TOP SECTION */}
<div className="flex items-center justify-between mb-8">
  {/* ICON CONTAINER */}
  <div 
    className={`w-[42px] h-[42px] rounded-full flex items-center justify-center ${
      card.type === 'clean' ? 'bg-[#eff6ff]' : 
      card.type === 'risk' ? 'bg-[#fff7ed]' : 
      card.type === 'stable' ? 'bg-[#f0fdf4]' : 
      'bg-[#f8fafc]'
    }`}
  >
    {/* Ensure the icon itself doesn't have restrictive margins */}
<div className="w-[42px] h-[42px] rounded-full bg-[#f8fafc] grid place-items-center">
  {/* Wrap the icon in a div to reset any MUI positioning */}
  <div className="flex items-center justify-center">
    {ICONS[card.type]}
  </div>
</div>
  </div>

  {/* TITLE BADGE */}
  <div 
    className={`px-3 py-[6px] rounded-full text-[9px] font-[800] tracking-[0.08em] uppercase ${
      card.type === 'clean' ? 'bg-[#eff6ff] text-[#2563eb]' : 
      card.type === 'risk' ? 'bg-[#fff7ed] text-[#c2410c]' : 
      card.type === 'stable' ? 'bg-[#f0fdf4] text-[#16a34a]' : 
      'bg-[#f8fafc] text-[#94a3b8]'
    }`}
  >
    {card.title}
  </div>
</div>

              {/* VALUE */}
              <h3 className="text-[23px] leading-none font-[800] tracking-[-0.04em] text-[#0f172a]">
                {card.value}
              </h3>

              {/* SUBTITLE */}
              <p className="mt-3 text-[10px] font-[800] tracking-[0.08em] uppercase text-[#94a3b8]">
                {card.subtitle}
              </p>

              {/* FOOTER */}
              <div className="mt-4 pt-4 border-t border-[#c4c7cb] flex items-center gap-2">

                {card.trend && (
                  <span
                    className={`text-[12px] font-[800] ${
                      card.trend.includes("+")
                        ? "text-[#dc2626]"
                        : "text-[#16a34a]"
                    }`}
                  >
                    {card.trend}
                  </span>
                )}

                <span className="text-[12px] font-[500] text-[#64748b]">
                  {card.footer}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CHART */}
      <div className="bg-white border border-[#dbe3ef] rounded-[32px] overflow-hidden mb-8">

        {/* TOP */}
        <div className="px-9 pt-8 flex items-start justify-between">

          <div>
            <h3 className="text-[18px] leading-none font-[800] tracking-[-0.03em] text-[#0f172a]">
              Performance Trends
            </h3>

            <p className="mt-2 text-[13px] text-[#64748b]">
              Twelve-month historical view of inspection outcomes
            </p>
          </div>

          {/* LEGEND */}
          <div className="flex items-center gap-8 px-7 h-[48px] rounded-full border border-[#e8edf5] bg-[#f8fafc]">

            <div className="flex items-center gap-3">
              <div className="w-[10px] h-[10px] rounded-full bg-[#0f52d6]" />

              <span className="text-[9px] font-[800] tracking-[0.12em] uppercase text-[#475569]">
                Clean
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-[10px] h-[10px] rounded-full bg-[#d8e0ec]" />

              <span className="text-[9px] font-[800] tracking-[0.12em] uppercase text-[#475569]">
                Violations
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-[10px] h-[10px] rounded-full bg-[#d19a77]" />

              <span className="text-[9px] font-[800] tracking-[0.12em] uppercase text-[#475569]">
                OOS
              </span>
            </div>
          </div>
        </div>

        {/* CHART */}
        <div className="h-[500px] px-3 pt-6 pb-4">

          <ResponsiveContainer width="100%" height="100%">

            <ComposedChart
              data={inspection?.chartData || []}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 0,
              }}
            >

              <CartesianGrid
                vertical={false}
                stroke="#eef2f7"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tickMargin={14}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 11,
                  fontWeight: 800,
                }}
              />

              <YAxis hide />

              <Tooltip
                cursor={{
                  fill: "rgba(15,23,42,0.03)",
                }}
                contentStyle={{
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  boxShadow:
                    "0px 10px 30px rgba(15,23,42,0.08)",
                  fontSize: "12px",
                }}
              />

              {/* BACK BAR */}
              <Bar
                dataKey="violations"
                fill="#e3eaf4"
                radius={[30, 30, 30, 30]}
                barSize={18}
              />

              {/* FRONT BAR */}
              <Bar
                dataKey="oos"
                fill="#e8c4b4"
                radius={[30, 30, 30, 30]}
                barSize={18}
              />

              {/* AREA */}
              <Area
                type="monotone"
                dataKey="clean"
                stroke="#0f52d6"
                fill="#0f52d61a"
                strokeWidth={4}
                dot={{
                  r: 6,
                  strokeWidth: 3,
                  fill: "#ffffff",
                  stroke: "#0f52d6",
                }}
                activeDot={{
                  r: 7,
                  fill: "#0f52d6",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLE */}
 <div className="bg-white border border-[#dbe3ef] rounded-[24px] p-4 mb-6 flex items-center justify-between shadow-sm">
  
  {/* SEARCH SECTION */}
  <div className="relative w-[500px]">
    <Search className="absolute left-5 top-1/2 -translate-y-1/2 !text-[20px] text-[#94a3b8]" />
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Filter by ID, State, or Driver"
     className="w-full h-[45px] bg-[#f8fafc] border border-[#eef2f7] rounded-[16px] pl-11 pr-7 text-[13px] text-[#0f172a] outline-none"
    />
  </div>

  {/* RIGHT ACTIONS */}
  <div className="flex items-center gap-4">
    {/* TABS STYLING */}
    <div className="flex items-center bg-[#f1f5f9] rounded-xl p-1">
      {["All", "Clean", "Risk"].map((label) => (
        <button
          key={label}
          onClick={() => setActiveTab(label.toLowerCase())}
          className={`px-6 h-[30px] rounded-xl text-[11px] font-[700] transition-all ${
            activeTab === label.toLowerCase()
              ? "bg-white text-[#0f172a] shadow-sm"
              : "text-[#64748b] hover:text-[#0f172a]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>

    {/* LEVEL DROPDOWN */}
    <div className="flex items-center gap-2">



              <span className="text-[9px] font-[800] uppercase tracking-[0.08em] text-[#94a3b8]">

                Level:

              </span>



              <div className="relative">



                <select

                  value={levelFilter}

                  onChange={(e) =>

                    setLevelFilter(e.target.value)

                  }

                  className="appearance-none h-[40px] min-w-[130px] pr-10 pl-4 rounded-[14px] border border-[#dbe3ef] bg-white text-[12px] font-[700] text-[#0f172a] outline-none"

                >

                  {(inspection?.dropdownOptions || []).map(

                    (option) => (

                      <option

                        key={option.value}

                        value={option.value}

                      >

                        {option.label}

                      </option>

                    )

                  )}

                </select>



                <KeyboardArrowDown className="absolute right-3 top-1/2 -translate-y-1/2 !text-[18px] text-[#94a3b8] pointer-events-none" />

              </div>

            </div>

          </div>

        </div>

{/* --- 2. STANDALONE TABLE CARD --- */}
<div className="bg-white border border-[#dbe3ef] rounded-[24px] overflow-hidden shadow-sm">
  <table className="w-full">
    <thead className="bg-[#f8fafc]/50">
      <tr className="border-b border-[#f1f5f9]">
        <th className="px-8 py-5 text-left text-[11px] font-[700] uppercase tracking-wider text-[#64748b]">Date & Region</th>
        <th className="px-8 py-5 text-left text-[11px] font-[700] uppercase tracking-wider text-[#64748b]">Type</th>
        <th className="px-8 py-5 text-left text-[11px] font-[700] uppercase tracking-wider text-[#64748b]">Reference ID</th>
        <th className="px-8 py-5 text-right text-[11px] font-[700] uppercase tracking-wider text-[#64748b]">Safety Status</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-[#f1f5f9]">
      {currentRecords.map((item, idx) => (
        <tr key={idx} className="hover:bg-[#f8fafc] transition-colors">
          <td className="px-8 py-6">
            <p className="text-[14px] font-[700] text-[#0f172a]">{item.date}</p>
            <p className="text-[12px] text-[#94a3b8] font-[500] mt-0.5">{item.region}</p>
          </td>
          <td className="px-8 py-6 text-[14px] font-[500] text-[#475569]">{item.type}</td>
          <td className="px-8 py-6">
            <span className="text-[14px] font-[700] text-[#2563eb] border-b border-transparent hover:border-[#2563eb] cursor-pointer">
              {item.refId}
            </span>
          </td>
          <td className="px-8 py-6 text-right">
            <span className={`inline-flex items-center gap-2 px-4 h-[34px] rounded-full text-[12px] font-[700] ${STATUS_CONFIG[item.status]?.className}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {STATUS_CONFIG[item.status]?.label}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

        {/* --- UPDATED FOOTER WITH PAGINATION --- */}
        <div className="px-8 py-5 border-t border-[#eef2f7] flex items-center justify-between">
<p className="text-[12px] text-[#64748b]">
            Showing <span className="font-[600] text-[#1e293b]">{indexOfFirstItem + 1}</span> to{" "}
            <span className="font-[600] text-[#1e293b]">{Math.min(indexOfLastItem, filteredTable.length)}</span> of{" "}
            {filteredTable.length} results
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-[#dbe3ef] disabled:opacity-30 hover:bg-[#f8fafc] transition-all"
            >
              <ChevronLeft sx={{ fontSize: 18, color: '#64748b' }} />
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`w-8 h-8 rounded-full text-[11px] font-[800] transition-all ${
                    currentPage === i + 1
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : "text-[#64748b] hover:bg-[#f8fafc]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border border-[#dbe3ef] disabled:opacity-30 hover:bg-[#f8fafc] transition-all"
            >
              <ChevronRight sx={{ fontSize: 18, color: '#64748b' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inspection;