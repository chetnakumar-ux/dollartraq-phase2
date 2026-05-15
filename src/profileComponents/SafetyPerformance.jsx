import React from 'react';

import {
    ShieldOutlined,
    LocalShippingOutlined,
    DirectionsCarOutlined,
    NotificationsNoneOutlined
} from '@mui/icons-material';

function SafetyPerformance(props) {

    if (!props.data) return null;

    const metrics = [
        {
            label: 'SAFETY RATING',
            value: props.data.rating,
            badge: props.data.rating_label,
            badgeClass: 'bg-[#ecfbf2] text-[#2f9e55]',
            icon: <ShieldOutlined />,
            iconBg: 'bg-[#eef4ff]',
            iconColor: 'text-[#2563eb]'
        },
        {
            label: 'VEHICLE OOS',
            value: props.data.vehicle_oos,
            unit: props.data.vehicle_oos_unit,
            badge: props.data.vehicle_oos_label,
            badgeClass: 'bg-[#eef2f7] text-[#64748b]',
            icon: <LocalShippingOutlined />,
            iconBg: 'bg-[#f3f6fb]',
            iconColor: 'text-[#64748b]'
        },
        {
            label: 'CRASH RATE',
            value: props.data.crash_rate,
            badge: props.data.crash_rate_label,
            badgeClass: 'bg-[#fff3e8] text-[#ea580c]',
            icon: <DirectionsCarOutlined />,
            iconBg: 'bg-[#fff7f1]',
            iconColor: 'text-[#ea580c]'
        },
        {
            label: 'ACTIVE ALERTS',
            value: props.data.active_alerts,
            badge: props.data.active_alerts_label,
            badgeClass: 'text-[#ef4444]',
            icon: <NotificationsNoneOutlined />,
            iconBg: 'bg-[#fff1f2]',
            iconColor: 'text-[#ef4444]',
            hasDot: true
        }
    ];

    return (

        <div className="relative mt-[3px] overflow-hidden rounded-[16px] border border-[#d9e1ee] bg-white p-[30px] shadow-[0_2px_8px_rgba(16,24,40,0.05)]">

            {/* LEFT BLUE LINE */}
            <div className="absolute left-0 top-0 h-full w-[5px] bg-[#1656b8]" />

            <div className="mb-[32px] flex items-center justify-between">

                <div className="flex items-center gap-[10px]">

                    <ShieldOutlined className="text-[#185abc] !text-[22px]" />

                    <h3 className="text-[18px] font-[500] text-[#1f2937]">
                        Safety & Performance
                    </h3>

                </div>

                <button
                    type="button"
                    className="cursor-pointer text-[15px] font-[700] text-[#1656b8] hover:underline"
                >
                    Full FMCSA Report
                </button>

            </div>

            <div className="grid grid-cols-4 gap-[16px]">

                {metrics.map(function (item, index) {

                    return (

                        <div
                            key={index}
                            className="rounded-[12px] border border-[#e5eaf2] p-[20px]"
                        >

                            <div className="mb-[20px] flex items-center justify-between">

                                <div
                                    className={`grid h-[44px] w-[44px] place-items-center rounded-[10px] ${item.iconBg}`}
                                >
                                    {React.cloneElement(item.icon, {
                                        className: `!text-[22px] ${item.iconColor}`
                                    })}
                                </div>

                                <span
                                    className={`flex items-center gap-[6px] rounded-[4px] px-[8px] py-[3px] text-[10px] font-[600] uppercase tracking-wide ${item.badgeClass}`}
                                >
                                    {item.hasDot && (
                                        <span className="h-[7px] w-[7px] rounded-full bg-[#ef4444]" />
                                    )}

                                    {item.badge}
                                </span>

                            </div>

                            <div className="mb-[6px] text-[11px] font-[700] uppercase tracking-[0.05em] text-[#8b97a8]">
                                {item.label}
                            </div>

                            <div className="flex items-baseline gap-[4px] text-[22px] font-[700] text-[#111827]">

                                {item.value}

                                {item.unit && (
                                    <span className="text-[14px] font-[500] text-[#8b97a8]">
                                        {item.unit}
                                    </span>
                                )}

                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}

export default SafetyPerformance;