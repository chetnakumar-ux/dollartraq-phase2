// FleetDetails.jsx

import React, { useMemo, useState } from 'react';

import {
    Search,
    ChevronLeft,
    ChevronRight,
    LocalShipping,
    Timeline,
    Assessment,
    InfoOutlined,
    CheckCircle
} from '@mui/icons-material';

function FleetDetails({ data }) {

    const fleet = data || {};

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('last_seen');

    const [activePower, setActivePower] = useState('');
    const [activeTrailer, setActiveTrailer] = useState('');

    const [page, setPage] = useState(1);

    const rowsPerPage = 4;

    const cardThemes = {
        blue: {
            bg: 'bg-[#f4f7ff]',
            title: 'text-[#6d8cff]',
            value: 'text-[#111827]',
            iconBg: 'bg-[#dbe7ff]'
        },

        orange: {
            bg: 'bg-[#fff8f1]',
            title: 'text-[#f59e0b]',
            value: 'text-[#111827]',
            iconBg: 'bg-[#ffe7ba]'
        },

        purple: {
            bg: 'bg-[#faf5ff]',
            title: 'text-[#a855f7]',
            value: 'text-[#111827]',
            iconBg: 'bg-[#ead7ff]'
        },

        dark: {
            bg: 'bg-[#f8fafc]',
            title: 'text-[#475569]',
            value: 'text-[#111827]',
            iconBg: 'bg-[#e2e8f0]'
        },

        green: {
            bg: 'bg-[#f0fdf4]',
            title: 'text-[#10b981]',
            value: 'text-[#111827]',
            iconBg: 'bg-[#d1fae5]'
        }
    };

    const filteredTableData = useMemo(() => {

        let rows = [...(fleet?.tableData || [])];

        // SEARCH

        if (search) {

            const keyword = search.toLowerCase();

            rows = rows.filter((item) =>
                item.vin?.toLowerCase().includes(keyword) ||
                item.plate?.toLowerCase().includes(keyword) ||
                item.make?.toLowerCase().includes(keyword) ||
                item.model?.toLowerCase().includes(keyword)
            );
        }

        // FILTERS

        // FILTERS

        rows = rows.filter((item) => {

            const powerMatched =
                !activePower ||
                item.category === activePower;

            const trailerMatched =
                !activeTrailer ||
                item.category === activeTrailer;

            return powerMatched && trailerMatched;
        });

        // SORT

        rows.sort((a, b) => {

            if (sortBy === 'newest') {
                return Number(b.year) - Number(a.year);
            }

            if (sortBy === 'oldest') {
                return Number(a.year) - Number(b.year);
            }

            return new Date(b.lastSeen) - new Date(a.lastSeen);
        });

        return rows;

    }, [
        fleet,
        search,
        sortBy,
        activePower,
        activeTrailer
    ]);

    const totalPages = Math.ceil(
        filteredTableData.length / rowsPerPage
    );

    const paginatedData = filteredTableData.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    return (
        <div className="rounded-[18px] border border-[#d9e1ee] bg-white overflow-hidden shadow-sm">

            {/* HEADER */}

            <div className="px-[28px] pt-[26px]">

                <div className="flex items-center gap-2 mt-2">

                    <div className="h-[7px] w-[7px] rounded-full bg-emerald-500" />

                    <h2 className="text-[14px] font-[800] tracking-[1px] text-[#0f172a] uppercase">
                        Fleet Details
                    </h2>

                </div>

                <p className="mt-1 text-[10px] text-[#45484c] leading-[18px] max-w-[900px]">
                    Fleet tractors and trailers identified through observations on the road.
                    Note: If the carrier has no recent observations, equipment may not be shown
                    even if power units are reported.
                </p>

                {/* TOP CARDS */}

                <div className="grid grid-cols-5 gap-[14px] mt-[24px]">

                    {fleet?.topCards?.map((card) => {

                        const theme = cardThemes[card.type] || cardThemes.blue;

                        return (

                            <div
                                key={card.id}
                                className={`rounded-[14px] border border-[#edf2f7] px-[18px] py-[18px] ${theme.bg}`}
                            >

                                <div className="flex items-start justify-between">

                                    <p className={`text-[9px] font-[800] tracking-[1px] uppercase ${theme.title}`}>
                                        {card.title}
                                    </p>

                                    <div className={`h-[30px] w-[30px] rounded-full flex items-center justify-center ${theme.iconBg}`}>

                                        {card.type === 'blue' && (
                                            <div className="text-[#6d8cff]">
                                                <LocalShipping sx={{ fontSize: 16 }} />
                                            </div>
                                        )}

                                        {card.type === 'orange' && (
                                            <div className="text-[#f59e0b]">
                                                <Timeline sx={{ fontSize: 16 }} />
                                            </div>
                                        )}

                                        {card.type === 'purple' && (
                                            <div className="text-[#a855f7]">
                                                <Assessment sx={{ fontSize: 16 }} />
                                            </div>
                                        )}

                                        {card.type === 'dark' && (
                                            <div className="text-[#475569]">
                                                <InfoOutlined sx={{ fontSize: 16 }} />
                                            </div>
                                        )}

                                        {card.type === 'green' && (
                                            <div className="text-[#10b981]">
                                                <CheckCircle sx={{ fontSize: 16 }} />
                                            </div>
                                        )}

                                    </div>

                                </div>

                                <div className="flex items-end gap-1 mt-[14px]">

                                    <h3 className={`text-[30px] leading-none font-[800] ${theme.value}`}>
                                        {card.value}
                                    </h3>

                                    {card.unit && (
                                        <span className="mb-[4px] text-[11px] text-[#64748b]">
                                            {card.unit}
                                        </span>
                                    )}

                                </div>

                                {card.subtitle && (
                                    <p className="mt-[10px] text-[11px] text-[#64748b]">
                                        {card.subtitle}
                                    </p>
                                )}

                            </div>
                        );
                    })}

                </div>

            </div>

            {/* FILTER BAR */}

            <div className="mx-[28px] mt-[22px] rounded-[16px] border border-[#d9e1ee] p-[18px]">

                <div className="flex items-start justify-between gap-[20px]">

                    {/* SEARCH */}

                    <div className="flex-1">

                        <p className="text-[9px] font-[800] tracking-[1px] text-[#94a3b8] uppercase mb-[8px]">
                            Search
                        </p>

                        <div className="relative">

                            <Search
                                className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#94a3b8]"
                                sx={{ fontSize: 18 }}
                            />

                            <input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search VIN, Plate, Make, Model..."
                                className="h-[42px] w-full rounded-[10px] border border-[#d9e1ee] bg-[#fbfcfe] pl-[42px] pr-[14px] text-[12px] outline-none"
                            />

                        </div>

                    </div>

                    {/* SORT */}

                    <div className="w-[220px]">

                        <p className="text-[9px] font-[800] tracking-[1px] text-[#94a3b8] uppercase mb-[8px]">
                            Sort By
                        </p>

                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setPage(1);
                            }}
                            className="h-[42px] w-full rounded-[10px] border border-[#d9e1ee] bg-white px-[14px] text-[12px] outline-none"
                        >

                            {fleet?.sortOptions?.map((item) => (

                                <option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </option>

                            ))}

                        </select>

                    </div>

                </div>

                {/* FILTER BUTTONS */}

                <div className="mt-[22px] flex gap-[40px]">

                    {/* POWER */}

                    <div>

                        <p className="text-[9px] font-[800] tracking-[1px] text-[#94a3b8] uppercase mb-[10px]">
                            Power Units
                        </p>

                        <div className="flex flex-wrap gap-[8px]">

                            {fleet?.powerTabs?.map((item) => (

                                <button
                                    key={item.value}
                                    onClick={() => {

                                        setActivePower((prev) =>
                                            prev === item.value ? '' : item.value
                                        );

                                        setPage(1);
                                    }}
                                    className={`h-[30px] px-[14px] rounded-full text-[10px] font-[700]
                                    ${activePower === item.value
                                            ? 'bg-[#edf4ff] text-[#2563eb]'
                                            : 'bg-[#f8fafc] text-[#475569]'
                                        }`}
                                >
                                    {item.label} ({item.count})
                                </button>

                            ))}

                        </div>

                    </div>

                    {/* TRAILERS */}

                    <div>

                        <p className="text-[9px] font-[800] tracking-[1px] text-[#94a3b8] uppercase mb-[10px]">
                            Trailers
                        </p>

                        <div className="flex flex-wrap gap-[8px]">

                            {fleet?.trailerTabs?.map((item) => (

                                <button
                                    key={item.value}
                                    onClick={() => {

                                        setActiveTrailer((prev) =>
                                            prev === item.value ? '' : item.value
                                        );

                                        setPage(1);
                                    }}
                                    className={`h-[30px] px-[14px] rounded-full text-[10px] font-[700]
                                    ${activeTrailer === item.value
                                            ? 'bg-[#edf4ff] text-[#2563eb]'
                                            : 'bg-[#f8fafc] text-[#475569]'
                                        }`}
                                >
                                    {item.label} ({item.count})
                                </button>

                            ))}

                        </div>

                    </div>

                </div>

            </div>

            {/* TABLE */}
  <div className="mx-[28px] mt-[22px] rounded-[16px] border border-[#d9e1ee] p-[18px]">
            <div className="mt-[18px] overflow-x-auto">

                <table className="w-full min-w-[1200px]">

                    <thead className="bg-[#f8fafc] border-y border-[#e5edf6]">

                        <tr>

                            {[
                                'Type',
                                'VIN',
                                'Plate',
                                'Class',
                                'Desc',
                                'Year',
                                'Make',
                                'Model',
                                'Last Seen'
                            ].map((head) => (

                                <th
                                    key={head}
                                    className="px-[18px] py-[14px] text-left text-[9px] font-[800] tracking-[1px] text-[#94a3b8] uppercase whitespace-nowrap"
                                >
                                    {head}
                                </th>

                            ))}

                        </tr>

                    </thead>

                    <tbody>

                        {paginatedData?.map((row, index) => (

                            <tr
                                key={index}
                                className="border-b border-[#eef2f7] hover:bg-[#fafcff]"
                            >

                                <td className="px-[18px] py-[14px] text-[11px] text-[#475569] whitespace-nowrap">
                                    {row.type}
                                </td>

                                <td className="px-[18px] py-[14px] text-[11px] font-[700] text-[#2563eb] whitespace-nowrap">
                                    {row.vin}
                                </td>

                                <td className="px-[18px] py-[14px] text-[11px] text-[#64748b] whitespace-nowrap">
                                    {row.plate}
                                </td>

                                <td className="px-[18px] py-[14px] text-[11px] text-[#111827] whitespace-nowrap">
                                    {row.class}
                                </td>

                                <td className="px-[18px] py-[14px] text-[11px] text-[#475569] whitespace-nowrap">
                                    {row.desc}
                                </td>

                                <td className="px-[18px] py-[14px] text-[11px] text-[#64748b] whitespace-nowrap">
                                    {row.year}
                                </td>

                                <td className="px-[18px] py-[14px] text-[11px] text-[#475569] whitespace-nowrap">
                                    {row.make}
                                </td>

                                <td className="px-[18px] py-[14px] text-[11px] text-[#475569] whitespace-nowrap">
                                    {row.model}
                                </td>

                                <td className="px-[18px] py-[14px] text-[11px] text-[#94a3b8] whitespace-nowrap">
                                    {row.lastSeen}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>


            <div className="flex items-center justify-end gap-[18px] px-[28px] py-[18px]">

                <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className={`${page === 1
                        ? 'opacity-40 cursor-not-allowed'
                        : ''
                        }`}
                >
                    <ChevronLeft sx={{ fontSize: 18 }} />
                </button>

                <span className="text-[11px] font-[700] text-[#64748b]">
                    {page}
                </span>

                <span className="text-[11px] text-[#94a3b8]">
                    /
                </span>

                <span className="text-[11px] text-[#94a3b8]">
                    {totalPages || 1}
                </span>

                <button
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage((prev) => prev + 1)}
                    className={`${page === totalPages || totalPages === 0
                        ? 'opacity-40 cursor-not-allowed'
                        : ''
                        }`}
                >
                    <ChevronRight sx={{ fontSize: 18 }} />
                </button>

            </div>
</div>
        </div>
    );
}

export default FleetDetails;