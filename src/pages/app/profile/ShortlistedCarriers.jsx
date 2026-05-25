import React, { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import Main from 'components/Main';
import CarrierCard from 'components/blocks/CarrierCards';



function CarrierCardSkeleton() {

    return (

        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">

            <Skeleton variant="text" width="40%" height={24} />
            <Skeleton variant="text" width="60%" height={20} />

            <Skeleton variant="rectangular" height={80} className="rounded-lg" />

            <div className="flex gap-3">

                <Skeleton variant="text" width="20%" />
                <Skeleton variant="text" width="20%" />

            </div>

        </div>
    );
}

function ShortlistedCarriers() {

    const [loading, setLoading] = useState(true);
    const [carriers, setCarriers] = useState([]);
    const [total, setTotal] = useState(0);
    
    useEffect(function () {

        loadShortlistedCarriers();

    }, []);


    function loadShortlistedCarriers() {

        setLoading(true);

        fetch(
            'YOUR_SHORTLISTED_CARRIERS_API',
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_BARRIER_TOKEN}`
                }
            }
        )
            .then(function (response) {

                return response.json();
            })
            .then(function (data) {

                setCarriers(data.data || []);
                setTotal((data.data || []).length);

                setLoading(false);
            })
            .catch(function (error) {

                console.log(error);

                setLoading(false);
            });
    }

    return (

        <Main
            active_page='profile'
            page='shortlisted_carriers'
            full_width
        >

            <Grid container spacing={3}>

                <Grid size={12}>

                    <div className='min-h-screen p-3 md:p-4 lg:p-6 bg-gray-100'>

                        <div className='max-w-[1100px] mx-auto'>

                            <div className='mb-10'>

                                <span className='text-sm mr-2 inline-flex items-center gap-1 font-semibold mb-2 text-[#8B93A7]'>

                                    <FiberManualRecordIcon sx={{ fontSize: 8, color: '#2563EB' }} />

                                    Shortlisted Carriers

                                </span>

                                <br />

                                <span style={{ color: '#4B5563', fontSize: '16px', fontWeight: 400 }}>

                                    Total Shortlisted:{' '}

                                </span>

                                <strong className='text-gray-900 text-[16px]'>

                                    {total.toLocaleString()}

                                </strong>

                            </div>


                            <div className='flex flex-col gap-4'>

                                {loading && (

                                    <div className='flex flex-col gap-4'>

                                        {[...Array(6)].map(function (_, index) {

                                            return (

                                                <CarrierCardSkeleton key={index} />
                                            );
                                        })}

                                    </div>
                                )}


                                {!loading && carriers.length === 0 && (

                                    <div className='text-center py-[50px] text-sm text-gray-500'>

                                        No shortlisted carriers found

                                    </div>
                                )}


                                {!loading && carriers.length > 0 && (

                                    carriers.map(function (carrier) {

                                        return (

                                            <CarrierCard
                                                key={carrier.id}
                                                carrier={carrier}
                                            />
                                        );
                                    })
                                )}

                            </div>

                        </div>

                    </div>

                </Grid>

            </Grid>

        </Main>
    );
}

export default ShortlistedCarriers;