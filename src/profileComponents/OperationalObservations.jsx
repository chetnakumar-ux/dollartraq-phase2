import React, { useState, useEffect, useCallback } from 'react';

import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

import {
    Timeline
} from '@mui/icons-material';

import CarrierProfileApi from 'api/CarrierProfileApi';

const containerStyle = {
    width: '100%',
    height: '450px'
};

const center = {
    lat: 40.825,
    lng: -73.345
};

function OperationalObservations() {

    const [timeframe, setTimeframe] = useState('6M');

    const [loading, setLoading] = useState(true);

    const [metrics, setMetrics] = useState(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY
    });

    const fetchObservationData = useCallback(function (tf) {

        setLoading(true);

        CarrierProfileApi
            .getObservations(tf)
            .then(function (result) {

                setMetrics(result || {});

                setLoading(false);

            })
            .catch(function () {

                setMetrics({});

                setLoading(false);

            });

    }, []);

    useEffect(function () {

        fetchObservationData(timeframe);

    }, [timeframe, fetchObservationData]);

    const timeframes = [
        '7D',
        '3M',
        '6M',
        '1Y'
    ];

    const inspections = metrics?.inspections || {};

    const crash = metrics?.crash || {};

    const summary = metrics?.summary || {};

    return (

        <div className='overflow-hidden rounded-[16px] border border-[#d9e1ee] bg-white shadow-sm'>

            <div className='flex flex-col gap-[16px] px-[18px] py-[18px] sm:flex-row sm:items-center sm:justify-between sm:px-[24px] sm:py-[22px] xl:px-[32px] xl:py-[24px]'>

                <div className='flex items-center gap-[10px] text-[#1656b8]'>

                    <Timeline className='!text-[20px]' />

                    <span className='text-[12px] font-[800] uppercase tracking-tight sm:text-[13px]'>
                        Operational Observations
                    </span>

                </div>

                <div className='flex w-full rounded-[8px] border border-[#d9e1ee] p-[3px] sm:w-fit'>

                    {timeframes.map(function (tf) {

                        return (

                            <button
                                key={tf}
                                onClick={() => setTimeframe(tf)}
                                className={`flex-1 rounded-[6px] px-[12px] py-[7px] text-[10px] font-[700] transition-all sm:flex-none sm:px-[16px] ${
                                    timeframe === tf
                                        ? 'bg-[#3b82f6] text-white shadow-sm'
                                        : 'text-[#64748b] hover:bg-gray-50'
                                }`}
                            >
                                {tf}
                            </button>

                        );

                    })}

                </div>

            </div>

            <div className='relative border-t border-[#d9e1ee]'>

                <div className='overflow-hidden'>

                    {isLoaded ? (

                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={11}
                            options={{
                                disableDefaultUI: true
                            }}
                        />

                    ) : (

                        <div
                            style={containerStyle}
                            className='animate-pulse bg-gray-50'
                        />

                    )}

                </div>

                <div className='absolute left-[12px] right-[12px] top-[100%] z-10 -translate-y-1/2 sm:left-[18px] sm:right-[18px] xl:left-[24px] xl:right-[24px]'>

                    <div
                        className={`rounded-[14px] border border-[#e5e7eb] bg-[#f8fafc] px-[14px] py-[16px] transition-opacity sm:px-[18px] sm:py-[18px] xl:px-[22px] ${
                            loading
                                ? 'opacity-50'
                                : 'opacity-100'
                        }`}
                    >

                        <div className='grid grid-cols-1 gap-[18px] lg:grid-cols-12 lg:items-center'>

                            <div className='lg:col-span-3'>

                                <p className='mb-[12px] text-[10px] font-[800] uppercase tracking-[1.5px] text-[#94a3b8] sm:text-[11px]'>
                                    Inspections Matrix
                                </p>

                                <div className='flex flex-wrap gap-[14px]'>

                                    <span className='flex items-center gap-[6px] text-[11px] font-[700] text-[#475569]'>

                                        <div className='h-[7px] w-[7px] rounded-full bg-[#10b981]' />

                                        {inspections.cln ?? 'NA'} CLN

                                    </span>

                                    <span className='flex items-center gap-[6px] text-[11px] font-[700] text-[#475569]'>

                                        <div className='h-[7px] w-[7px] rounded-full bg-[#f59e0b]' />

                                        {inspections.vio ?? 'NA'} VIO

                                    </span>

                                    <span className='flex items-center gap-[6px] text-[11px] font-[700] text-[#475569]'>

                                        <div className='h-[7px] w-[7px] rounded-full bg-[#ef4444]' />

                                        {inspections.oos ?? 'NA'} OOS

                                    </span>

                                </div>

                            </div>

                            <div className='lg:col-span-3 lg:pl-[10px]'>

                                <p className='mb-[12px] text-[10px] font-[800] uppercase tracking-[1.5px] text-[#94a3b8] sm:text-[11px]'>
                                    Crash Telemetry
                                </p>

                                <div className='flex flex-wrap gap-[14px]'>

                                    <span className='flex items-center gap-[6px] text-[11px] font-[700] text-[#475569]'>

                                        <div className='h-[7px] w-[7px] rounded-full bg-[#f59e0b]' />

                                        {crash.tow ?? 'NA'} TOW

                                    </span>

                                    <span className='flex items-center gap-[6px] text-[11px] font-[700] text-[#475569]'>

                                        <div className='h-[7px] w-[7px] rounded-full bg-[#ef4444]' />

                                        {crash.inj ?? 'NA'} INJ

                                    </span>

                                </div>

                            </div>


                            <div className='lg:col-span-6'>

                                <div className='grid grid-cols-3 items-center rounded-[12px] border border-[#e5e7eb] bg-[#f8fafc] px-[8px] py-[10px] sm:px-[10px]'>

                                    <div className='text-center'>

                                        <p className='text-[20px] font-[800] leading-none text-[#0f172a] sm:text-[24px]'>
                                            {summary.total ?? 'NA'}
                                        </p>

                                        <p className='mt-[4px] text-[9px] font-[800] uppercase leading-[1.2] tracking-[0.5px] text-[#94a3b8] sm:text-[10px]'>
                                            Total
                                            <br />
                                            Insp
                                        </p>

                                    </div>

                                    <div className='flex items-center justify-center'>

                                        <div className='h-[42px] w-[1px] bg-[#dbe2ea]' />

                                        <div className='mx-auto text-center'>

                                            <p className='text-[20px] font-[800] leading-none text-[#0f172a] sm:text-[24px]'>
                                                {summary.cleanRate ?? 'NA'}
                                            </p>

                                            <p className='mt-[4px] text-[9px] font-[800] uppercase leading-[1.2] tracking-[0.5px] text-[#94a3b8] sm:text-[10px]'>
                                                Clean
                                                <br />
                                                Rate
                                            </p>

                                        </div>

                                        <div className='h-[42px] w-[1px] bg-[#dbe2ea]' />

                                    </div>

                                    <div className='text-center'>

                                        <p className='text-[20px] font-[800] leading-none text-[#f97316] sm:text-[24px]'>
                                            {summary.outOfSvc ?? 'NA'}
                                        </p>

                                        <p className='mt-[4px] text-[9px] font-[800] uppercase leading-[1.2] tracking-[0.5px] text-[#94a3b8] sm:text-[10px]'>
                                            Out of
                                            <br />
                                            Svc
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div className='h-[190px] sm:h-[120px]' />

        </div>

    );
}

export default OperationalObservations;