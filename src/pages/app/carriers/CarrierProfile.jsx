import React, { useEffect, useState, useRef } from 'react';
import CarrierProfileSection from './../../../profileComponents/CarrierProfileSection';
import CarrierProfileApi from 'api/CarrierProfileApi';
import RiskFactorCard from './../../../profileComponents/RiskFactorCard';

// Dashboard Components
import SafetyPerformance from './../../../profileComponents/SafetyPerformance';
import FleetSummary from './../../../profileComponents/FleetSummary';
import InsuranceCard from './../../../profileComponents/InsuranceCard';
import HighFrequencyLanes from './../../../profileComponents/HighFrequencyLanes';
import OperationalObservations from './../../../profileComponents/OperationalObservations';
import SafetyIntelligenceConsole from './../../../profileComponents/safetyIntelligence/SafetyIntelligenceConsole';
import FleetDetails from './../../../profileComponents/FleetDetails';
import LoadHistory from './../../../profileComponents/LoadHistory';

import {
    Add, Bolt, CheckCircle, WarningAmber, LocalShipping, 
    Groups, History, InfoOutlined, Timeline, Assessment 
} from '@mui/icons-material';

function CarrierProfile() {
    const [carrier, setCarrier] = useState(null);
    const [activeTab, setActiveTab] = useState('RISK FACTORS');
    const [activeSidebar, setActiveSidebar] = useState('RISK FACTORS');

    const sectionRefs = {
        'INFORMATION': useRef(null),
        'RISK FACTORS': useRef(null),
        'OPERATIONAL OBSERVATIONS': useRef(null),
        'SAFETY INTELLIGENCE CONSOLE': useRef(null),
        'FLEET DETAILS': useRef(null),
        'LOAD HISTORY': useRef(null),
        'COMPANY SNAPSHOT': useRef(null)
    };

    useEffect(function () {
        CarrierProfileApi.getCarrierProfile().then(function (data) {
            setCarrier(data);
        });

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSidebar(entry.target.getAttribute('data-section'));
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        Object.values(sectionRefs).forEach((ref) => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => observer.disconnect();
    }, [carrier]);

    const scrollToSection = (label) => {
        const element = sectionRefs[label].current;
        if (element) {
            const offset = 32;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    if (!carrier) return null;

    const allSidebarOptions = [
        { id: 'info', label: 'INFORMATION', icon: <InfoOutlined /> },
        { id: 'risk', label: 'RISK FACTORS', icon: <WarningAmber /> },
        { id: 'obs', label: 'OPERATIONAL OBSERVATIONS', icon: <Timeline /> },
        { id: 'safety', label: 'SAFETY INTELLIGENCE CONSOLE', icon: <Assessment /> },
        { id: 'fleet', label: 'FLEET DETAILS', icon: <LocalShipping /> },
        { id: 'load', label: 'LOAD HISTORY', icon: <History /> },
        { id: 'company', label: 'COMPANY SNAPSHOT', icon: <Groups /> }
    ];

    const filteredSidebarOptions = allSidebarOptions.filter(opt => {
        if (activeTab === 'RISK FACTORS' && opt.label === 'INFORMATION') return false;
        return true;
    });

    const tabs = ['RISK FACTORS', 'COMPANY ASSOCIATIONS', 'EQUIPMENT INSIGHTS', 'INDUSTRY BENCHMARKS', 'CONTACT HISTORY'];

    return (
        <div className='min-h-screen bg-[#f6f8fc] p-[32px]'>
            <div className='mx-auto max-w-[1600px]'>
                
                <CarrierProfileSection
                    variant='hero'
                    title={carrier.company_name}
                    subtitle={carrier.legal_name}
                    leftItems={[
                        { label: 'STATUS', value: carrier.status, icon: <CheckCircle className='!text-[15px]' /> },
                        { label: 'BASE OPERATION', value: carrier.base_operation },
                        { label: 'YEARS ACTIVE', value: carrier.years_active }
                    ]}
                    rightItems={[
                        { label: 'MC#', value: carrier.mc_number },
                        { label: 'DOT#', value: carrier.dot_number },
                        { label: 'EIN#', value: carrier.ein },
                        { label: 'DUNS#', value: carrier.duns }
                    ]}
                    actions={[
                        { label: 'Add to Preferred', icon: <Add className='!text-[18px]' />, variant: 'secondary' },
                        { label: 'Connect', icon: <Bolt className='!text-[18px]' />, variant: 'primary' }
                    ]}
                />

                <div className="mt-[32px] grid grid-cols-12 gap-[32px]">
                    <div className="col-span-8 space-y-[32px]">
                        <SafetyPerformance data={carrier.safety} />
                        <FleetSummary data={carrier.fleet} />
                    </div>
                    <div className="col-span-4 space-y-[32px]">
                        <InsuranceCard data={carrier.insurance} />
                        <HighFrequencyLanes lanes={carrier.lanes} />
                    </div>
                </div>

                <div className='mt-[32px] flex gap-[32px] items-start'>
                    
                    <aside className='sticky top-[32px] w-[320px] h-fit shrink-0'>
                        <div className='min-h-[500px] rounded-[16px] border border-[#d9e1ee] bg-white p-[12px] shadow-sm flex flex-col'>
                            {filteredSidebarOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    className={`flex w-full items-center gap-[14px] rounded-[10px] px-[16px] py-[25px] mb-[4px] text-[11px] font-[700] transition-all uppercase tracking-tight ${
                                        activeSidebar === opt.label ? 'text-[#1656b8]' : 'text-[#64748b] hover:bg-gray-50'
                                    }`}
                                    onClick={() => scrollToSection(opt.label)}
                                >
                                    {React.cloneElement(opt.icon, { className: '!text-[18px]' })}
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </aside>

                    <main className='flex-1 min-w-0 space-y-[32px]'>
                        
                        {/* THE TABBED CONTAINER (Risk Factors, etc.) */}
                        <div className='rounded-[16px] border border-[#d9e1ee] bg-white overflow-hidden shadow-sm'>
                            <div className='sticky top-[0px] z-10 border-b border-[#d9e1ee] bg-[#EBF5FF] px-[62px]'>
                                <div className='flex gap-[65px]'> 
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`relative py-[20px] text-[11px] font-[700] tracking-[1px] uppercase transition-all ${
                                                activeTab === tab ? '' : 'text-[#7c8fac] hover:text-[#111827]'
                                            }`}
                                        >
                                            {tab}
                                            {activeTab === tab && (
                                                <div className='absolute bottom-0 left-[15%] h-[3px] w-[70%] rounded-t-[4px] bg-[#1c5dbe]' />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className='p-[32px] bg-[#fbfcfe]'>
                                {activeTab !== 'RISK FACTORS' && (
                                    <div ref={sectionRefs['INFORMATION']} data-section="INFORMATION" className='mb-[32px]'>
                                        <div className='p-[20px] border border-dashed border-[#d9e1ee] rounded-[12px]'>
                                            <h3 className='text-[14px] font-bold text-[#1656b8] mb-4'>CARRIER INFORMATION</h3>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'RISK FACTORS' && (
                                    <div ref={sectionRefs['RISK FACTORS']} data-section="RISK FACTORS" className='space-y-[32px]'>
                                        <RiskFactorCard 
                                            type='success' 
                                            title="RELIABILITY FACTORS"
                                            badge="PREMIUM STANDING"
                                            items={carrier.reliability?.items} 
                                        />
                                        <RiskFactorCard 
                                            type='risk' 
                                            title="RISK FACTORS"
                                            badge="IMMEDIATE ATTENTION"
                                            items={carrier.risks?.items} 
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <section 
                            ref={sectionRefs['OPERATIONAL OBSERVATIONS']} 
                            data-section="OPERATIONAL OBSERVATIONS"
                        >
                            <OperationalObservations data={carrier.observations} />
                        </section>

                        <section 
                            ref={sectionRefs['SAFETY INTELLIGENCE CONSOLE']} 
                            data-section="SAFETY INTELLIGENCE CONSOLE"
                            className="scroll-mt-[32px]" 
                        >
                            <SafetyIntelligenceConsole data={carrier.safety} />
                        </section>

                        <section
                            ref={sectionRefs['FLEET DETAILS']}
                            data-section="FLEET DETAILS"
                        >
                           <FleetDetails data={carrier.fleet} />
                        </section>

  <section
    ref={sectionRefs['LOAD HISTORY']}
    data-section="LOAD HISTORY"
>
    <LoadHistory data={carrier?.loadHistory} />
</section>

                        {/* 5. COMPANY SNAPSHOT */}
                        <section 
                            ref={sectionRefs['COMPANY SNAPSHOT']} 
                            data-section="COMPANY SNAPSHOT"
                            className="min-h-[500px] rounded-[16px] border border-[#d9e1ee] bg-white p-[32px]"
                        >
                            <h2 className="text-[14px] font-bold uppercase text-[#64748b]">COMPANY SNAPSHOT</h2>
                        </section>

                    </main>
                </div>
            </div>
        </div>
    );
}

export default CarrierProfile;