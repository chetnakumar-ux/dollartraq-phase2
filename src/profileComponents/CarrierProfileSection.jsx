import React from 'react';

function CarrierProfileSection(props) {

    if (props.variant === 'hero') {

        return (
            <div className='overflow-hidden rounded-[16px] border border-[#d9e1ee] bg-white shadow-[0_2px_8px_rgba(16,24,40,0.06)]'>
                <div className='flex items-start justify-between gap-[20px] bg-gradient-to-r from-[#0f57c8] via-[#1a55cf] to-[#1e49ca] px-[36px] py-[28px]'>

                    <div className='min-w-0'>

                        <div className='mb-[10px] text-[11px] font-[700] uppercase tracking-[0.14em] text-white/55'>
                            {props.subtitle}
                        </div>

                        <div className='text-[42px] leading-[1.05] font-[800] tracking-[-0.03em] text-white'>
                            {props.title}
                        </div>
                    </div>

                    <div className='flex items-center gap-[16px] shrink-0'>
                        
                        {props.actions &&
                            props.actions.map(function (action, index) {
                                const isPrimary = action.variant === 'primary';

                                return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => action.onClick()}
                                className={
                                    isPrimary
                                        ? 'relative z-10 cursor-pointer h-[52px] min-w-[194px] rounded-[12px] bg-gradient-to-r from-[#37c96b] to-[#1fb854] px-[22px] text-[16px] font-[700] text-white'
                                        : 'relative z-10 cursor-pointer h-[52px] min-w-[210px] rounded-[12px] border border-[#d5ddeb] bg-white px-[22px] text-[16px] font-[600] text-[#334155]'
                                }
                                        >
                                    <span className="flex items-center justify-center gap-[10px]">
                                        {action.icon}
                                        {action.label}
                                    </span>
                                </button>
                             );
                            })}
                    </div>
                </div>

                <div className='flex items-center justify-between gap-[24px] bg-white px-[28px] py-[32px]'>
                    <div className='flex items-center gap-[30px] flex-wrap'>
                        {props.leftItems.map(function (item, index) {
                            const isStatus = item.label === 'STATUS';

                            return (
                                <div
                                    key={index}
                                    className={
                                        index !== props.leftItems.length - 1
                                            ? 'pr-[30px] border-r border-[#e5eaf2]'
                                            : ''
                                    }
                                >
                                    {isStatus ? (
                                        <div>
                                            <div className='mb-[8px] text-[11px] font-[700] uppercase tracking-[0.12em] text-transparent'>
                                                .
                                            </div>

                                            <div className='flex h-[40px] items-center gap-[8px] rounded-full border border-[#caecd7] bg-[#ecfbf2] px-[24px] text-[15px] font-[700] uppercase text-[#2f9e55]'>
                                                <span className='h-[9px] w-[9px] rounded-full bg-[#2ecc71]' />
                                                {item.value}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className='mb-[6px] text-[11px] font-[700] uppercase tracking-[0.12em] text-[#8b97a8]'>
                                                {item.label}
                                            </div>

                                            <div className='text-[16px] leading-[1.25] font-[500] text-[#111827]'>
                                                {item.value}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className='flex items-center justify-end gap-[18px] flex-wrap'>
                        {props.rightItems.map(function (item, index) {
                            return (
                                <div
                                    key={index}
                                    className='flex min-w-[134px] items-center gap-[10px] rounded-[6px] border border-[#e4e9f1] bg-[#fbfcfe] px-[14px] py-[11px]'
                                >
                                    <div className='text-[12px] font-[700] uppercase tracking-[0.02em] text-[#a3adba]'>
                                        {item.label}
                                    </div>

                                    <div className='text-[15px] font-[700] text-[#4b5563]'>
                                        {item.value}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='rounded-[16px] border border-[#d9e1ee] bg-white px-[30px] py-[34px] shadow-[0_2px_8px_rgba(16,24,40,0.05)]'>
            <div className='mb-[42px] flex items-center gap-[10px]'>
                {props.titleIcon}

                <h3 className='text-[18px] font-[500] text-[#1f2937]'>
                    {props.title}
                </h3>
            </div>

            <div className='grid grid-cols-4 gap-x-[56px] gap-y-[28px]'>
                {props.items.map(function (item, index) {
                    return (
                        <div key={index} className="flex items-start gap-[16px]">
                        <div className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-[14px] border border-[#edf2f7] bg-[#fbfcff] text-[#185abc]">
                            {React.cloneElement(item.icon, {
                            size: 22,
                            style: { display: "block" },
                            })}
                        </div>

                            <div className='pt-[3px]'>
                                <div className='mb-[6px] text-[12px] font-[700] uppercase tracking-[0.16em] text-[#6b7280]'>
                                    {item.label}
                                </div>

                                <div className='text-[15px] leading-[1.45] font-[500] text-[#111827]'>
                                    {item.value}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CarrierProfileSection;