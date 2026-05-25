import React, { Component } from 'react';
import { 
    CloudOffOutlined, 
    HubOutlined, 
    TimelineOutlined, 
    TerminalOutlined, 
    SpeedOutlined 
} from '@mui/icons-material';
import Main from 'components/Main';

class LogisticsCapabilitiesDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSubTab: 'platform' // Options: 'platform', 'api', 'data'
        };
    }

    handleTabChange(tabName) {
        this.setState({ activeSubTab: tabName });
    }

    render() {
        return (
             <Main active_page='pricing' page='pricing'  full_width>
            <div className="w-full bg-[#F6F7F0] min-h-screen font-sans antialiased text-[#0f172a] pb-[100px]">
                
                {/* ── HERO BANNER CONTAINER ─────────────────────────────────── */}
                <div className="w-full  mx-auto pt-[44px] pb-[48px] px-[24px] flex flex-col items-center text-center">
                    
                    {/* Top Version Announcement Tag */}
                    <div className="inline-flex items-center gap-[6px] bg-[#eff6ff] border border-[#dbeafe] px-[12px] py-[4px] rounded-full mb-[24px]">
                        <span className="h-[6px] w-[6px] rounded-full bg-[#2563eb] animate-pulse" />
                        <span className="text-[11px] font-semibold text-[#2563eb] tracking-wide">
                            Now: Enterprise Risk Dashboard v2.0
                        </span>
                    </div>

                    {/* Grand Headline Statement */}
                    <h1 className="text-[48px] font-normal tracking-tight text-[#0f172a] max-w-[850px] leading-[60px]">
                        Sourcing, compliance, and <span className="text-[#2563eb] font-medium">risk management</span> — simplified.
                    </h1>

                    {/* Explanatory Context Subtext */}
                    <p className="text-[15px] font-normal text-[#64748b] max-w-[620px] mt-[20px] leading-[24px]">
                        The all-in-one logistics operating system for high-volume freight brokers and enterprise shippers looking to scale with confidence.
                    </p>

                    {/* ── TRI-STATE INTERACTIVE BUTTON SLIDER ──────────────────── */}
                    <div className="mt-[36px] inline-flex bg-[#f1f5f9] border border-[#b2b5b9] p-[5px] rounded-[10px] ">
                        <button 
                            onClick={() => { this.handleTabChange('platform'); }}
                            className={`px-[24px] py-[10px] text-[13px] font-semibold rounded-[10px] transition-all duration-200 ${this.state.activeSubTab === 'platform' ? 'bg-[#0052cc] text-white shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'}`}
                        >
                            Platform Access
                        </button>
                        <button 
                            onClick={() => { this.handleTabChange('api'); }}
                            className={`px-[24px] py-[10px] text-[13px] font-semibold rounded-[10px] transition-all duration-200 ${this.state.activeSubTab === 'api' ? 'bg-[#0052cc] text-white shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'}`}
                        >
                            API Integration
                        </button>
                        <button 
                            onClick={() => { this.handleTabChange('data'); }}
                            className={`px-[24px] py-[10px] text-[13px] font-semibold rounded-[10px] transition-all duration-200 ${this.state.activeSubTab === 'data' ? 'bg-[#0052cc] text-white shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'}`}
                        >
                            Data Solutions
                        </button>
                    </div>

                </div>

{/* ── RENDER ROUTER LOGIC CONTENT AREA ──────────────────────── */}
<div className="w-full px-[30px]">
    {this.state.activeSubTab !== 'platform' ? (
        <div className="rounded-[24px] border border-dashed border-[#cbd5e1] bg-white p-[100px] flex flex-col items-center justify-center text-center">
            <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#f1f5f9] text-[#94a3b8] mb-[18px]">
                <CloudOffOutlined sx={{ fontSize: 32 }} />
            </div>
            <h3 className="text-[17px] font-semibold text-[#1e293b] tracking-[-0.02em]">
                No Data Found
            </h3>
            <p className="text-[13px] text-[#64748b] mt-[6px] max-w-[420px] leading-[20px]">
                No deployment modules or dynamic data logs are connected to this option tab environment.
            </p>
        </div>
    ) : (
        <div className="space-y-[20px]">
            {/* Section Sub-Header Title Label Row */}
            <div className="grid grid-cols-12 gap-[18px] items-start mb-[8px]">
                <div className="col-span-5">
                    <p className="text-[9px] leading-[12px] font-bold uppercase tracking-[0.28em] text-[#1d63d8] mb-[12px]">
                        Capabilities
                    </p>
                    <h2 className="text-[28px] leading-[32px] font-normal tracking-[-0.04em] text-[#18181b] max-w-[420px]">
                        Engineered for the Modern Network
                    </h2>
                </div>

                <div className="col-span-7 pt-[25px]">
                    <p className="text-[14px] text-[#4b5563] font-normal max-w-[430px] leading-[22px]">
                        Breaking down data silos with edge-computing and secure architectural foundations.
                    </p>
                </div>
            </div>

            {/* Top Tier Visual Feature Blocks */}
            <div className="grid grid-cols-12 gap-[16px]">
                {/* Left Card */}
                <div className="col-span-8 rounded-[24px] bg-white border border-[#eef2f6] px-[24px] py-[26px] min-h-[180px]">
                    <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[#eef4ff] text-[#1b63d8] mb-[24px]">
                        <HubOutlined sx={{ fontSize: 18 }} />
                    </div>

                    <div className="space-y-[10px]">
                        <h3 className="text-[18px] leading-[24px] font-normal tracking-[-0.03em] text-[#1a1a1a]">
                            Edge Network Visualization
                        </h3>
                        <p className="text-[13px] text-[#5f6b7a] leading-[22px] max-w-[560px]">
                            Track assets across 120+ global nodes with sub-second latency. Our proprietary edge mesh ensures you never lose sight of a single parcel. Robust endpoints designed for seamless ERP and warehouse integration within minutes.
                        </p>
                    </div>
                </div>

                {/* Right Card */}
                <div className="col-span-4 rounded-[24px] bg-[#001a63] px-[24px] py-[24px] min-h-[180px] flex flex-col justify-between text-white">
                    <div>
                        <div className="flex h-[22px] w-[22px] items-center justify-center text-[#73b6ff] mb-[24px]">
                            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>

                        <h3 className="text-[16px] leading-[22px] font-normal tracking-[-0.02em] text-white mb-[12px]">
                            Secured Sourcing
                        </h3>

                        <p className="text-[12.5px] text-[#a8c3ff] leading-[20px] max-w-[220px]">
                            Blockchain-verified vendor validation and automated compliance monitoring for every single touchpoint.
                        </p>
                    </div>

                    <button className="w-full h-[40px] rounded-full bg-white text-[#6d92d9] text-[12px] font-medium hover:bg-[#f5f7fb] transition-colors mt-[18px]">
                        Learn More
                    </button>
                </div>
            </div>

            {/* Bottom Tier Cards */}
            <div className="grid grid-cols-3 gap-[16px]">
                <div className="rounded-[22px] bg-white border border-[#eef2f6] px-[20px] py-[20px] min-h-[136px]">
                    <div className="flex h-[24px] w-[24px] items-center justify-center text-[#1c63d8] mb-[18px]">
                        <TimelineOutlined sx={{ fontSize: 16 }} />
                    </div>
                    <div className="space-y-[8px]">
                        <h4 className="text-[14px] leading-[20px] font-normal tracking-[-0.02em] text-[#1f2937]">
                            Predictive Analytics
                        </h4>
                        <p className="text-[12px] text-[#6b7280] leading-[20px]">
                            AI models that forecast delays before they happen, suggesting reroutes in real-time.
                        </p>
                    </div>
                </div>

                <div className="rounded-[22px] bg-white border border-[#eef2f6] px-[20px] py-[20px] min-h-[136px]">
                    <div className="flex h-[24px] w-[24px] items-center justify-center text-[#1c63d8] mb-[18px]">
                        <TerminalOutlined sx={{ fontSize: 16 }} />
                    </div>
                    <div className="space-y-[8px]">
                        <h4 className="text-[14px] leading-[20px] font-normal tracking-[-0.02em] text-[#1f2937]">
                            Developer API
                        </h4>
                        <p className="text-[12px] text-[#6b7280] leading-[20px]">
                            Robust endpoints designed for seamless ERP and warehouse integration within minutes.
                        </p>
                    </div>
                </div>

                <div className="rounded-[22px] bg-white border border-[#eef2f6] px-[20px] py-[20px] min-h-[136px]">
                    <div className="flex h-[24px] w-[24px] items-center justify-center text-[#1c63d8] mb-[18px]">
                        <SpeedOutlined sx={{ fontSize: 16 }} />
                    </div>
                    <div className="space-y-[8px]">
                        <h4 className="text-[14px] leading-[20px] font-normal tracking-[-0.02em] text-[#1f2937]">
                            Instant Fleet Sync
                        </h4>
                        <p className="text-[12px] text-[#6b7280] leading-[20px]">
                            Onboard new vehicles and drivers with a single QR code and automated credentialing.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )}
</div>

            </div>
            </Main>
        );
    }
}

export default LogisticsCapabilitiesDashboard;