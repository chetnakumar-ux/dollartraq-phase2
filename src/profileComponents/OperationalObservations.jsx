import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Timeline } from '@mui/icons-material';
import CarrierProfileApi from 'api/CarrierProfileApi';

const containerStyle = { width: '100%', height: '450px' };
const center = { lat: 40.825, lng: -73.345 };

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
        CarrierProfileApi.getObservations(tf).then(function (result) {
            setMetrics(result);
            setLoading(false);
        });
    }, []);

    useEffect(function () {
        fetchObservationData(timeframe);
    }, [timeframe, fetchObservationData]);

    const timeframes = ['7D', '3M', '6M', '1Y'];

    if (!metrics) return null;

    return (
        <div className="rounded-[16px] border border-[#d9e1ee] bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-[32px] py-[24px]">
                <div className="flex items-center gap-[10px] text-[#1656b8]">
                    <Timeline className="!text-[20px]" />
                    <span className="text-[13px] font-[800] uppercase tracking-tight">
                        Operational Observations
                    </span>
                </div>
                
                <div className="flex rounded-[8px] border border-[#d9e1ee] p-[3px]">
                    {timeframes.map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-[16px] py-[6px] text-[10px] font-bold rounded-[6px] transition-all ${
                                timeframe === tf 
                                ? 'bg-[#3b82f6] text-white shadow-sm' 
                                : 'text-[#64748b] hover:bg-gray-50'
                            }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {/* Map Container - No overflow-hidden here */}
            <div className="relative border-t border-[#d9e1ee]">
                <div className="overflow-hidden">
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={11}
                            options={{ disableDefaultUI: true }}
                        />
                    ) : (
                        <div style={containerStyle} className="bg-gray-50 animate-pulse" />
                    )}
                </div>

                {/* THE OVERLAP LOGIC: top-[100%] puts it at the bottom line, -translate-y-1/2 pulls it halfway up */}
<div className="absolute top-[100%] left-[24px] right-[24px] z-10 -translate-y-1/2">
    <div
        className={`grid grid-cols-12 items-center rounded-[14px] border border-[#e5e7eb] bg-[#f8fafc] px-[22px] py-[18px] transition-opacity ${
            loading ? 'opacity-50' : 'opacity-100'
        }`}
    >
        {/* Inspections Matrix */}
        <div className="col-span-3">
            <p className="mb-[14px] text-[11px] font-[800] uppercase tracking-[1.6px] text-[#94a3b8]">
                Inspections Matrix
            </p>
            <div className="flex gap-[18px]">
                <span className="flex items-center gap-[6px] text-[11px] font-[700] text-[#475569]">
                    <div className="h-[7px] w-[7px] rounded-full bg-[#10b981]" />
                    {metrics.inspections.cln} CLN
                </span>
                <span className="flex items-center gap-[6px] text-[11px] font-[700] text-[#475569]">
                    <div className="h-[7px] w-[7px] rounded-full bg-[#f59e0b]" />
                    {metrics.inspections.vio} VIO
                </span>
                <span className="flex items-center gap-[6px] text-[11px] font-[700] text-[#475569]">
                    <div className="h-[7px] w-[7px] rounded-full bg-[#ef4444]" />
                    {metrics.inspections.oos} OOS
                </span>
            </div>
        </div>

        {/* Crash Telemetry */}
        <div className="col-span-3 pl-[10px]">
            <p className="mb-[14px] text-[11px] font-[800] uppercase tracking-[1.6px] text-[#94a3b8]">
                Crash Telemetry
            </p>
            <div className="flex gap-[18px]">
                <span className="flex items-center gap-[6px] text-[11px] font-[700] text-[#475569]">
                    <div className="h-[7px] w-[7px] rounded-full bg-[#f59e0b]" />
                    {metrics.crash.tow} TOW
                </span>
                <span className="flex items-center gap-[6px] text-[11px] font-[700] text-[#475569]">
                    <div className="h-[7px] w-[7px] rounded-full bg-[#ef4444]" />
                    {metrics.crash.inj} INJ
                </span>
            </div>
        </div>

        {/* Main Stats */}
        <div className="col-span-6">
            <div className="grid grid-cols-3 items-center rounded-[12px] border border-[#e5e7eb] bg-[#f8fafc] px-[10px] py-[10px]">
                <div className="text-center">
                    <p className="text-[24px] leading-none font-[800] text-[#0f172a]">
                        {metrics.summary.total}
                    </p>
                    <p className="mt-[4px] text-[10px] font-[800] uppercase leading-[1.2] tracking-[0.5px] text-[#94a3b8]">
                        Total
                        <br />
                        Insp
                    </p>
                </div>

                <div className="flex items-center justify-center">
                    <div className="h-[42px] w-[1px] bg-[#dbe2ea]" />
                    <div className="mx-auto text-center">
                        <p className="text-[24px] leading-none font-[800] text-[#0f172a]">
                            {metrics.summary.cleanRate}
                        </p>
                        <p className="mt-[4px] text-[10px] font-[800] uppercase leading-[1.2] tracking-[0.5px] text-[#94a3b8]">
                            Clean
                            <br />
                            Rate
                        </p>
                    </div>
                    <div className="h-[42px] w-[1px] bg-[#4f637a]" />
                </div>

                <div className="text-center">
                    <p className="text-[24px] leading-none font-[800] text-[#f97316]">
                        {metrics.summary.outOfSvc}
                    </p>
                    <p className="mt-[4px] text-[10px] font-[800] uppercase leading-[1.2] tracking-[0.5px] text-[#94a3b8]">
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

            {/* SPACER: This creates room for the bottom half of the card so it doesn't overlap the next section */}
            <div className="h-[80px]" />
        </div>
    );
}

export default OperationalObservations;