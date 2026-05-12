import React, { Component } from 'react';
import { Navigate } from "react-router-dom";

import DataTable from 'components/wd/data_table/DataTable';

import Main from 'components/Main';

import Btn from 'components/Btn';

import Api from 'api/Api';

import Edit from '@mui/icons-material/Edit';

class ControlTowerList extends Component {

    constructor(props) {
        super();
        this.state = {

            account_token: false,
            user: false,

            redirect: false,

            logged_in: false,

            error_message: '',
            success_message: '',

            shipment_carriers: [],
            tracking_methods: [],
            country_codes: [],
            timezones: [],
        }
    }

    componentDidMount = () => {
        
        var account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        
        if(account_token){
            
            this.setState({account_token: account_token})
            this.init(account_token)
        }
    }

    componentWillUnmount = () => {
    
        if(this.timer) clearInterval(this.timer);
    }

    render(){

        if(this.state.redirect !== false){

            return <Navigate to={this.state.redirect} />
        }

        return (

            <Main
                active_page="control_tower"
                title="Action Centre"
                page="control_tower_list"
                
                error_message={this.state.error_message}
                success_message={this.state.success_message}
            >
                
                <>

                    {/*<LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
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
                    </LoadScript>*/}

                    <DataTable
                        index="track_shipment"
                        label="Track Shipment"

                        active_row={this.state.active_row}

                        columns={[
                            {name: 'Shipment Number', column: 'shipment_number', sortable: true},
                            {name: 'Carrier', column: 'shippment_carrier', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: this.state.shipment_carriers},
                            {name: 'Method', column: 'tracking_method', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: this.state.tracking_methods},
                            {name: 'Country Code', column: 'tracking_cc', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: this.state.country_codes},
                            {name: 'Tracking Start At', column: 'tracking_start_at', sortable: true},
                            {name: 'Timezone', column: 'tracking_timezone', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: this.state.timezones},
                            // {name: 'Status', column: 'status', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: [{key: '0', value: 'Disabled'}, {key: '1', value: 'Enabled'}]},
                        ]}

                        row_actions={(row, row_index) => {

                            return (

                                <div className="hoverable-action">
                                    <div className="align-start">

                                        <Btn to={`/shipment/${row.row_id}`} size="small" color="primary" startIcon={<Edit style={{fontSize: 15}} />}>
                                            View
                                        </Btn>
                                    </div>
                                </div>
                            )
                        }}

                        default_sort_by="added_on"

                        api_url="app/shipment/control_tower"

                        account_token={this.state.account_token}
                        
                        row_id="row_id"
                    />
                </>
            </Main>
        )
    }

    init = (account_token) => {

        const formData = new FormData();
        formData.append('account_token', account_token);

        var self = this;
        Api.post('app/shipment/listing/init', formData, function(data){

            if(data.status){

                self.setState({
                    shipment_carriers: data.shipment_carriers,
                    tracking_methods: data.tracking_methods,
                    country_codes: data.country_codes,
                    timezones: data.timezones
                });
            }
        });
    }
}

export default ControlTowerList;