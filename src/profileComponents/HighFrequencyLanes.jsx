import React from 'react';

import {
    Route
} from '@mui/icons-material';

import {
    LinearProgress
} from '@mui/material';

function HighFrequencyLanes(props) {

    const lanes = Array.isArray(props.lanes)
        ? props.lanes
        : [];

if (lanes.length === 0) {

    return (

        <div className='rounded-[16px] border border-[#d9e1ee] bg-white p-[18px] shadow-[0_2px_8px_rgba(16,24,40,0.05)] sm:p-[24px] xl:p-[30px]'>

            <div className='mb-[24px] flex items-center gap-[10px] xl:mb-[30px]'>

                <Route className='!text-[22px] text-[#185abc]' />

                <h3 className='text-[16px] font-[500] text-[#1f2937] sm:text-[17px] xl:text-[18px]'>

                    High Frequency Lanes

                </h3>

            </div>

            <div className='flex items-center justify-center py-[40px]'>

                <p className='text-[13px] font-[500] text-[#94a3b8]'>

                    No lane data available

                </p>

            </div>

        </div>

    );
}

    return (

        <div className='rounded-[16px] border border-[#d9e1ee] bg-white p-[18px] shadow-[0_2px_8px_rgba(16,24,40,0.05)] sm:p-[24px] xl:p-[30px]'>

            <div className='mb-[24px] flex items-center gap-[10px] xl:mb-[30px]'>

                <Route className='!text-[22px] text-[#185abc]' />

                <h3 className='text-[16px] font-[500] text-[#1f2937] sm:text-[17px] xl:text-[18px]'>
                    High Frequency Lanes
                </h3>

            </div>

            <div className='space-y-[20px] xl:space-y-[24px]'>

                {lanes.map(function (lane, index) {

                    const lanePercentage =
                        lane?.percentage ?? 0;

                    return (

                        <div
                            key={lane?.id || index}
                            className='flex items-start gap-[12px] xl:gap-[16px]'
                        >

                            <span className='pt-[2px] text-[11px] font-[700] text-[#cbd5e1] xl:text-[12px]'>
                                {lane?.id ?? '--'}
                            </span>

                            <div className='min-w-0 flex-1'>

                                <div className='mb-[9px] flex items-center justify-between gap-[12px]'>

                                    <span className='truncate text-[13px] font-[600] text-[#334155] xl:text-[14px]'>
                                        {lane?.route ?? 'N/A'}
                                    </span>

                                    <span className='shrink-0 text-[11px] font-[700] text-[#94a3b8] xl:text-[12px]'>
                                        {lanePercentage}%
                                    </span>

                                </div>

                                <LinearProgress
                                    variant='determinate'
                                    value={lanePercentage}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: '#f1f5f9',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: '#1d4ed8',
                                            borderRadius: 3
                                        }
                                    }}
                                />

                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}

export default HighFrequencyLanes;