import React from 'react';
import { CheckCircle, Cancel, ErrorOutlineOutlined } from '@mui/icons-material';

function RiskFactorCard(props) {
    const isRisk = props.type === 'risk';
    
    const styles = {
        icon: isRisk ? <ErrorOutlineOutlined className="!text-[20px]" /> : <CheckCircle className="!text-[20px]" />,
        iconWrapper: isRisk ? 'bg-[#fff5f5] text-[#ef4444]' : 'bg-[#ecfbf2] text-[#2f9e55]',
        badge: isRisk ? 'bg-[#fff5f5] text-[#ef4444]' : 'bg-[#ecfbf2] text-[#2f9e55]',
        bullet: isRisk ? <Cancel className="text-[#ef4444] !text-[18px]" /> : <CheckCircle className="text-[#2ecc71] !text-[18px]" />
    };

    return (
        <div className="rounded-[16px] border border-[#d9e1ef] bg-white shadow-sm">
            {/* Header Section with Divider */}
            <div className="flex items-center justify-between border-b border-[#f1f5f9] px-[32px] py-[24px]">
                <div className="flex items-center gap-[12px]">
                    <div className={`grid h-[40px] w-[40px] place-items-center rounded-full ${styles.iconWrapper}`}>
                        {styles.icon}
                    </div>
                    <h3 className="text-[18px] font-[800] tracking-tight text-[#334155] uppercase">
                        {props.title}
                    </h3>
                </div>

                <span className={`rounded-full px-[16px] py-[6px] text-[11px] font-[800] uppercase tracking-wider ${styles.badge}`}>
                    {props.badge}
                </span>
            </div>

            <div className="px-[32px] pb-[16px]">
                <div className="grid grid-cols-2 gap-x-[40px]">
                    {(props.items || []).map(function (item, idx) {
                        return (
                            <div 
                                key={idx} 

                                className="flex items-center gap-[12px] border-b border-[#f1f5f9] py-[20px]"
                            >
                                <div className="shrink-0 flex items-center">
                                    {styles.bullet}
                                </div>
                                <span className="text-[14px] font-[500] leading-none text-[#4b5563]">
                                    {item}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default RiskFactorCard;