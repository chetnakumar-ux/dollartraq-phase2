import React, { Component } from 'react';

import { useParams, Navigate, redirect } from "react-router-dom";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Skeleton from '@mui/material/Skeleton';

import Main from 'components/Main';

import Api from 'api/Api';

import Sell from '@mui/icons-material/SellOutlined';
import LocalShipping from '@mui/icons-material/LocalShippingOutlined';
import PhoneIphone from '@mui/icons-material/PhoneIphone';
import Flag from '@mui/icons-material/FlagOutlined';

import ListAltOutlined from '@mui/icons-material/ListAltOutlined';
import Receipt from '@mui/icons-material/Receipt';
import DnsOutlined from '@mui/icons-material/DnsOutlined';
import RateReviewOutlined from '@mui/icons-material/RateReviewOutlined';
import ChecklistOutlined from '@mui/icons-material/ChecklistOutlined';
import ReceiptLong from '@mui/icons-material/ReceiptLong';
import Share from '@mui/icons-material/Share';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import AttachFile from '@mui/icons-material/AttachFile';

import ShipmentDetails from '../shipment/ShipmentDetails';
import ShipmentStops from '../shipment/ShipmentStops';
import LocationHistory from './LocationHistory';

// import { GoogleMap, useJsApiLoader, Polyline, LoadScript } from '@react-google-maps/api';
import { GoogleMap, useJsApiLoader, Polyline } from '@react-google-maps/api';

import NoData from 'components/blocks/NoData';

import RenderHtml from 'components/RenderHtml';

const containerStyle = {
    width: '100%',
    height: '300px',
};

const center = {
    lat: 46.65725559308588,
    lng: -105.68787278650479
};

export function withRouter(Children) {

    return (props) => {

        const params = { params: useParams() };
        return <Children {...props} params={params} />
    }
}

const MapLoader = (props) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY
    });

    return isLoaded ? props.children : props.fallback;
};

class ControlTowerShipment extends Component {

    constructor(props) {

        super();

        this.state = {

            account_token: false,
            user: false,

            loading: true,

            redirect: false,

            logged_in: false,

            error_message: '',
            success_message: '',

            row_id: false,

            shipment: false,

            active_tab: 0,

            shipment_carriers: [],
            tracking_methods: [],
            country_codes: [],
            timezones: [],

            route: [
                { lat: 46.65725559308588, lng: -105.68787278650479 }
            ],

            location_history: [],

            last_pulse: false
        }

        this.loadTimer = null;
        this.pulseTimer = null;
    }


    componentDidMount = () => {

        let account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);

        if (account_token) {

            this.setState({ account_token: account_token })

            if (this.props.params.params.row_id) {

                this.setState({ row_id: this.props.params.params.row_id }, () => {

                    this.init(account_token, this.props.params.params.row_id, true, false)
                })
            } else {

                this.setState({ redirect: '/control-tower' })
            }
        }
    }

    render() {

        if (this.state.redirect !== false) {

            return <Navigate to={this.state.redirect} />
        }

        const options = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 5,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            clickable: false,
            draggable: false,
            editable: false,
            visible: true,
            radius: 30000,
            zIndex: 1
        };

        return (

            <Main
                active_page="control_tower"

                page="shipment_single"

                error_message={this.state.error_message}
                success_message={this.state.success_message}

                full_width={true}
            >

                <>

                    {this.state.loading
                        ?
                            <Skeleton width={'100%'} height={300} style={{ marginTop: 10 }} variant='rectangle' />
                        :
                            <>
                                <MapLoader fallback={<Skeleton width={'100%'} height={300} />}>
                                    <GoogleMap
                                        mapContainerStyle={containerStyle}
                                        center={this.state.route[0]}
                                        zoom={14}
                                    >
                                        <Polyline
                                            path={this.state.route}
                                            options={options}
                                        />
                                    </GoogleMap>
                                </MapLoader>
                                {/* // <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
                                //     <GoogleMap
                                //         mapContainerStyle={containerStyle}
                                //         center={this.state.route[0]}
                                //         zoom={14}
                                //     >
                                //         <Polyline
                                //             path={this.state.route}
                                //             options={options}
                                //         />
                                //     </GoogleMap>
                                // </LoadScript> */}
                            </>
                    }

                    {this.state.loading
                        ?
                            <Grid container sx={{ marginTop: 2 }}>
                                <Grid size={{ xs: 12, md: 2 }} sx={{ padding: '0 10px;' }}>
                                    <Skeleton width={'60%'} height={30} style={{ marginTop: 10 }} />
                                    <Skeleton width={'100%'} height={50} style={{ marginTop: 30 }} />
                                    <Skeleton width={'100%'} height={50} />
                                    <Skeleton width={'100%'} height={50} />
                                    <Skeleton width={'100%'} height={50} />
                                    <Skeleton width={'100%'} height={50} />
                                    <Skeleton width={'100%'} height={50} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 10 }}>
                                    <Skeleton width={'100%'} height={70} />
                                    <Skeleton width={'100%'} height={70} />

                                    <Skeleton width={'100%'} height={70} />
                                    <Skeleton width={'100%'} height={70} />
                                    <Skeleton width={'100%'} height={70} />
                                </Grid>
                            </Grid>
                        :
                            <Grid container>

                                <Grid size={{ xs: 12, md: 2 }} sx={{ borderRight: { md: '1px solid rgba(0,0,0,.2)' }, borderBottom: { xs: '1px solid rgba(0,0,0,.2)', md: 'none' }, minHeight: 400 }}>
                                    <Box sx={{ padding: '0 10px' }}>

                                        <h5 className='m-0 mt-10'>Progress Tracker</h5>

                                        <ul className="form-progress" style={{ marginTop: 30 }}>

                                            {this.state.shipment.progress.map((_progress, index) => {

                                                let status = _progress?.status ? _progress.status : 'pending';

                                                return (
                                                    <li className={`${status}`} key={`progress_${index}`}>
                                                        <div className="fp-item-row">
                                                            <div className="fp-item-circle">
                                                                <div style={{ width: 10, height: 10, borderRadius: 100 }}></div>
                                                            </div>


                                                            <div className='ml-10'>
                                                                <label>{_progress.value}</label>
                                                                <RenderHtml
                                                                    className="fs-12 gr-6"
                                                                    html={_progress.label}
                                                                />

                                                                {_progress?.date &&

                                                                    <div className='gr-5 justify-start mt-5'>
                                                                        <CalendarMonth style={{ fontSize: 16, color: 'rgba(0,0,0,.3)' }} />
                                                                        <span className='fs-12 ml-5 gr-8'>{_progress.date}</span>
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, md: 10 }}>

                                    <Box sx={{ borderBottom: '1px solid rgba(0,0,0,.2)', borderTop: '1px solid rgba(0,0,0,.2)', backgroundColor: '#fff', }}>

                                        <Grid container spacing={3} sx={{ mb: { xs: '20px', md: 0 } }}>


                                            <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ minHeight: 50, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', borderRight: '3px solid rgba(0,0,0,.1)', padding: '5px 0' }}>


                                                <Box className="align-center" sx={{}}>
                                                    <div>
                                                        <Sell className='gr-6' />
                                                    </div>
                                                    <div className='ml-10'>
                                                        <span className='fs-14 gr-8'>Load ID</span>
                                                        <h3 className='m-0 fs-18 gr-7 c-primary'>#{this.state.shipment.shipment_number}</h3>
                                                    </div>
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ minHeight: 50, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', borderRight: '3px solid rgba(0,0,0,.1)', padding: '5px 0' }}>


                                                <Box className="justify-start" sx={{}}>
                                                    <div>
                                                        <LocalShipping className='gr-6' />
                                                    </div>
                                                    <div className='ml-10'>
                                                        <span className='fs-14 gr-8'>Carrier Name</span>
                                                        <h3 className='m-0 fs-18 gr-7 c-primary lh-1'>{this.state.shipment.shippment_carrier_label}</h3>
                                                    </div>
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ minHeight: 50, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', borderRight: '3px solid rgba(0,0,0,.1)' }}>


                                                <Box className="justify-start" sx={{}}>
                                                    <div>
                                                        <PhoneIphone className='gr-6' />
                                                    </div>
                                                    <div className='ml-10'>
                                                        <span className='fs-14 gr-8'>Driver Contact</span>
                                                        <h3 className='m-0 fs-18 gr-7 c-primary'>{this.state.shipment.tracking_full_number}</h3>
                                                    </div>
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ minHeight: 50, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>


                                                <Box className="justify-start" sx={{}}>
                                                    <div>
                                                        <Flag className='gr-6' />
                                                    </div>
                                                    <div className='ml-10'>
                                                        <span className='fs-14 gr-8'>Tracking Status</span>


                                                        {this.state.shipment?.action_center.app_installed === 'yes'
                                                            ?
                                                            <div>
                                                                <h3 className='m-0 fs-18 gr-7 c-green'>App Installed</h3>
                                                                {this.state.shipment.action_center.device !== '' &&

                                                                    <span className='fs-12 fw-bold gr-6'>{this.state.shipment.action_center.device}</span>
                                                                }
                                                            </div>
                                                            :
                                                            <h3 className='m-0 fs-18 gr-7 c-red'>App Not Installed</h3>
                                                        }
                                                    </div>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    <Box>
                                        <Tabs
                                            className="tabs-list"
                                            value={this.state.active_tab}
                                            onChange={(e, value) => {


                                                this.setState({ active_tab: value })
                                            }}
                                            variant="scrollable"
                                            scrollButtons
                                            allowScrollButtonsMobile
                                        >
                                            <Tab label="Tripsheet" icon={<ListAltOutlined />} />
                                            <Tab label="Location History" icon={<Receipt />} />
                                            <Tab label="Load Details" icon={<DnsOutlined />} />
                                            <Tab label="Notes" icon={<RateReviewOutlined />} />
                                            <Tab label="Additional Statuses" icon={<ChecklistOutlined />} />
                                            <Tab label="Documents" icon={<ReceiptLong />} />
                                            <Tab label="Share" icon={<Share />} />
                                        </Tabs>

                                        <Box>

                                            {this.state.active_tab === 0 &&

                                                <ShipmentStops
                                                    shipment={this.state.shipment}
                                                />
                                            }

                                            {this.state.active_tab === 1 &&

                                                <>
                                                    {this.state.location_history.length > 0
                                                        ?
                                                        <LocationHistory location_history={this.state.location_history} />
                                                        :
                                                        <NoData size="small" message="Data not available." icon={<Receipt />} />
                                                    }
                                                </>
                                            }

                                            {this.state.active_tab === 2 &&

                                                <Box sx={{ padding: 4 }}>
                                                    <ShipmentDetails
                                                        shipment={this.state.shipment}
                                                    />
                                                </Box>
                                            }

                                            {this.state.active_tab === 3 &&

                                                <Box sx={{ p: 2 }}>
                                                    {this.state.shipment.notes
                                                        ?
                                                        <p className='fs-14'>{this.state.shipment.notes}</p>
                                                        :
                                                        <NoData size="small" message="Notes not available." icon={<RateReviewOutlined />} />
                                                    }
                                                </Box>
                                            }

                                            {this.state.active_tab === 4 &&

                                                <NoData size="small" message="Status data not available." icon={<ChecklistOutlined />} />
                                            }

                                            {this.state.active_tab === 5 &&

                                                <>
                                                    {this.state.shipment.documents?.length > 0
                                                        ?
                                                        <Grid container spacing={2}>

                                                            {this.state.shipment.documents.map((doc, idx) => (

                                                                <Grid key={idx} size="auto">

                                                                    <a href={doc.document_url} target="_blank" rel="noreferrer" style={{ display: 'block', padding: 15, background: '#eee', borderRadius: 8 }}>
                                                                        <AttachFile sx={{ fontSize: 30 }} />
                                                                    </a>
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                        :
                                                        <NoData size="small" message="Documents not available." icon={<ReceiptLong />} />
                                                    }
                                                </>
                                            }
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                    }
                </>
            </Main>
        )
    }

    init = (account_token, row_id, initing, last) => {

        const formData = new FormData();
        formData.append('account_token', account_token);
        formData.append('row_id', row_id);

        this.setState({ loading: initing })

        var self = this;
        Api.post('app/shipment/single', formData, function (data) {

            if (data.status) {

                if (data.coords.length) {

                    const numericCoords = data.coords.map(item => ({
                        lat: parseFloat(item.lat),
                        lng: parseFloat(item.lng)
                    }));

                    if (last) {

                        let _route = self.state.route;

                        self.setState({ route: [..._route, ...numericCoords] })
                    } else {

                        self.setState({ route: numericCoords })
                    }

                    const location_history_coords = data.coords.map(item => ({
                        lat: parseFloat(item.lat),
                        lng: parseFloat(item.lng),
                        date: item.date
                    }));

                    if (last) {

                        let _location_history = self.state.location_history;

                        self.setState({ location_history: [..._location_history, ...location_history_coords] })
                    } else {

                        self.setState({ location_history: location_history_coords })
                    }
                }

                self.setState({ shipment: data.shipment }, () => {

                    if (data.shipment.status == '1' || data.shipment.status == '2') {

                        if (self.loadTimer === null) {

                            self.reloadShipment(account_token, row_id, false)
                        }
                    } else if (data.shipment.status == '3') {

                        if (self.loadTimer) clearInterval(self.loadTimer);

                        self.loadTimer = null;

                        if (self.pulseTimer === null) {

                            self.reloadPulses(account_token, row_id, false)
                        }
                    }

                    self.setState({ loading: false })
                });
            } else {

                self.setState({ loading: false })
            }
        });
    }

    loadPulses = (account_token, row_id, initing) => {

        const formData = new FormData();
        formData.append('account_token', account_token);
        formData.append('row_id', row_id);

        if (this.state.last_pulse !== false) {

            formData.append('last_pulse', this.state.last_pulse);
        }

        this.setState({ loading: initing })

        var self = this;

        Api.post('app/shipment/tracking/pulses', formData, function (data) {

            if (data.status) {

                const numericCoords = data.coords.map(item => ({
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lng)
                }));

                self.setState({ route: numericCoords })

                if (self.state.last_pulse !== false) {

                    let _route = self.state.route;

                    self.setState({ route: [..._route, ...numericCoords] })
                } else {

                    self.setState({ route: numericCoords })
                }

                if (data.pulses.length > 0) {

                    self.setState({ last_pulse: data.pulses[data.pulses.length - 1]['id'] });
                }

                const location_history_coords = data.coords.map(item => ({
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lng),
                    date: item.date
                }));

                if (self.state.last_pulse !== false) {

                    let _location_history = self.state.location_history;

                    self.setState({ location_history: [..._location_history, ...location_history_coords] })

                } else {

                    self.setState({ location_history: location_history_coords })
                }

                if (data.shipment.status == '4') {

                    self.init(account_token, row_id, false, true)

                    clearInterval(self.pulseTimer);
                    self.pulseTimer = null;
                }
            } else {

                self.setState({ loading: false })
            }
        });
    }

    reloadShipment = (account_token, row_id, initing) => {

        this.loadTimer = setInterval(() => {

            this.init(account_token, row_id, initing, false)
        }, 10000);
    }

    reloadPulses = (account_token, row_id, initing) => {

        this.loadTimer = setInterval(() => {

            this.loadPulses(account_token, row_id, initing)
        }, 10000);
    }

    componentWillUnmount = () => {

        if (this.loadTimer) clearInterval(this.loadTimer);
        if (this.pulseTimer) clearInterval(this.pulseTimer);

        this.loadTimer = null;
        this.pulseTimer = null;
    }
}

export default withRouter(ControlTowerShipment)