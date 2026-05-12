import React from 'react';

import {Verified, GppMaybe, LocationOn, Phone, Email, FiberManualRecord} from '@mui/icons-material';

function StatusBadge(props) {

    const isActive = props.active;
    const label = props.label;
    const type = props.type;

    let icon = null;

    let className = 'inline-flex items-center justify-center min-w-[165px] gap-[5px] px-[10px] py-[4px] rounded-full text-[11px] font-[700] tracking-[0.02em] whitespace-nowrap border leading-none uppercase ';

    if (isActive === true) {

        if (type === 'insurance') {

            icon = <Verified className='!text-[13px] !text-[#15924c]' />;

            className = className + 'bg-[#edfdf3] border-[#b7ebc6] text-[#15924c]';
        }
        else {

            icon = <Verified className='!text-[13px] !text-[#2563eb]' />;

            className = className + 'bg-[#eef4ff] border-[#c7dbff] text-[#2563eb]';
        }
    }
    else {

        icon = <GppMaybe className='!text-[13px] !text-[#dc2626]' />;

        className = className + 'bg-[#fff1f1] border-[#fecaca] text-[#dc2626]';
    }

    return (

        <span className={className}>{icon}{label} </span>

    );
}


function RiskBadge(props) {

    const risk = (props.risk || '').toLowerCase();

    const map = {
        low: {
            dot: '#22c55e',
            bg: 'bg-[#edfdf3]',
            border: 'border-[#b7ebc6]',
            color: 'text-[#15924c]'
        },
        medium: {
            dot: '#f59e0b',
            bg: 'bg-[#fff8e8]',
            border: 'border-[#fde7a7]',
            color: 'text-[#c27a07]'
        },
        high: {
            dot: '#ef4444',
            bg: 'bg-[#fff1f1]',
            border: 'border-[#fecaca]',
            color: 'text-[#dc2626]'
        }
    };

    let status = map.medium;

    if (risk.includes('low')) {

        status = map.low;
    }
    else if (risk.includes('high')) {

        status = map.high;
    }
    else if (risk.includes('medium')) {

        status = map.medium;
    }

    const className =
        'inline-flex items-center justify-center min-w-[165px] gap-[6px] px-[11px] py-[4px] rounded-full text-[11px] font-[700] tracking-[0.02em] whitespace-nowrap border uppercase leading-none ' +
        status.bg + ' ' +
        status.border + ' ' +
        status.color;

    return (

        <span className={className}>

            <span className='w-[7px] h-[7px] rounded-full shrink-0'style={{ background: status.dot }}/>

            {props.risk}
			
        </span>
    );
}


function CarrierTypeTag(props) {

    const carrierType = (props.type || '').toLowerCase();

    let className = 'inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-full text-[10px] font-[700] tracking-[0.02em] border uppercase leading-none ';

    if (carrierType === 'interstate') {

        className = className + 'bg-[#eef4ff] text-[#2563eb] border-[#c7dbff]';
    }
    else if (carrierType === 'intrastate') {

        className = className + 'bg-[#fff8e8] text-[#c27a07] border-[#fde7a7]';
    }
    else {

        className = className + 'bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]';
    }

    return (
        <span className={className}>

            <FiberManualRecord className='!text-[8px]' />

            {props.type}

        </span>
    );
}


function AuthorityTag(props) {

    const authority = (props.authority || '').toLowerCase();

    let className = 'inline-flex items-center gap-[6px] px-[11px] py-[4px] rounded-full text-[10px] font-[700] tracking-[0.02em] leading-none border uppercase ';

    if (authority === 'active') {

        className = className + 'bg-[#eef4ff] text-[#2563eb] border-[#c7dbff]';
    }
    else {

        className = className + 'bg-[#fff1f1] text-[#dc2626] border-[#fecaca]';
    }

    return (
        <span className={className}>

            <FiberManualRecord className='!text-[8px]' />

            {props.authority}

        </span>
    );
}


function CarrierCard(props) {

    const carrier = props.carrier;
    const handleClick = props.onClick;

    const idFields = [
        { label: 'MC NUMBER', value: carrier.mc_number },
        { label: 'DOT NUMBER', value: carrier.dot_number },
        { label: 'EIN', value: carrier.ein },
        { label: 'DUNS', value: carrier.duns }
    ];

    const contactItems = [
        {
            icon: <LocationOn className='!text-[15px]' />,
            text: carrier.address
        },
        {
            icon: <Phone className='!text-[15px]' />,
            text: carrier.phone
        },
        {
            icon: <Email className='!text-[15px]' />,
            text: carrier.email
        }
    ];

    let cardClass = 'bg-white rounded-[14px] px-[22px] py-[18px] mb-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-200 ';

    if (typeof handleClick === 'function') {

        cardClass = cardClass + 'cursor-pointer hover:border-[#93c5fd] hover:shadow-[0_4px_16px_rgba(56,119,218,0.12)]';
    }
    else {

        cardClass = cardClass + 'cursor-default';
    }


    function handleCardClick() {

        if (typeof handleClick === 'function') {

            handleClick(carrier);
        }
    }


    return (
        <div
            onClick={handleCardClick}
            className={cardClass}
        >

            <div className='flex justify-between items-start gap-[28px]'>

                <div className='flex-1 min-w-0'>

                    <div className='flex justify-between items-start gap-[28px] mb-[18px]'>

                        <div>

                            <h3 className='flex items-center mb-[14px] text-[15px] font-[700] text-[#111827] tracking-[-0.01em]'>

                                {carrier.company_name}

                            </h3>

                            <div className='flex flex-wrap gap-[8px]'>

                                <CarrierTypeTag type={carrier.carrier_type} />

                                <AuthorityTag authority={carrier.authority_status} />

                            </div>

                        </div>


                        <div className='flex items-start gap-[26px] shrink-0'>

                            <div className='text-left'>

                                <div className='text-[9px] font-[700] text-[#9ca3af] uppercase tracking-[0.08em] mb-[4px]'>

                                    Mileage

                                </div>

                                <div className='text-[15px] font-[700] text-[#111827]'>

                                    {Number(carrier.mileage).toLocaleString()}

                                    <span className='text-[11px] font-[400] text-[#6b7280] ml-[3px]'>

                                        mi

                                    </span>

                                </div>

                            </div>


                            <div className='w-px h-[42px] bg-[#e5e7eb] mt-[2px]' />


                            <div className='text-left'>

                                <div className='text-[9px] font-[700] text-[#9ca3af] uppercase tracking-[0.08em] mb-[4px]'>

                                    Fleet Size

                                </div>

                                <div className='text-[15px] font-[700] text-[#111827]'>

                                    {Number(carrier.fleet_size).toLocaleString()}

                                    <span className='text-[11px] font-[400] text-[#6b7280] ml-[3px]'>

                                        units

                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    <div className='grid grid-cols-4 gap-y-[12px] gap-x-[24px] mb-[18px] px-[14px] py-[16px] rounded-[12px] border border-[#edf0f3] bg-[#fafafa] w-full'>

                        {idFields.map(function (field) {

                            return (
                                <div key={field.label}>

                                    <div className='text-[9px] font-[700] text-[#9ca3af] uppercase tracking-[0.08em] mb-[4px]'>

                                        {field.label}

                                    </div>

                                    <div className='text-[13px] font-[600] text-[#374151]'>

                                        {field.value}

                                    </div>

                                </div>
                            );
                        })}

                    </div>


                    <div className='flex flex-wrap gap-[24px] mt-[4px]'>

                        {contactItems.map(function (item, index) {

                            return (
                                <span
                                    key={index}
                                    className='flex items-center gap-[5px] text-[12px] text-[#6b7280]'
                                >

                                    <span className='text-[#b0b7c3] flex items-center'>

                                        {item.icon}

                                    </span>

                                    {item.text}

                                </span>
                            );
                        })}

                    </div>

                </div>


                <div className='flex flex-col gap-[20px] items-end mt-4 shrink-0'>

                    <StatusBadge
                        active={carrier.authority_verified}
                        label='AUTHORITY VERIFIED'
                        type='authority'
                    />

                    <StatusBadge
                        active={carrier.insurance_current}
                        label='INSURANCE CURRENT'
                        type='insurance'
                    />

                    <RiskBadge
                        risk={carrier.risk_level}
                    />

                </div>

            </div>

        </div>
    );
}


export default CarrierCard;