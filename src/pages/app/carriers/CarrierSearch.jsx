import React, { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';

import Search from '@mui/icons-material/Search';
import Close from '@mui/icons-material/Close';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import Main from 'components/Main';
import CarrierCard from 'components/blocks/CarrierCards';

import Api from 'api/Api';

const DEFAULT_FILTERS = {
    authority_active: false,
    authority_inactive: false,
    type_interstate: false,
    type_intrastate: false,
    authority_verified: false,
    insurance_current: false,
    risk_low: false,
    risk_medium: false,
    risk_high: false,
    fleet_min: '',
    fleet_max: ''
};

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

function CarrierSearch() {

    const [accountToken, setAccountToken] = useState(false);
    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState('Most Relevant');
    const [filters] = useState(DEFAULT_FILTERS);
    const [carriers, setCarriers] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [sortOptions, setSortOptions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);


    useEffect(function () {

        const token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);

        if (token) {setAccountToken(token);}

        loadFilters(token);

    }, []);


    function loadFilters(accountToken) {

        const formData = new FormData();

        if (accountToken) {

            formData.append('account_token', accountToken);
        }

        Api.post('backend/carrier/search/filters', formData, function (data) {

                if (data.status) {

                    setSortOptions(data.sort_options || []);
                }
            }
        );
    }

    function runSearch(searchText, page) {

        let pageNumber = page;

        if (!pageNumber) {

            pageNumber = 1;
        }

        if (!searchText || searchText.trim() === '') {

            setCarriers([]);
            setTotal(0);
            setCurrentPage(1);
            setLastPage(1);

            return;
        }

        const formData = new FormData();

        formData.append('query', searchText);
        formData.append('page', pageNumber);

        setLoading(true);

        fetch(
            'http://192.168.20.12:8000/api/handle/backend/carrier/search',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_BARRIER_TOKEN}`
                },
                body: formData
            }
        )
            .then(function (response) {

                return response.json();
            })
            .then(function (data) {

                setCarriers(data.data || []);
                setTotal(Number(data.total_results) || 0);
                setCurrentPage(data.current_page || 1);
                setLastPage(data.last_page || 1);
                setLoading(false);
            })
            .catch(function (error) {

                console.log(error);

                setLoading(false);
            });
    }

    function handleKeyDown(event) {

        if (event.key === 'Enter') {

            runSearch(query, 1);
        }
    }

    function handleClearSearch() {

        setQuery('');
        setCarriers([]);
        setTotal(0);
        setErrorMessage('');
        setCurrentPage(1);
        setLastPage(1);
    }

    function handlePrevPage() {

        if (currentPage > 1) {

            runSearch(query, currentPage - 1);
        }
    }

    function handleNextPage() {

        if (currentPage < lastPage) {

            runSearch(query, currentPage + 1);
        }
    }

    function handleSortChange(event) {

        setSortBy(event.target.value);
    }

    function renderSortLabel(selected) {

        return (

            <div className='flex items-center gap-2'>

                <span style={{ color: '#111827', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    SORT BY:
                </span>

                <span style={{ color: '#4E73DF', fontSize: '15px', fontWeight: 600 }}>
                    {selected}
                </span>

            </div>
        );
    }

    return (

        <Main active_page='search' page='carrier_search' error_message={errorMessage} success_message={successMessage} full_width>

            <Grid container spacing={3}>

                <Grid size={12}>

                    <div className='min-h-screen p-6 bg-gray-100'>

                        <div className='max-w-[1100px] mx-auto mb-[30px]'>

                            <div className='relative'>

                                <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-gray-400' />

                                <input
                                    type='text'
                                    value={query}
                                    onChange={function (event) {

                                        setQuery(event.target.value);
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder='Search MC, DOT, Company, and Phone'
                                    style={{ width: '100%', padding: '14px 140px 14px 48px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 15, color: '#111827', outline: 'none', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                                />

                                <button
                                    onClick={function () {

                                        runSearch(query, 1);
                                    }}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm'
                                >
                                    Search
                                </button>

                                {query !== '' && (

                                    <Close
                                        onClick={handleClearSearch}
                                        className='absolute right-[95px] top-1/2 -translate-y-1/2 cursor-pointer text-gray-400'
                                    />
                                )}

                            </div>

                        </div>

                        <div className='max-w-[1100px] mx-auto'>

                            <div className='flex justify-between items-center mb-10'>

                                <div className='text-sm text-gray-500'>

                                    <span className='text-sm mr-2 inline-flex items-center gap-1 font-semibold mb-2 text-[#8B93A7]'>
                                        <FiberManualRecordIcon sx={{ fontSize: 8, color: '#2563EB' }} />
                                        Search Results
                                    </span>

                                    <br />

                                    <span style={{ color: '#4B5563', fontSize: '16px', fontWeight: 400 }}>
                                        We found{' '}
                                    </span>

                                    <strong className='text-gray-900 text-[16px]'>
                                        {total.toLocaleString()} results
                                    </strong>

                                </div>

                                <Select
                                    value={sortBy}
                                    onChange={handleSortChange}
                                    IconComponent={KeyboardArrowDownIcon}
                                    size='small'
                                    displayEmpty
                                    sx={{ minWidth: 260, height: 42, borderRadius: '999px', background: '#EEF3FF', overflow: 'hidden', '& .MuiOutlinedInput-root': { borderRadius: '999px' }, '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #C7D2E9', borderRadius: '999px' }, '&:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #C7D2E9', borderRadius: '999px' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '1px solid #C7D2E9', borderRadius: '999px' }, '& .MuiSelect-select': { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 18px !important', height: '42px !important', fontSize: '15px', fontWeight: 600 }, '& .MuiSelect-icon': { color: '#4E73DF', right: 14, fontSize: 22 } }}
                                    renderValue={renderSortLabel}
                                >

                                    <MenuItem value='Most Relevant'>
                                        Most Relevant
                                    </MenuItem>

                                    {sortOptions.map(function (option) {

                                        return (

                                            <MenuItem key={option.value} value={option.value}>

                                                {option.label}

                                            </MenuItem>
                                        );
                                    })}

                                </Select>

                            </div>


                            <div className='flex flex-col gap-4 mt-9'>

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
                                        No data found
                                    </div>
                                )}


                                {!loading && carriers.length > 0 && (

                                    <>

                                        {carriers.map(function (carrier) {

                                            return (

                                                <CarrierCard key={carrier.id} carrier={carrier} />
                                            );
                                        })}


                                        <div className='flex justify-center items-center gap-4 mt-1'>

                                            <button disabled={currentPage === 1} onClick={handlePrevPage}>

                                                <ChevronLeft />

                                            </button>

                                            <div className='text-sm mt-1 font-medium'>

                                                Page {currentPage} of {lastPage}

                                            </div>

                                            <button disabled={currentPage === lastPage} onClick={handleNextPage}>

                                                <ChevronRight />

                                            </button>

                                        </div>

                                    </>

                                )}

                            </div>

                        </div>

                    </div>

                </Grid>

            </Grid>

        </Main>
    );
}

export default CarrierSearch;