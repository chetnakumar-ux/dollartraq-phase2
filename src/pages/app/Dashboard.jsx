import React, { Component } from 'react';

import { Link, Navigate } from "react-router-dom";

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import Main from 'components/Main';

import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

import Btn from 'components/Btn';

import { format } from 'date-fns'

import LocalShipping from '@mui/icons-material/LocalShipping';
import ChevronRight from '@mui/icons-material/ChevronRight';
import EventRepeat from '@mui/icons-material/EventRepeat';

import Api from 'api/Api';

class Dashboard extends Component {

    constructor(props) {
        super();
        this.state = {

            account_token: false,
            user: false,

            initing: true,

            user_subscribed_plan: false,

            auctions_loading: false,

            logged_in: false,

            error_message: '',
            success_message: '',
        }
    }

    componentDidMount = () => {
        
        var account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        var user = localStorage.getItem(import.meta.env.VITE_ACCOUNT_USER);

        if(account_token){
            
            this.setState({logged_in: true, account_token: account_token}, () => {

                this.init(account_token)
            })
        }

        if(user){

            var _user = JSON.parse(user);

            this.setState({user: _user});
        }
    }

    render(){

        return (

            <Main
                page="dashboard"
                active_page="dashboard"
                error_message={this.state.error_message}
                success_message={this.state.success_message}
                title=""
            >
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>

                        <div className="dashboard-welcome">
                            <div className="dashboard-date-block">
                                <div className="dashboard-date">
                                    <span>{format(new Date(), "d")}</span>
                                </div>
                                <div className="dashboard-month">
                                    <span>{format(new Date(), "eeee")}</span>
                                    <strong>{format(new Date(), "MMMM, Y")}</strong>
                                </div>
                            </div>
                            <strong>Welcome To</strong>
                            <h1>Dashboard</h1>
                        </div>

                        {/* <h2>{this.state.user.name}</h2> */}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <div className='card mt-20'>
                            <div className='header'>
                                <strong className='heading c-primary'>Total Overview</strong>
                                <span>Your activity summary for the past week</span>
                            </div>
                            <div className='body'>
                                <div className='justify-start mt-20'>
                                    <div>
                                       <strong className='gr-5'>
                                            <Box component="span" sx={{ fontSize: { xs: 40, sm: 50, md: 70 } }}>
                                                {this.state.user.consumed_loads}
                                            </Box>
                                        </strong>
                                    </div>
                                    <div className='flex-col ml-20'>
                                        <strong className='fs-24 gr-7'>{`Shipment's`}</strong>
                                        <span className='gr-9'>Generated</span>
                                    </div>
                                </div>

                                <div className='card-bg'>
                                    <LocalShipping sx={{ fontSize: { xs: 120, sm: 150, md: 200 } }} className='gr-05'  />
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        {this.state.user === false
                            ?
                                <Stack sx={{width:'100%'}}>
                                    <Skeleton width="70%" height={50} variant='rounded' animation="wave" />
                                    <Skeleton width="100%" height={100} variant='rounded' style={{marginTop:10}} animation="wave" />
                                </Stack>
                            :
                                <Box className="card mt-20" sx={{backgroundColor:'rgba(43, 130, 173, 0.1)'}}>

                                    <Box className="body">

                                        {this.state.user.active_plan !== ''
                                            ?
                                                <Box className="body">
                                                    <strong className='fs-13'>CURRENT PLAN</strong>
                                                    <Box>
                                                        <Box>
                                                            <h2 className='mb-0 mt-10 c-green'>{this.state.user_subscribed_plan.title}</h2>
                                                            <h3 className='mt-0 gr-7'>{this.state.user_subscribed_plan.sub_title}</h3>
                                                        </Box>
                                                        <Box>
                                                            {this.priceFormat(this.state.user_subscribed_plan)}
                                                        </Box>
                                                    </Box>

                                                    <Box className="justify-end">
                                                        {this.state.user_subscribed_plan.is_demo == '1' &&
                                                        
                                                            <Btn size="small" endIcon={<ChevronRight />} to="/subscriptions">Upgrade Plan</Btn>
                                                        }
                                                    </Box>
                                                </Box>
                                            :
                                                <Box>
                                                    <h2 className='mb-0 c-red'>No Subscription</h2>
                                                    <h3 className='mt-0 c-red'>You dont have any plan subscribed yet!</h3>
                                                    <Btn size="small" variant="contained" rounded="full" color="secondary" to="/subscriptions" endIcon={<ChevronRight />}>
                                                        Subscribe Now
                                                    </Btn>
                                                </Box>
                                        }
                                    </Box>
                                    <div className='card-bg'>
                                        <EventRepeat style={{fontSize: 150}} className='gr-05' />
                                    </div>
                                </Box>
                        }
                    </Grid>
                </Grid>
                <Grid container sx={{borderTop: '1px solid rgba(0,0,0,.2)', marginTop: 5}}>

                </Grid>
            </Main>
        )
    }

    init = (account_token) => {
    
        const formData = new FormData();
        formData.append('account_token', account_token);
        formData.append('page', 'dashboard');

        this.setState({initing: true})

        var self = this;
        
        Api.post('app/customer/load', formData, function(data){

            self.setState({initing: false})

            if(data.status){

                self.setState({
                    user: data.customer
                });

                if(data.customer.hasOwnProperty('plan')){

                    self.setState({user_subscribed_plan: data.customer.plan})
                }

                localStorage.setItem(import.meta.env.VITE_ACCOUNT_USER, JSON.stringify(data.customer));
            }
        });
    }

    priceFormat = (subscription) => {

        return (
            <Box className="justify-start">
                
                {subscription.is_demo == '1'
                    ?
                        <strong className='c-green'>Start Free <span className='gr-4'>(No Cost)</span></strong>
                    :
                        <div>
                            {subscription.special_price > 0
                                ?
                                    <Box className="justify-center">
                                        <span>$ <span className='fs-20' style={{textDecoration:'line-through'}}>{subscription.price}</span></span>
                                        <span className='ml-5'> <strong className='fs-20'>{subscription.special_price}</strong></span>
                                    </Box>
                                :
                                    <Box className="justify-center">
                                        <span>$ <strong className='fs-20'>{subscription.price}</strong></span>
                                    </Box>
                            }
                        </div>
                }

                <Box className="justify-start ml-10">
                    <strong className='gr-5'>Loads Limit:</strong>
                    <strong className='ml-5'>{subscription.loads_limit}</strong>
                </Box>
            </Box>
        )
    }
}

export default Dashboard;