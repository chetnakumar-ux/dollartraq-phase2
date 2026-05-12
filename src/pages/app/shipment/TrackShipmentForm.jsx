import React, { Component } from 'react';

import { useParams, Navigate, redirect } from "react-router-dom";

import WdForm from 'components/wd/form/WdForm';

import Btn from 'components/Btn';

import Close from '@mui/icons-material/Close';
import Add from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import DragIndicator from '@mui/icons-material/DragIndicator';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Map from '@mui/icons-material/Map';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import Box from '@mui/material/Box';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import FormHelperText from '@mui/material/FormHelperText'

import Grid from '@mui/material/Grid';

import Api from 'api/Api';

import Main from 'components/Main';

import Loader from 'components/Loader';

import SortableList, { SortableItem } from "react-easy-sort";

import NoData from 'components/blocks/NoData';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import cargo from 'assets/images/cargo.svg'

export function withRouter(Children){

    return(props) => {

        const params = {params: useParams()};
        return <Children {...props} params={params} />
    }
}

class TrackShipmentForm extends Component {

    constructor(props) {
        super();
        this.state = {

            account_token: false,

            tabs: [
                {key: 'shipment-summary', label: 'Shipment Summary', done: false, current: true},
                {key: 'trip-sheet', label: 'Trip Sheet', done: false, current: false},
                {key: 'schedule-alerts', label: 'Schedule Alerts', done: false, current: false},
            ],

            current_tab: '',
            tab_progress: [],

            customers_groups: [],
            countries: [],

            add_address: false,

            shipment_carriers: [],
            tracking_methods: [],
            country_codes: [],
            timezones: [],
            countries: [],

            track_days: [],
            track_time: [],
            stop_types: [],

            updates_list: [
                {send_updates_to: '', update_type: '', track_days: '1', track_time: '15', error: false}
            ],

            reload_address: false,

            initing: true,

            shipment: false,

            step: '',
            row_id: '',

            redirect: false,

            trip_sheet_form: false,

            trip_stops: [],

            trip_stop_to_edit: false,

            updating_trip_sheet: false,

            shipments_count: false,

            map_popup: false,

            location_coordicates: {},
            address_string: {address: '', address_2: '', city: '', state: '', zipcode: '', country: ''}
        }
    }

    componentDidMount = () => {

        let account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        
        if(account_token){
            
            this.init(account_token)
            this.setState({account_token: account_token})
        }

        if(this.props.params.params.step){

            this.setState({step: this.props.params.params.step})
        }

        if(this.props.params.params.row_id){

            this.setState({row_id: this.props.params.params.row_id})
        }

        window.setTimeout(() => {

            if(this.state.row_id !== ''){
            
                if(this.state.step === 'trip-sheet'){

                    let tab_progress = this.state.tab_progress;

                    tab_progress.push('shipment-summary')

                    this.setState({current_tab: 'trip-sheet', tab_progress: tab_progress})

                    this.shipment_trip_stop_list(this.state.account_token)
                
                }else if(this.state.step === 'schedule-alerts'){

                    let tab_progress = this.state.tab_progress;

                    tab_progress.push('shipment-summary')
                    tab_progress.push('trip-sheet')

                    this.setState({current_tab: 'schedule-alerts', tab_progress: tab_progress})
                }else{

                    this.setState({current_tab: 'shipment-summary'})
                }
            }else{

                this.setState({current_tab: 'shipment-summary'})
            }
        }, 100)
    }

    render(){

        if(this.state.redirect !== false){

            return <Navigate to={this.state.redirect} />
        }

        return (

            <Main
                page="track_shipment"
                active_page="track_shipment"
                title={`Track Shipment ${this.state.shipment !== false ? `- #${this.state.shipment.shipment_number}` : ''}`}
            >

                <Grid container spacing={3}>

                    {this.state.initing
                        ?
                            <>
                                <Grid size={{ xs: 12, md: 2 }}>
                                    <Stack>
                                        <Skeleton height={100} />
                                        <Skeleton height={100} />
                                        <Skeleton height={100} />
                                    </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, md: 10 }}>
                                    <Stack>
                                        <Skeleton height={800} variant='rounded' />
                                    </Stack>
                                </Grid>
                            </>
                        :
                            <>
                                {this.state.shipments_count
                                    ?
                                        <>
                                            <Grid size={{ xs: 12, md: 2 }}>
                                                <ul className='form-progress'>
                                                    {this.state.tabs.map((_tab, index) => {

                                                        return (
                                                            <li
                                                                key={`tab_${_tab.key}`}
                                                                className={this.state.tab_progress.indexOf(_tab.key) > -1 ? 'visited' : this.state.current_tab === _tab.key ? 'current' : 'pending'}
                                                                onClick={() => {

                                                                    if(this.state.tab_progress.indexOf(_tab.key) > -1 && this.state.row_id !== false){

                                                                        if(_tab.key === 'shipment-summary'){
                                                                        
                                                                            this.setState({redirect: `/edit/track-shipment/shipment-summary/${this.state.row_id}`})
                                                                        }

                                                                        // let tab_progress = this.state.tab_progress;

                                                                        // tab_progress.splice(tab_progress.indexOf(_tab.key), 1);

                                                                        // if(_tab.key === 'shipment-summary'){

                                                                        //     if(this.state.tab_progress.indexOf('trip-sheet') > -1){

                                                                        //         tab_progress.splice(tab_progress.indexOf('trip-sheet'), 1);
                                                                        //     }
                                                                        // }

                                                                        // this.setState({current_tab: _tab.key, tab_progress: tab_progress})
                                                                    }
                                                                }}
                                                            >
                                                                <div className='fp-item-row'>
                                                                    <div className='fp-item-circle'>
                                                                        {this.state.tab_progress.indexOf(_tab.key) > -1
                                                                            ?
                                                                                <div style={{width:14, height:14, backgroundColor:'#1dd153', borderRadius:100}}></div>
                                                                            :
                                                                                this.state.current_tab === _tab.key
                                                                                    ?
                                                                                        <div style={{width:10, height:10, backgroundColor:'rgba(42, 129, 225, 1)', borderRadius:100}}></div>
                                                                                    :
                                                                                        null
                                                                        }
                                                                    </div>

                                                                    <label>{_tab.label}</label>
                                                                </div>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 10 }}>

                                                {this.state.current_tab === 'shipment-summary' &&

                                                    <WdForm
                                                        hide_header={true}

                                                        submit_url='app/shipment/save/shipment_summary'
                                                        data_url='app/shipment/load/shipment_summary'

                                                        back_url='load-search'

                                                        row_id={this.state.row_id !== false ? this.state.row_id : false}
                                                        id="row_id"
                                                        title_field="shipment_number"
                                                        updated_on="updated_on_formatted"

                                                        post_fields={[
                                                            {key: 'updates_items', value: JSON.stringify(this.state.updates_list)}
                                                        ]}

                                                        onDataLoad={(row_data, result) => {

                                                            this.setState({updates_list: row_data.updates, shipment: row_data})
                                                        }}

                                                        onSubmit={(result) => {

                                                            if(result.hasOwnProperty('shipments_count')){

                                                                this.setState({shipments_count: false})
                                                            }else{

                                                                localStorage.setItem('flash_success_message', result.message)
                                                                this.setState({redirect: `/edit/track-shipment/trip-sheet/${result.row_id}`})
                                                            }
                                                        }}

                                                        externalValidate={() => {

                                                            let has_error = false;

                                                            let updates_list = this.state.updates_list;

                                                            if(updates_list.length > 0){

                                                                updates_list.forEach((_list_item, index) => {

                                                                    if(_list_item.send_updates_to === '' || _list_item.update_type === ''){

                                                                        updates_list[index]['error'] = true;
                                                                        has_error = true;
                                                                    }
                                                                })

                                                                this.setState({updates_list: updates_list})
                                                            }
                                                    
                                                            if(has_error){
                                                                return {
                                                                    status: false,
                                                                    message: ['There is error in Shipment Summary section. Please check and resolve.']
                                                                }
                                                            }else{
                                                        
                                                                return {status: true}
                                                            }
                                                        }}

                                                        fields={{
                                                            rows: [
                                                                {
                                                                    fields: [
                                                                        {key: 'shipment-summary_header', type: 'html', span: 12, html: (
                                                                            <div className='fp-form-header'>
                                                                                <span>Step 1</span>
                                                                                <h3>Shipment Summary</h3>
                                                                                <p>To track a shipment, please fill in the form below and click 'Save'</p>
                                                                            </div>
                                                                        )}
                                                                    ]
                                                                },
                                                                {
                                                                    fields: [
                                                                        {key: 'shippment_carrier', name: 'shippment_carrier', label: 'Shippment Carrier', type: 'dropdown', validations: ['r'], options: this.state.shipment_carriers, span: 8}
                                                                    ]
                                                                },
                                                                {
                                                                    fields: [
                                                                        {key: 'tracking_method', name: 'tracking_method', label: 'Tracking Method', type: 'dropdown', validations: ['r'], options: this.state.tracking_methods, span: 4},
                                                                        {key: 'tracking_cc', name: 'tracking_cc', label: 'Tracking Country Code', type: 'dropdown', validations: ['r'], options: this.state.country_codes, span: 4, option_renderer: (field) => {

                                                                            return (
                                                                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                                                                                    <img src={field.flag} />
                                                                                    <strong className='ml-5'>{field.value}</strong>
                                                                                </div>
                                                                            )
                                                                        }},
                                                                        {key: 'tracking_full_number', type: 'input', name: 'tracking_full_number', label: 'Tracking Full Number', validations: ['r', 'num'], span: 4}
                                                                    ]
                                                                },
                                                                {
                                                                    fields: [
                                                                        {key: 'tracking_start_at_date', type: 'date', name: 'tracking_start_at_date', label: 'Start Tracking At', validations: ['r'], span: 2},
                                                                        {key: 'tracking_start_at_time', type: 'time', name: 'tracking_start_at_time', label: '', validations: ['r'], span: 2},
                                                                        {key: 'tracking_timezone', name: 'tracking_timezone', label: '', placeholder: 'Select Timezone', type: 'dropdown', validations: ['r'], options: this.state.timezones, span: 6, option_renderer: (field) => {

                                                                            return (
                                                                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                                                                                    <span className='ml-5'>{field.text}</span>
                                                                                </div>
                                                                            )
                                                                        }},
                                                                    ],
                                                                },
                                                                {
                                                                    fields: [
                                                                        {key: 'send_updates_to_html', span: 12, type: 'html', html: (
                                                                            
                                                                            <Grid container spacing={3} rowSpacing={1}>

                                                                                {this.state.updates_list.map((_update_list, index) => {

                                                                                    return (

                                                                                        <React.Fragment key={`row_${index}`}>
                                                                                            <Grid size={{ xs: 12, sm: 12, md: 4 }} style={{position: 'relative'}}>

                                                                                                {index > 0 &&
                                                                                                
                                                                                                    <div style={{position: 'absolute', left: -30}}>
                                                                                                        <Btn icon={true} confirm confirm_message="Do you really want to remove this row?" onClick={() => {

                                                                                                            let updates_list = this.state.updates_list; 

                                                                                                            updates_list.splice(index, 1);

                                                                                                            this.setState({updates_list: updates_list})
                                                                                                        }}>
                                                                                                            <Close style={{fontSize: 16}} className='c-red' />
                                                                                                        </Btn>
                                                                                                    </div>
                                                                                                }

                                                                                                <FormControl fullWidth className='wd-form-select' error={_update_list.error}>

                                                                                                    {index === 0 &&
                                                                                                    
                                                                                                        <InputLabel>Send Updates To</InputLabel>
                                                                                                    }

                                                                                                    <Select
                                                                                                        value={_update_list.send_updates_to}
                                                                                                        label={`Send Updates To`}
                                                                                                        variant="outlined"
                                                                                                        size="small"
                                                                                                        fullWidth
                                                                                                        displayEmpty
                                                                                                        placeholder="Send Updates To"
                                                                                                        onChange={(e) => {

                                                                                                            let updates_list = this.state.updates_list;

                                                                                                            updates_list[index]['send_updates_to'] = e.target.value;

                                                                                                            this.setState({updates_list: updates_list})
                                                                                                        }}
                                                                                                    >
                                                                                                        <MenuItem value="">
                                                                                                            Select Send Updates To
                                                                                                        </MenuItem>

                                                                                                        {this.state.shipment_carriers.map((_shipment_carrier, _index) => {

                                                                                                            return (
                                                                                                                <MenuItem value={_shipment_carrier.key} key={`_shipment_carrier_${_index}_${index}`}>
                                                                                                                    {_shipment_carrier.value}
                                                                                                                </MenuItem>
                                                                                                            )
                                                                                                        })}
                                                                                                    </Select>

                                                                                                    {_update_list.error &&
                                                            
                                                                                                        <FormHelperText sx={{marginLeft: 0}}>All fields are required.</FormHelperText>
                                                                                                    }
                                                                                                </FormControl>
                                                                                            </Grid>
                                                                                            <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                                                                                                <TextField
                                                                                                    lable=""
                                                                                                    placeholder='Load #'
                                                                                                    variant="outlined"
                                                                                                    fullWidth
                                                                                                    size="small"
                                                                                                    value={_update_list.update_type}
                                                                                                    onChange={(e) => {

                                                                                                        let updates_list = this.state.updates_list;

                                                                                                        updates_list[index]['update_type'] = e.target.value;

                                                                                                        this.setState({updates_list: updates_list})
                                                                                                    }}
                                                                                                    error={_update_list.error}
                                                                                                />
                                                                                            </Grid>
                                                                                            <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                                                                                                <FormControl fullWidth className='wd-form-select'>
                                                                                                    <Select
                                                                                                        value={_update_list.track_days}
                                                                                                        label={`track_days`}
                                                                                                        variant="outlined"
                                                                                                        size="small"
                                                                                                        fullWidth
                                                                                                        displayEmpty
                                                                                                        placeholder="Track"
                                                                                                        onChange={(e) => {

                                                                                                            let updates_list = this.state.updates_list;

                                                                                                            updates_list[index]['track_days'] = e.target.value;

                                                                                                            this.setState({updates_list: updates_list})
                                                                                                        }}
                                                                                                    >
                                                                                                        {this.state.track_days.map((track_day, _index) => {

                                                                                                            return (
                                                                                                                <MenuItem value={track_day.key} key={`track_day_${_index}_${index}`}>
                                                                                                                    {track_day.value}
                                                                                                                </MenuItem>
                                                                                                            )
                                                                                                        })}
                                                                                                    </Select>
                                                                                                </FormControl>
                                                                                            </Grid>
                                                                                            <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                                                                                                <FormControl fullWidth className='wd-form-select'>
                                                                                                    <Select
                                                                                                        value={_update_list.track_time}
                                                                                                        label={`track_time`}
                                                                                                        variant="outlined"
                                                                                                        size="small"
                                                                                                        fullWidth
                                                                                                        displayEmpty
                                                                                                        placeholder="Track"
                                                                                                        onChange={(e) => {

                                                                                                            let updates_list = this.state.updates_list;

                                                                                                            updates_list[index]['track_time'] = e.target.value;

                                                                                                            this.setState({updates_list: updates_list})
                                                                                                        }}
                                                                                                    >
                                                                                                        {this.state.track_time.map((_track_time, _index) => {

                                                                                                            return (
                                                                                                                <MenuItem value={_track_time.key} key={`_track_time_${_index}_${index}`}>
                                                                                                                    {_track_time.value}
                                                                                                                </MenuItem>
                                                                                                            )
                                                                                                        })}
                                                                                                    </Select>
                                                                                                </FormControl>
                                                                                            </Grid>
                                                                                        </React.Fragment>
                                                                                    )
                                                                                })}

                                                                                <Grid size={12}>
                                                                                    <div className='justify-end'>
                                                                                        <Btn endIcon={<Add />} size="small" color="primary" onClick={() => {

                                                                                            let updates_list = this.state.updates_list;

                                                                                            updates_list.push({send_updates_to: '', update_type: '', track_days: '1', track_time: '15'})

                                                                                            this.setState({updates_list: updates_list})
                                                                                        }}>
                                                                                            Add Update
                                                                                        </Btn>
                                                                                    </div>
                                                                                </Grid>
                                                                            </Grid>
                                                                        )}
                                                                    ]
                                                                },
                                                                {
                                                                    fields: [
                                                                        {key: 'email_updates_to', type: 'textarea', name: 'email_updates_to', label: 'Email Updates To', placeholder: 'Enter comma seperated emails', validations: ['r'], span: 8},
                                                                        {key: 'notes', type: 'textarea', name: 'notes', label: 'Notes', validations: ['r'], span: 8, placeholder: 'Miscellaneous Notes For Shipment'}
                                                                    ],
                                                                },
                                                            ]
                                                        }}
                                                    />
                                                }

                                                {(this.state.current_tab === 'trip-sheet' && this.state.row_id !== '') &&

                                                    <div style={{backgroundColor: 'rgba(42, 129, 225, .1)'}}>
                                                        <Grid container spacing={2}>

                                                            <Grid size={{ xs: 12, md: 8 }} sx={{padding: '30px 30px', position: 'relative', minHeight: 700}}>
                                                                <div className='fp-form-header'>
                                                                    <span>Step 2</span>
                                                                    <h3>Trip Sheet Stops</h3>
                                                                    <p>{`Drag the stop's to reposition`}</p>
                                                                </div>

                                                                <SortableList
                                                                    onSortEnd={(old_index, new_index) => {

                                                                        const _trip_stops = [...this.state.trip_stops];
                                                                        const [movedItem] = _trip_stops.splice(old_index, 1);
                                                                        _trip_stops.splice(new_index, 0, movedItem);
                                
                                                                        this.setState({trip_stops: _trip_stops}, () => {

                                                                            let _sorted_trips = {};

                                                                            this.state.trip_stops.map((_trip_stop, index) => {

                                                                                _sorted_trips[_trip_stop.row_id] = index + 1;
                                                                            })

                                                                            this.sortTripStops(_sorted_trips);
                                                                        })
                                                                    }}
                                                                    className="list mt-10"
                                                                    draggedItemClassName="dragged"
                                                                >
                                                                    {this.state.trip_stops.map((item) => (

                                                                        <SortableItem key={item.row_id}>

                                                                            <ListItem
                                                                                className={`list-item has-hoverable-action ${(this.state.trip_stop_to_edit !== false && this.state.trip_stop_to_edit.row_id === item.row_id) ? 'highlighted' : ''}`}
                                                                                secondaryAction={
                                                                                    <div className='hoverable-action'>
                                                                                        <Btn icon={true} confirm={true} confirm_message="Do you really want to remove this entry?" onClick={() => {

                                                                                            this.setState({trip_stop_to_edit: false})
                                                                                            this.removeStop(item.row_id);
                                                                                        }}>
                                                                                            <Delete style={{fontSize: 16}} className='c-red' />
                                                                                        </Btn>
                                                                                        <Btn icon={true} className="ml-5" onClick={() => {

                                                                                            this.setState({trip_stop_to_edit: item}, () => {

                                                                                                this.setState({trip_sheet_form: true})
                                                                                            })
                                                                                        }}>
                                                                                            <Edit style={{fontSize: 16}} className='c-blue' />
                                                                                        </Btn>
                                                                                    </div>
                                                                                }
                                                                            >
                                                                                <ListItemAvatar sx={{minWidth: '30px'}}>
                                                                                    <DragIndicator />
                                                                                </ListItemAvatar>
                                                                                <ListItemText primary={item.stop_type_label} secondary={item.stop_name} />
                                                                            </ListItem>
                                                                        </SortableItem>
                                                                    ))}
                                                                </SortableList>

                                                                <div className='align-center mt-10'>
                                                                    <Btn size="small" color="secondary" variant="contained" endIcon={<Add />} onClick={() => {

                                                                        this.setState({trip_sheet_form: true})
                                                                    }}>
                                                                        Add New Stop
                                                                    </Btn>
                                                                </div>

                                                                <Loader loading={this.state.updating_trip_sheet} />
                                                            </Grid>
                                                            <Grid size={{ xs: 12, md: 3 }}>

                                                                {/* {this.state.trip_stop_to_edit === false
                                                                    ?
                                                                        <div className='mt-20 pt-20'>
                                                                            <div className='pt-20'>
                                                                                <NoData icon={<Article />}>
                                                                                    <p className='fs-14 gr-4'>Edit a stop from the list.</p>
                                                                                </NoData>
                                                                            </div>
                                                                        </div>
                                                                    : */}

                                                                        <WdForm
                                                                            title="Trip Stop"

                                                                            drawer={true}
                                                                            open={this.state.trip_sheet_form}
                                                                            position="right"
                                                                            size="medium"

                                                                            submit_url='app/shipment/save/shipment_trip_stop'
                                                                            data_url='app/shipment/load/shipment_trip_stop'

                                                                            row_id={this.state.trip_stop_to_edit !== false ? this.state.trip_stop_to_edit.row_id : false}
                                                                            id="row_id"
                                                                            title_field="stop_type_label"
                                                                            updated_on="updated_on_formatted"

                                                                            onBack={() => {

                                                                                this.setState({trip_sheet_form: false, trip_stop_to_edit: false, updating_trip_sheet: false})
                                                                            }}

                                                                            onDataLoad={(row_data, result) => {

                                                                                let address_string = this.state.address_string;

                                                                                if(row_data.hasOwnProperty('address')){

                                                                                    address_string.address = row_data.address;
                                                                                    address_string.address_2 = row_data.address_2
                                                                                    address_string.city = row_data.city
                                                                                    address_string.state = row_data.state
                                                                                    address_string.zipcode = row_data.zipcode
                                                                                    address_string.country = row_data.country
                                                                                }
                                                                                
                                                                                this.setState({address_string: address_string}, () => {

                                                                                    this.addressToCoordinates()
                                                                                })
                                                                            }}

                                                                            onSubmit={() => {

                                                                                this.setState({trip_sheet_form: false})
                                                                                this.shipment_trip_stop_list(this.state.account_token)
                                                                            }}
                                                        
                                                                            post_fields={[
                                                                                {key: 'shipment_id', value: this.state.row_id},
                                                                                {key: 'coordinates', value: JSON.stringify(this.state.location_coordicates)}
                                                                            ]}

                                                                            fields={{
                                                                                rows: [
                                                                                    // {
                                                                                    //     fields: [
                                                                                    //         {key: 'shipment-summary_header', type: 'html', span: 12, html: (
                                                                                    //             <div className='fp-form-header'>
                                                                                    //                 <span>{this.state.trip_stop_to_edit.stop_type_label}</span>
                                                                                    //                 <h3>{this.state.trip_stop_to_edit.stop_name}</h3>
                                                                                    //             </div>
                                                                                    //         )}
                                                                                    //     ]
                                                                                    // },
                                                                                    {
                                                                                        fields: [
                                                                                            {key: 'stop_type', name: 'stop_type', label: 'Stop Type', type: 'dropdown', validations: ['r'], options: this.state.stop_types, span: 8}
                                                                                        ]
                                                                                    },
                                                                                    {
                                                                                        fields: [
                                                                                            {key: 'stop_name', type: 'input', name: 'stop_name', label: 'Stop Name', validations: ['r'], span: 8}
                                                                                        ]
                                                                                    },
                                                                                    {
                                                                                        fields: [
                                                                                            {key: 'address', type: 'input', name: 'address', label: 'Address', validations: ['r'], span: 8, onChange: (value) => {

                                                                                                let address_string = this.state.address_string;

                                                                                                address_string.address = value

                                                                                                this.setState({address_string: address_string})
                                                                                            }},
                                                                                            {key: 'address_2', type: 'input', name: 'address_2', label: 'Address 2', validations: [], span: 8, onChange: (value) => {

                                                                                                let address_string = this.state.address_string;

                                                                                                address_string.address_2 = value

                                                                                                this.setState({address_string: address_string})
                                                                                            }}
                                                                                        ]
                                                                                    },
                                                                                    {
                                                                                        fields: [
                                                                                            {key: 'city', type: 'input', name: 'city', label: 'City', validations: ['r'], span: 4, onChange: (value) => {

                                                                                                let address_string = this.state.address_string;

                                                                                                address_string.city = value

                                                                                                this.setState({address_string: address_string})
                                                                                            }},
                                                                                            {key: 'state', type: 'input', name: 'state', label: 'State', validations: ['r'], span: 4, onChange: (value) => {

                                                                                                let address_string = this.state.address_string;

                                                                                                address_string.state = value

                                                                                                this.setState({address_string: address_string})
                                                                                            }},
                                                                                            {key: 'zipcode', type: 'input', name: 'zipcode', label: 'Zipcode', validations: ['r'], span: 4, onChange: (value) => {

                                                                                                let address_string = this.state.address_string;

                                                                                                address_string.zipcode = value

                                                                                                this.setState({address_string: address_string})
                                                                                            }}
                                                                                        ]
                                                                                    },
                                                                                    {
                                                                                        fields: [
                                                                                            {key: 'country', name: 'country', label: 'Country', placeholder: 'Select Country', type: 'dropdown', validations: ['r'], options: this.state.countries, span: 8, onChange: (value) => {

                                                                                                let address_string = this.state.address_string;

                                                                                                address_string.country = value

                                                                                                this.setState({address_string: address_string}, () => {

                                                                                                    this.addressToCoordinates()
                                                                                                })
                                                                                            }},
                                                                                        ],
                                                                                    },
                                                                                    {
                                                                                        fields: [
                                                                                            {key: 'address_pin_html', span: 12, type: 'html', html: (

                                                                                                <div>

                                                                                                    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
                                                                                                    
                                                                                                        {Object.keys(this.state.location_coordicates).length > 0 &&

                                                                                                            <div>
                                                                                                                <GoogleMap
                                                                                                                    zoom={15}
                                                                                                                    center={this.state.location_coordicates}
                                                                                                                    mapContainerStyle={{width:'100%', height:'300px'}}
                                                                                                                    onClick={(e) => {

                                                                                                                        let location_coordicates = {
                                                                                                                            lat: e.latLng.lat(),
                                                                                                                            lng: e.latLng.lng()
                                                                                                                        }

                                                                                                                        this.setState({location_coordicates: location_coordicates})
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <Marker
                                                                                                                        position={this.state.location_coordicates}
                                                                                                                        draggable={true}
                                                                                                                        onDragEnd={(e) => {
                                                                                                                            
                                                                                                                            let location_coordicates = {
                                                                                                                                lat: e.latLng.lat(),
                                                                                                                                lng: e.latLng.lng()
                                                                                                                            }

                                                                                                                            this.setState({location_coordicates: location_coordicates})
                                                                                                                        }} />
                                                                                                                </GoogleMap>

                                                                                                                <span className='fs-12 fw-b'>Drag the marker to get the correct address.</span>
                                                                                                            </div>
                                                                                                        }
                                                                                                    </LoadScript>
                                                                                                </div>
                                                                                            )}
                                                                                        ]
                                                                                    },
                                                                                    {
                                                                                        fields: [
                                                                                            {key: 'stop_starting_at_date', type: 'date', name: 'stop_starting_at_date', label: 'Stop Starting At', validations: ['r'], span: 4},
                                                                                            {key: 'stop_starting_at_time', type: 'time', name: 'stop_starting_at_time', label: '', validations: ['r'], span: 4},
                                                                                            {key: 'stop_starting_timezone', name: 'stop_starting_timezone', label: '', placeholder: 'Select Timezone', type: 'dropdown', validations: ['r'], options: this.state.timezones, span: 4, option_renderer: (field) => {

                                                                                                return (
                                                                                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                                                                                                        <span className='ml-5'>{field.text}</span>
                                                                                                    </div>
                                                                                                )
                                                                                            }},
                                                                                        ],
                                                                                    },
                                                                                    {
                                                                                        fields: [
                                                                                            {key: 'stop_ending_at_date', type: 'date', name: 'stop_ending_at_date', label: 'Stop Ending At', validations: ['r'], span: 4},
                                                                                            {key: 'stop_ending_at_time', type: 'time', name: 'stop_ending_at_time', label: '', validations: ['r'], span: 4},
                                                                                            {key: 'stop_ending_timezone', name: 'stop_ending_timezone', label: '', placeholder: 'Select Timezone', type: 'dropdown', validations: ['r'], options: this.state.timezones, span: 4, option_renderer: (field) => {

                                                                                                return (
                                                                                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                                                                                                        <span className='ml-5'>{field.text}</span>
                                                                                                    </div>
                                                                                                )
                                                                                            }},
                                                                                        ],
                                                                                    },
                                                                                    {
                                                                                        fields: [
                                                                                            {key: 'notes', type: 'textarea', name: 'notes', label: 'Notes', validations: [], span: 12, placeholder: 'Miscellaneous Notes For Shipment'}
                                                                                        ],
                                                                                    },
                                                                                ]
                                                                            }}
                                                                        />
                                                                {/* } */}
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                }
                                            </Grid>
                                        </>
                                    :
                                        <Grid size={12}>
                                            <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                                                <img src={cargo} style={{width:400}} />

                                                <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                                                    <h2 className='mb-0 c-blue'>No Subscription</h2>
                                                    <h3 className='mt-0 c-red'>You dont have any plan subscribed yet!</h3>
                                                    <p>Please subscribe to a subscription plan.</p>

                                                    <Btn endIcon={<ChevronRight />} color="secondary" variant="outlined" to="/subscriptions">
                                                        Subscribe Now
                                                    </Btn>
                                                </Box>
                                            </Box>
                                        </Grid>
                                }
                            </>
                    }
                    
                </Grid>

                <Dialog
                    open={this.state.map_popup}
                    onClose={() => {

                        this.setState({map_popup: false})
                    }}
                >
                    <DialogTitle>Subscribe</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To subscribe to this website, please enter your email address here. We
                            will send updates occasionally.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Btn>Cancel</Btn>
                        <Btn type="submit" form="subscription-form">
                            Subscribe
                        </Btn>
                    </DialogActions>
                </Dialog>

                {/* <WdForm
                    title="Stop"

                    drawer={true}
                    open={this.state.trip_sheet_form}
                    position="bottom"
                    size="small"

                    onBack={() => {

                        this.setState({trip_sheet_form: false})
                    }}

                    onSubmit={() => {

                        this.setState({trip_sheet_form: false})
                        this.shipment_trip_stop_list(this.state.account_token)
                    }}

                    submit_url='app/shipment/save/shipment_trip_stop'
                    data_url='customers/data'

                    post_fields={[
                        {key: 'shipment_id', value: this.state.row_id}
                    ]}

                    row_id={false}
                    id="row_id"
                    title_field="shipment_number"
                    updated_on="updated_on_formatted"

                    fields={{
                        rows: [
                            {
                                fields: [
                                    {key: 'stop_type', name: 'stop_type', label: 'Stop Type', type: 'dropdown', validations: ['r'], options: this.state.stop_types, span: 12}
                                ]
                            },
                            {
                                fields: [
                                    {key: 'stop_name', name: 'stop_name', label: 'Stop Name', type: 'input', validations: ['r'], span: 12}
                                ]
                            }
                        ]
                    }}
                /> */}
            </Main>
            
        )
    }

    init = (account_token) => {

        const formData = new FormData();
        formData.append('account_token', account_token);

        let self = this;

        this.setState({initing: true})

        Api.post('app/shipment/add/init', formData, function(data){

            if(data.status){

                self.setState({
                    shipment_carriers: data.shipment_carriers,
                    tracking_methods: data.tracking_methods,
                    country_codes: data.country_codes,
                    timezones: data.timezones,
                    track_days: data.track_days,
                    track_time: data.track_time,
                    stop_types: data.stop_types,
                    countries: data.countries,
                    shipments_count: data.shipments_count
                });
            }
            
            self.setState({initing: false})
        });
    }

    shipment_trip_stop_list = (account_token) => {

        const formData = new FormData();
        formData.append('account_token', account_token);

        formData.append('per_page', 20);
        formData.append('page', 0);
        formData.append('sort_by', 'sort_order');
        formData.append('sort_dir', 'asc');

        let filters = {}
        filters['shipment_id'] = this.state.row_id;

        formData.append('filters', JSON.stringify(filters))

        this.setState({updating_trip_sheet: true})

        var self = this;
        Api.post('app/shipment/list/shipment_trip_stop', formData, function(data){

            self.setState({trip_stops: data.records, updating_trip_sheet: false})
        });
    }

    sortTripStops = (sort_order) => {

        const formData = new FormData();
        formData.append('account_token', this.state.account_token);

        formData.append('sort_order', JSON.stringify(sort_order));

        this.setState({updating_trip_sheet: true})

        var self = this;
        Api.post('app/shipment/trip_stops/update_sort_order', formData, function(data){

            self.shipment_trip_stop_list(self.state.account_token)
        });
    }

    removeStop = (stop) => {

        const formData = new FormData();
        formData.append('account_token', this.state.account_token);

        formData.append('row_id', stop);

        this.setState({updating_trip_sheet: true})

        var self = this;
        Api.post('app/shipment/remove/shipment_trip_stop', formData, function(data){

            self.shipment_trip_stop_list(self.state.account_token)
        });
    }

    addressToCoordinates = () => {

        let address = this.state.address_string;

        const formData = new FormData();
        formData.append('account_token', this.state.account_token);

        formData.append('address', `${address.address}, ${address.address_2}, ${address.city} - ${address.zipcode}, ${address.state}, ${address.country}`);

        this.setState({updating_trip_sheet: true})

        var self = this;
        Api.post('app/shipment/address/convert', formData, function(data){

            if(data.status){
            
                self.setState({location_coordicates: data.coords})
            }
        });
    }
}

export default withRouter(TrackShipmentForm)





