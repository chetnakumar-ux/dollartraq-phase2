import React, { useState } from 'react';

import {
    InsertDriveFileOutlined
} from '@mui/icons-material';

import SafetyConsoleTabs from './SafetyConsoleTabs';

import Overview from './tabs/Overview';
import Basics from './tabs/Basics';
import Inspections from './tabs/Inspections';
import Crashes from './tabs/Crashes';

function SafetyIntelligenceConsole({ data }) {

    const [activeTab, setActiveTab] = useState('OVERVIEW');

    const safetyData = data || {};

const basicsData = {
    sms_measures:
        safetyData?.sms_measures || {},

    violation_details:
        safetyData?.violation_details || [],

    inspections:
        safetyData?.inspections || [],

    criticalWarning:
        safetyData?.sms_measures
            ?.veh_maint_measure
            ? `Vehicle maintenance score at ${Math.round(
                  Number(
                      safetyData?.sms_measures
                          ?.veh_maint_measure
                  )
              )}`
            : 'No warnings available'
};
    const renderTabContent = function () {

        switch (activeTab) {

            case 'OVERVIEW':

                return (

                    <Overview
                        data={safetyData?.overview}
                    />

                );

            case 'BASICS':

                return (

                    <Basics
                        data={basicsData}
                    />

                );

            case 'INSPECTIONS':

                return (

                    <Inspections
                        data={
                            safetyData?.inspectionAnalysis
                        }
                    />

                );

            case 'CRASHES':

                return (

                    <Crashes
                        data={
                            safetyData?.crashesAnalysis
                        }
                    />

                );

            default:

                return (

                    <Overview
                        data={safetyData?.overview}
                    />

                );

        }

    };

    return (

        <div className='overflow-hidden rounded-[16px] border border-[#d9e1ee] bg-white shadow-sm'>

            <div className='flex items-center justify-between px-[32px] py-[24px]'>

                <div className='flex items-center gap-3'>

                    <div className='h-[8px] w-[8px] rounded-full bg-[#10b981]' />

                    <h2 className='text-[14px] font-[800] uppercase tracking-tight text-[#001b3d]'>

                        Safety Intelligence Console

                    </h2>

                </div>

                <InsertDriveFileOutlined className='cursor-pointer !text-[20px] text-[#94a3b8]' />

            </div>

            <SafetyConsoleTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <div className='bg-white'>

                {renderTabContent()}

            </div>

        </div>

    );
}

export default SafetyIntelligenceConsole;