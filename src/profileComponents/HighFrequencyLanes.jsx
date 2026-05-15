import React from 'react';
import { Route } from '@mui/icons-material';
import { LinearProgress } from '@mui/material';

function HighFrequencyLanes(props) {

    return (

        <div className="rounded-[16px] border border-[#d9e1ee] bg-white p-[30px] shadow-[0_2px_8px_rgba(16,24,40,0.05)]">

            <div className="mb-[32px] flex items-center gap-[10px]">

                <Route className="text-[#185abc]" />

                <h3 className="text-[18px] font-[500] text-[#1f2937]">High Frequency Lanes</h3>
            </div>
            <div className="space-y-[28px]">

                {props.lanes.map((lane) => (
                    <div key={lane.id} className="flex items-start gap-[16px]">
                        
                        <span className="text-[12px] font-[700] text-[#cbd5e1]">{lane.id}</span>
                        <div className="flex-1">
                            <div className="mb-[8px] flex justify-between">
                                <span className="text-[14px] font-[600] text-[#334155]">{lane.route}</span>
                                <span className="text-[12px] font-[700] text-[#94a3b8]">{lane.percentage}%</span>
                            </div>
                            <LinearProgress 
                                variant="determinate" 
                                value={lane.percentage} 
                                sx={{ 
                                    height: 6, 
                                    borderRadius: 3, 
                                    backgroundColor: '#f1f5f9', 
                                    '& .MuiLinearProgress-bar': { backgroundColor: '#1d4ed8', borderRadius: 3 } 
                                }} 
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HighFrequencyLanes;