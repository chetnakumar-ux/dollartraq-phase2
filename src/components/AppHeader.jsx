import React, { Component } from 'react';
import { Link, Navigate } from "react-router-dom";

import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Box } from '@mui/material';
import Alert from '@mui/material/Alert';

import Btn from './Btn';
// import renderHTML from 'react-render-html';

import { connect } from 'react-redux';
import { User } from 'actions/user';

import Api from 'api/Api';
import Loader from './Loader';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PowerSettingsNew from '@mui/icons-material/PowerSettingsNew';
import PanTool from '@mui/icons-material/PanTool';

import Time from './Time';

class AppHeader extends Component { 
    constructor(props) {
        super();
        this.state = {

            account_token: false,
            
            redirect: false,
            header: false,

            notifications_popup: false,

            notifications: [],
            notifications_count: 0,

            alert_sound: false,
            
            help_alert: false,
            help_message: '',

            order_alert: false,
            order_message: '',

            alert_requests: [],

            redirect_url: false,

            notification_page: 1,
            notification_reloading: false,

            entry_time: false,
            exit_time: false,
        }

        let interval = 0;
    }

    componentDidMount = () => {
        let account_token = localStorage.getItem(process.env.REACT_APP_ACCOUNT_TOKEN);
        let user = localStorage.getItem(process.env.REACT_APP_ACCOUNT_USER);
        
        if(user && account_token){
            
            let _user = JSON.parse(user);

            this.setState({account_token: account_token});
            this.setState({user: _user});
            this.props.User(_user);

            // this.realoadNotifications();

            if(_user.job_profile != 'super_admin'){

                if(this.props.page){

                    // if(this.props.page !== 'dashboard'){
                    
                    //     var access = _user.permissions;

                    //     let page = this.props.page;

                    //     page = page.replace(/_/i, "/");

                    //     if(access.indexOf(page) < 0){

                    //         localStorage.setItem('flash_error_message', 'Unauthorized Access!');
                    //         this.setState({redirect_url: 'dashboard'})
                    //     }
                    // }
                }
            }
        }else{

            if(this.props.active_link){
            
                if(this.props.active_link != '/' && this.props.active_link != 'forgot-password' && this.props.active_link != 'reset-password'){
                    
                    window.location.href = Api.server_url + 'logout';
                }
            }
        }
    }

    headerProfileImage = () => {

        if(this.props.user && this.props.user.profile_pic_url != ''){
                
            return <Avatar style={{width:25, height:25}} alt={this.props.user.name} src={this.props.user.profile_pic_url} />
        }else{
            
            return (
                <Avatar>
                    <AccountCircle />
                </Avatar>
            )
        }
    }
    
    renderChilds = (menu_item) => {

        var _childs = [];

        if(menu_item.hasOwnProperty('childs')){

            for(var c in menu_item['childs']){

                var _child_item = menu_item['childs'][c];

                _childs.push(<li key={_child_item.key}><Link to={"/" + _child_item.link}>{_child_item.title}</Link></li>)
            }

            return <ul className="sub-menu">{_childs}</ul>
        }
    }

    handleScroll = (e) => {

        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

        if(bottom){

            if(!this.state.notification_reloading){

                this.fetchNotifications(false);
            }
        }
    }

    render () {

        if(this.state.redirect_url && this.state.redirect_url != ''){

            return <Navigate to={this.state.redirect_url} />
        }

        return (

            <>

                {this.state.account_token
                    ?
                        <AppBar className="header-bar" position="static" color="inherit" style={{boxShadow:'none', backgroundColor: 'transparent', padding:0}}>
                            
                            <Toolbar className="header-wrapper" style={{  minHeight: 35,  padding: '2px 10px',  display: 'flex',  justifyContent: 'space-between',  alignItems: 'center' }}>

                                <div style={{ display: 'flex', alignItems: 'center' }}>

                                    <IconButton  color="inherit" aria-label="open drawer" edge="start" onClick={this.props.onMenuClick}  sx={{ mr: 1, display: { sm: 'none' } }}  >
                                        <MenuIcon />
                                    </IconButton>

                                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                        <Time />
                                    </Box>

                                </div>

                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {/* <IconButton id="notification_button" onClick={(e) => {
                                        this.setState({notifications_popup: e.currentTarget});
                                        this.fetchNotifications(true);
                                    }}>
                                        <Badge badgeContent={this.state.notifications_count} color="secondary">
                                            <Notifications />
                                        </Badge>
                                    </IconButton> */}
                                    <Btn
                                        className="ml-10"
                                        color="secondary"
                                        variant="text"
                                        size="small"
                                        to='/profile'
                                        style={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        {this.headerProfileImage()}
                                        <span className="ml-10 fw-semibold gr-6 capitalize">
                                            {this.props.user ? `${this.props.user.first_name} ${this.props.user.last_name}` : ''}
                                        </span>
                                    </Btn>
                                    <Link className="ml-20" to="/logout" style={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton
                                            edge="end"
                                            color="inherit"
                                            className="header-logout"
                                        >
                                            <PowerSettingsNew />
                                        </IconButton>
                                    </Link>
                                </div>
                            </Toolbar>

                            {/* <Sound
                                url={require('../../assets/alert_1.mp3')}
                                playStatus={this.state.alert_sound ? Sound.status.PLAYING : Sound.status.STOPPED}
                                playFromPosition={0}
                                onFinishedPlaying={() => {
                                    this.setState({alert_sound: false})
                                }}
                            /> */}

                            <Popover
                                className="notifications-menu-container"
                                anchorEl={this.state.notifications_popup}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                id="notifications_menu"
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={this.state.notifications_popup != false ? true : false}
                                onClose={() => {
                                    this.setState({notifications_popup: false})
                                }}
                            >
                                <div style={{width:300, height:400}}>
                                    <div className="notifications-menu" onScroll={this.handleScroll}>

                                        {/* {this.renderNotificationRows()} */}
                                    </div>

                                    <div style={{position:'relative', height:60}}>
                                        <Loader loading={this.state.notification_reloading} />
                                    </div>
                                </div>
                            </Popover>

                            <Menu
                                style={{width:200}}
                                anchorEl={this.state.header}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                id="header_menu"
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={this.state.header != false ? true : false}
                                onClose={() => {
                                    this.setState({header: false})
                                }}
                            >
                                <MenuItem style={{width:250, padding:0}}>
                                    <Link style={{display:'block', padding:15, width:'100%'}} to="/profile">Profile</Link>
                                </MenuItem>
                                <MenuItem style={{width:250, padding:0}}>
                                    <Link style={{display:'block', padding:15, width:'100%'}} to="/change-password">Change Password</Link>
                                </MenuItem>
                            </Menu>

                            <Snackbar
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={this.state.help_alert}
                                // onEntered={() => {
                                //     if(!this.state.alert_sound){
                                //         this.setState({alert_sound: true})
                                //     }
                                // }}
                                onClick={() => {
                                    this.setState({help_alert: false, alert_sound: false, help_message: ''});
                                }}
                                onClose={() => {
                                    this.setState({help_alert: false, alert_sound: false, help_message: ''})
                                }}
                                TransitionComponent={Slide}
                            >
                                <Alert elevation={6} variant="filled" severity="success">{this.state.help_message}</Alert>
                            </Snackbar>
                            {/* <Snackbar
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={this.state.order_alert}
                                onEntered={() => {
                                    if(!this.state.alert_sound){
                                        this.setState({alert_sound: true})
                                    }
                                }}
                                onClick={() => {
                                    this.setState({order_alert: false, alert_sound: false});
                                }}
                                onClose={() => {
                                    this.setState({order_alert: false, alert_sound: false})
                                }}
                                TransitionComponent={Slide}
                                message={this.state.order_message}
                            /> */}
                        </AppBar>
                    :
                        null
                }
            </>
        )
    }

    routeNotification = (_notification) => {

        // this.readNotification(_notification);

        var redirect_url = "/notification-route/" + _notification.route;
        this.setState({redirect_url: redirect_url});
    }

    renderNotificationRows = () => {

        var notifications = this.state.notifications;
        if(notifications && notifications.length > 0){

            return (
                <List>
                    
                    {notifications.map((_notification, index) => {

                        return (
                            <ListItem key={`notification_${index}`} onClick={() => {
                                this.routeNotification(_notification)
                            }} button style={{opacity: _notification.read_status == 1 ? .5 : 1}}>
                                <ListItemIcon>
                                    <PanTool />
                                </ListItemIcon>
                                {/* <ListItemText primary={renderHTML(_notification.message)} secondary={_notification.added_on_formatted} /> */}
                            </ListItem>
                        )
                    })}
                </List>
            )
        }else{

            return null;
        }
    }

    fetchNotifications = (reset) => {

        let notification_page = this.state.notification_page;

        if(reset){

            notification_page = 1;
            this.setState({notification_page: 1, notifications: []});
        }
        
        const formData = new FormData();
        formData.append('account_token', this.state.account_token);
        formData.append('page', notification_page);

        this.setState({notification_reloading: true});

        var self = this;
        Api.post('notifications/load', formData, function(data){

            if(data.status){
                
                self.setState({notification_reloading: false, notification_page: notification_page + 1});

                let notifications = self.state.notifications;
                notifications = [...notifications, ...data.notifications];

                self.setState({notifications: notifications});
            }
        });
    }

    realoadNotifications = () => {

        var that = this;
        this.interval = setInterval(() => {
            that.fetchNotificationsCount(that.state.account_token);
        }, 8000);
    }

    readNotification = (notification) => {

        const formData = new FormData();
        formData.append('account_token', this.state.account_token);
        formData.append('notification_id', notification.notification_id);

        var self = this;
        Api.post('clients/notifications/mark_read', formData, function(data){

            if(data.status){

                var notifications_count = self.state.notifications_count;
                notifications_count = notifications_count - 1;

                self.setState({notifications_count: notifications_count});

                self.updateNotification(notification);
            }
        });
    }

    updateNotification = (notification) => {

        var notifications = this.state.notifications;
        if(notifications && notifications.length > 0){

            for(var i in notifications){

                if(notifications[i]['notification_id'] == notification.notification_id){

                    notifications[i]['view_status'] = 1;
                    notifications[i]['read_status'] = 1;
                }
            }
        }

        this.setState({notifications: notifications});
    }

    fetchNotificationsCount = (account_token) => {

        this.setState({help_alert: false, help_message: ''});

        const formData = new FormData();
        formData.append('account_token', account_token);

        if(this.props.active_link){
            formData.append('page', this.props.active_link);
        }

        var self = this;
        Api.post('notifications/count', formData, function(data){

            if(data.status){
                self.setState({notifications_count: data.counts});
            }
        });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    markAttendance = (t) => {

        const formData = new FormData();
        formData.append('account_token', this.state.account_token);
        formData.append('type', t);

        var self = this;
        Api.post('employees/mark_attendance', formData, function(data){

            if(data.status){

                self.setState({help_message: data.message, help_alert: true});
            }
        });
    }
}

const mapStateToProps = state => {
	return {
        user: state.user.user
	}
}

export default connect(mapStateToProps, { User } )(AppHeader);
