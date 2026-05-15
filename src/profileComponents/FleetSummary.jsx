import React from 'react';
import { 
    Inventory2Outlined, 
    LocalShippingOutlined, 
    EngineeringOutlined, 
    PersonOutlined 
} from '@mui/icons-material';

function FleetSummary(props) {
    if (!props.data || !props.data.equipment) return null;

    const stats = [
        { 
            label: 'TOTAL POWER UNITS', 
            value: props.data.power_units, 
            icon: <LocalShippingOutlined />, 
            color: 'bg-[#eef2ff] text-[#4f46e5]' 
        },
        { 
            label: 'DRIVERS', 
            value: props.data.drivers, 
            icon: <PersonOutlined />, 
            color: 'bg-[#f5f3ff] text-[#7c3aed]' 
        },
        { 
            label: 'TRAILERS', 
            value: props.data.trailers, 
            icon: <EngineeringOutlined />, 
            color: 'bg-[#f0fdf4] text-[#16a34a]' 
        }
    ];

    return (
        <div className="rounded-[16px] border border-[#d9e1ee] bg-white p-[30px] shadow-[0_2px_8px_rgba(16,24,40,0.05)]">

            <div className="mb-[36px] flex items-center justify-between">

                <div className="flex items-center gap-[10px]">

                    <Inventory2Outlined className="text-[#1656b8] !text-[22px]" />

                    <h3 className="text-[18px] font-[500] text-[#1f2937]">Fleet Summary</h3>
                </div>

                <button 
                    type="button"
                    className="cursor-pointer text-[15px] font-[700] text-[#1656b8] hover:underline"
                >
                    View Full Details
                </button>
            </div>

            <div className="mb-[32px] grid grid-cols-3 gap-[20px]">

                {stats.map(function(stat, idx) {

                    return (
                        <div key={idx} className="flex items-center gap-[16px] rounded-[12px] bg-[#f8fafc] p-[20px]">
                            <div className={`grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[10px] ${stat.color}`}>
                                {React.cloneElement(stat.icon, { className: '!text-[24px]' })}
                            </div>
                            <div>
                                <div className="text-[11px] font-[700] tracking-wider text-[#94a3b8] uppercase">
                                    {stat.label}
                                </div>
                                <div className="text-[26px] font-[700] text-[#111827]">
                                    {stat.value}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="overflow-hidden rounded-[12px] border border-[#f1f5f9]">

                <table className="w-full text-left border-collapse">

                    <thead>
                        <tr className="bg-[#f8fafc]">
                            <th className="px-[24px] py-[16px] text-[13px] font-[700] text-[#64748b]">Equipment Type</th>
                            <th className="px-[24px] py-[16px] text-[13px] font-[700] text-[#64748b]">Quantity</th>
                            <th className="px-[24px] py-[16px] text-[13px] font-[700] text-[#64748b]">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-[15px] font-[500] text-[#111827]">

                        {props.data.equipment.map(function(row, index) {
                            
                            const isSuccess = row.statusVariant === 'success';
                            
                            return (
                                <tr key={index} className="border-t border-[#f1f5f9]">
                                    <td className="px-[24px] py-[18px] text-[#4b5563]">{row.type}</td>
                                    <td className="px-[24px] py-[18px] font-[600] text-[#111827]">{row.quantity}</td>
                                    <td className="px-[24px] py-[18px]">
                                        <span className={`inline-block rounded-[4px] px-[12px] py-[4px] text-[11px] font-[800] uppercase ${
                                            isSuccess 
                                            ? 'bg-[#ecfbf2] text-[#2f9e55]' 
                                            : 'bg-[#f1f5f9] text-[#64748b]'
                                        }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FleetSummary;