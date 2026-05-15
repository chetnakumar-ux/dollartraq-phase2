// LoadHistory.jsx

import React, { useMemo, useState } from 'react';

import {
    Search,
    MoreVert,
    ChevronLeft,
    ChevronRight,
    KeyboardArrowDown,
    InsightsOutlined,
    LocalShippingOutlined,
    PieChart,
    WarningAmberOutlined
} from '@mui/icons-material';

function LoadHistory({ data }) {

    const history = data || {};

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [openMenu, setOpenMenu] = useState(null);

    const rowsPerPage = 4;

    const filteredRows = useMemo(() => {

        let rows = [...(history?.tableData || [])];

        if (search) {

            const keyword = search.toLowerCase();

            rows = rows.filter((item) =>
                item.shipper?.toLowerCase().includes(keyword) ||
                item.status?.toLowerCase().includes(keyword)
            );
        }

        return rows;

    }, [history, search]);

    const totalPages = Math.ceil(
        filteredRows.length / rowsPerPage
    );

    const paginatedRows = filteredRows.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    const handlePrev = () => {

        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    const handleNext = () => {

        if (page < totalPages) {
            setPage((prev) => prev + 1);
        }
    };

    return (
        <div className="rounded-[18px] border border-[#d9e1ee] bg-white p-[18px]">

            {/* TOP */}

            <div className="flex items-center gap-2">

                <div className="h-[7px] w-[7px] rounded-full bg-emerald-500" />

                <h2 className="text-[12px] font-[800] tracking-[1px] text-[#0f172a] uppercase">
                    Load History
                </h2>

            </div>

            <p className="mt-[8px] text-[10px] leading-[16px] text-[#94a3b8]">
                Fleet tractors and trailers identified through observations on the road.
                Note: If the carrier has no recent observations, equipment may not be shown —
                even if power units are reported.
            </p>

            {/* STATS */}

            <div className="grid grid-cols-4 gap-[14px] mt-[22px]">

                {history?.summaryCards?.map((card) => (

                    <div
                        key={card.id}
                        className={`rounded-[14px] border p-[16px]
                        ${card.active
                                ? 'border-[#2563eb]'
                                : 'border-[#e2e8f0]'
                            }`}
                    >

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-[6px]">

                                {card.icon === 'insight' && (
                                    <InsightsOutlined
                                        sx={{
                                            fontSize: 16,
                                            color: '#2563eb'
                                        }}
                                    />
                                )}

                                {card.icon === 'truck' && (
                                    <LocalShippingOutlined
                                        sx={{
                                            fontSize: 16,
                                            color: '#059669'
                                        }}
                                    />
                                )}

                                {card.icon === 'chart' && (
                                    <PieChart
                                        sx={{
                                            fontSize: 16,
                                            color: '#ea580c'
                                        }}
                                    />
                                )}

                                {card.icon === 'warning' && (
                                    <WarningAmberOutlined
                                        sx={{
                                            fontSize: 16,
                                            color: '#dc2626'
                                        }}
                                    />
                                )}

                                <p className="text-[11px] font-[700] text-[#0f172a]">
                                    {card.title}
                                </p>

                            </div>

                        </div>

                        <div className="mt-[16px] flex items-end gap-[6px]">

                            <h3 className="text-[38px] leading-none font-[800] text-[#111827]">
                                {card.value}
                            </h3>

                            {card.label && (
                                <span className="mb-[5px] text-[11px] text-[#94a3b8]">
                                    {card.label}
                                </span>
                            )}

                        </div>

                        <p className="mt-[12px] text-[10px] text-[#94a3b8]">
                            {card.subtitle}
                        </p>

                        {card.progress && (

                            <div className="mt-[14px]">

                                <div className="flex items-center justify-between mb-[5px]">

                                    <span className="text-[10px] text-[#64748b]">
                                        Confidence Score
                                    </span>

                                    <span className="text-[10px] font-[700] text-[#2563eb]">
                                        {card.progress}%
                                    </span>

                                </div>

                                <div className="h-[6px] rounded-full bg-[#e2e8f0] overflow-hidden">

                                    <div
                                        className="h-full rounded-full bg-[#2563eb]"
                                        style={{
                                            width: `${card.progress}%`
                                        }}
                                    />

                                </div>

                            </div>

                        )}

                    </div>

                ))}

            </div>

            {/* MIDDLE */}

            <div className="grid grid-cols-12 gap-[16px] mt-[18px]">

                {/* INSIGHTS */}

                <div className="col-span-7 rounded-[14px] border border-[#e2e8f0] overflow-hidden">

                    <div className="h-[42px] px-[16px] border-b border-[#e2e8f0] flex items-center">

                        <p className="text-[12px] font-[700] text-[#0f172a]">
                            Key Insights
                        </p>

                    </div>

                    <div className="p-[14px] space-y-[12px]">

                        {history?.insights?.map((item) => (

                            <div
                                key={item.id}
                                className="rounded-[12px] border border-[#edf2f7] bg-[#f8fafc] p-[14px]"
                            >

                                <div className="flex items-start gap-[12px]">

                                    <div className="h-[28px] w-[28px] rounded-[8px] bg-white border border-[#e2e8f0] flex items-center justify-center">

                                        <InsightsOutlined
                                            sx={{
                                                fontSize: 15,
                                                color: '#2563eb'
                                            }}
                                        />

                                    </div>

                                    <p className="text-[11px] leading-[18px] text-[#475569]">
                                        {item.text}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

                {/* DONUT */}

                <div className="col-span-5 rounded-[14px] border border-[#e2e8f0] overflow-hidden">

                    <div className="h-[42px] px-[16px] border-b border-[#e2e8f0] flex items-center justify-between">

                        <p className="text-[12px] font-[700] text-[#0f172a]">
                            Customer Concentration
                        </p>

                        <div className="h-[24px] px-[10px] rounded-full bg-[#ecfdf3] flex items-center text-[10px] font-[700] text-[#16a34a]">
                            19% Top 5
                        </div>

                    </div>

                    <div className="p-[20px]">

                        <div className="flex justify-center">

                            <div className="relative h-[130px] w-[130px] rounded-full border-[8px] border-[#2563eb] flex items-center justify-center">

                                <div className="text-center">

                                    <h3 className="text-[28px] font-[800] text-[#111827]">
                                        19%
                                    </h3>

                                    <p className="text-[10px] text-[#94a3b8] uppercase">
                                        Total Top 4
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="mt-[22px] space-y-[14px]">

                            {history?.customers?.map((item) => (

                                <div
                                    key={item.id}
                                    className="flex items-center justify-between"
                                >

                                    <div className="flex items-center gap-[8px]">

                                        <div
                                            className="h-[7px] w-[7px] rounded-full"
                                            style={{
                                                background: item.color
                                            }}
                                        />

                                        <span className="text-[11px] text-[#475569]">
                                            {item.name}
                                        </span>

                                    </div>

                                    <span className="text-[11px] font-[700] text-[#0f172a]">
                                        {item.value}
                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            </div>

            {/* TABLE */}

            <div className="mt-[18px] rounded-[14px] border border-[#e2e8f0] overflow-hidden">

                {/* TABLE HEADER */}

                <div className="h-[52px] px-[18px] border-b border-[#e2e8f0] flex items-center justify-between">

                    <h3 className="text-[12px] font-[700] text-[#0f172a]">
                        Detailed Shipper Performance
                    </h3>

                    <div className="flex items-center gap-[10px]">

                        <div className="relative">

                            <Search
                                sx={{
                                    fontSize: 16
                                }}
                                className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#94a3b8]"
                            />

                            <input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search..."
                                className="h-[34px] w-[190px] rounded-[10px] border border-[#d9e1ee] bg-white pl-[34px] pr-[10px] text-[11px] outline-none"
                            />

                        </div>

                        <button className="h-[34px] w-[34px] rounded-[10px] border border-[#d9e1ee] flex items-center justify-center">

                            <MoreVert sx={{ fontSize: 18 }} />

                        </button>

                    </div>

                </div>

                {/* TABLE */}

                <table className="w-full">

                    <thead className="bg-[#f8fafc]">

                        <tr>

                            {[
                                'SHIPPER NAME',
                                'TOTAL VOLUME',
                                'ON-TIME %',
                                'REVENUE',
                                'STATUS'
                            ].map((head) => (

                                <th
                                    key={head}
                                    className="px-[18px] py-[14px] text-left text-[9px] font-[800] tracking-[1px] text-[#94a3b8] uppercase"
                                >
                                    {head}
                                </th>

                            ))}

                        </tr>

                    </thead>

                    <tbody>

                        {paginatedRows?.map((row) => (

                            <tr
                                key={row.id}
                                className="border-t border-[#eef2f7]"
                            >

                                <td className="px-[18px] py-[16px]">

                                    <div className="flex items-center gap-[10px]">

                                        <div className="h-[22px] w-[22px] rounded-full bg-[#e0edff] flex items-center justify-center text-[10px] font-[700] text-[#2563eb]">
                                            {row.id}
                                        </div>

                                        <span className="text-[12px] font-[600] text-[#0f172a]">
                                            {row.shipper}
                                        </span>

                                    </div>

                                </td>

                                <td className="px-[18px] py-[16px] text-[12px] text-[#475569]">
                                    {row.volume}
                                </td>

                                <td className="px-[18px] py-[16px]">

                                    <div className="flex items-center gap-[10px]">

                                        <div className="h-[4px] w-[90px] rounded-full bg-[#e2e8f0] overflow-hidden">

                                            <div
                                                className={`h-full rounded-full ${
                                                    row.performance >= 90
                                                        ? 'bg-[#059669]'
                                                        : 'bg-[#ea580c]'
                                                }`}
                                                style={{
                                                    width: `${row.performance}%`
                                                }}
                                            />

                                        </div>

                                        <span className="text-[11px] font-[700] text-[#0f172a]">
                                            {row.performance}%
                                        </span>

                                    </div>

                                </td>

                                <td className="px-[18px] py-[16px] text-[12px] text-[#0f172a] font-[700]">
                                    {row.revenue}
                                </td>

                                <td className="px-[18px] py-[16px]">

                                    <div
                                        className={`inline-flex items-center h-[24px] px-[10px] rounded-full text-[10px] font-[700]
                                        ${row.status === 'ACTIVE'
                                                ? 'bg-[#dcfce7] text-[#16a34a]'
                                                : 'bg-[#fee2e2] text-[#dc2626]'
                                            }`}
                                    >
                                        {row.status}
                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                {/* FOOTER */}

                <div className="h-[54px] px-[18px] border-t border-[#eef2f7] flex items-center justify-between">

                    <p className="text-[10px] text-[#94a3b8]">
                        Showing {(page - 1) * rowsPerPage + 1}-
                        {Math.min(page * rowsPerPage, filteredRows.length)} of {filteredRows.length} shippers
                    </p>

                    <div className="flex items-center gap-[10px]">

                        <button
                            disabled={page === 1}
                            onClick={handlePrev}
                            className={`h-[28px] w-[28px] rounded-full border border-[#d9e1ee] flex items-center justify-center
                            ${page === 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >

                            <ChevronLeft sx={{ fontSize: 16 }} />

                        </button>

                        {Array.from({
                            length: totalPages
                        }).map((_, index) => (

                            <button
                                key={index}
                                onClick={() => setPage(index + 1)}
                                className={`h-[24px] min-w-[24px] px-[6px] rounded-[6px] text-[10px] font-[700]
                                ${page === index + 1
                                        ? 'bg-[#2563eb] text-white'
                                        : 'text-[#64748b]'
                                    }`}
                            >
                                {index + 1}
                            </button>

                        ))}

                        <button
                            disabled={page === totalPages}
                            onClick={handleNext}
                            className={`h-[28px] w-[28px] rounded-full border border-[#d9e1ee] flex items-center justify-center
                            ${page === totalPages
                                    ? 'opacity-40 cursor-not-allowed'
                                    : ''}`}
                        >

                            <ChevronRight sx={{ fontSize: 16 }} />

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default LoadHistory;