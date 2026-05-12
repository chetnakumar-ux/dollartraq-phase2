import React, { Component } from 'react';
import { Link } from "react-router-dom";

import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Alert from '@mui/material/Alert';

import { connect } from 'react-redux';
import {User} from 'actions/user';

import Icon from '@mui/material/Icon';

import Btn from './Btn';

import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

import logo from 'assets/images/logo-white.webp?v=3';

import Api from 'api/Api';

import menu from '../modules.json';

class Main extends Component { 
    constructor(props) {
        super();
        this.state = {

            user: false,

            picture: null,
            preview_image: null,

            account_token: false,

            roles: false,

            flash_error_message: '',
            flash_success_message: '',
            
            active_menu_item: '',
            mobileOpen: false,

            sub_menu_shown: false,
            show_sub_menu: false,

            submenu: []
        }

        this.imageRef = null;
    }

    componentDidMount = () => {

        var user = localStorage.getItem(import.meta.env.VITE_ACCOUNT_USER);
        var account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);   
        var role = localStorage.getItem('role');
        
        if(account_token){
            this.setState({account_token: account_token});
        }

        if(user){

            var _user = JSON.parse(user);
    
            this.setState({user: _user});
            
            var _role = JSON.parse(role);
            this.setState({role: _role});
        }

        const flash_success_message = localStorage.getItem('flash_success_message');
        const flash_error_message = localStorage.getItem('flash_error_message');

        if(flash_success_message){

            this.setState({flash_success_message: flash_success_message})
            localStorage.removeItem('flash_success_message');

            window.setTimeout(() => {

                this.setState({flash_success_message: ''})
            }, 5000)
        }

        if(flash_error_message){

            this.setState({flash_error_message: flash_error_message})
            localStorage.removeItem('flash_error_message');

            window.setTimeout(() => {

                this.setState({flash_error_message: ''})
            }, 5000)
        }
    }

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };     

    render () {
        const drawerWidth = 220;

        const sidebarContent = (
            <div className='main-menu-wrapper'>

                <div className='main-menu-block'>
                    <Box className='align-center' sx={{marginBottom:1, paddingTop: '10px'}}>
                        <Link to="/dashboard" className="logo">
                            <img src={logo} style={{width: 160}} alt="logo" />
                        </Link>
                    </Box>

                    <ul className='primary-menu'>
                        {this.renderMenu()}
                    </ul>
                </div>

                <div className='menu-sub-block'>
                    <span className='fs-13 c-w'>Version: <strong>1.1</strong></span>
                </div>
                {/* <div className={`submenu-wrapper ${this.state.show_sub_menu ? 'show' : ''} ${this.state.sub_menu_shown ? 'shown' : ''}`} onClick={() => {

                    this.setState({sub_menu_shown: false}, () => {
                                                        
                        window.setTimeout(() => {
                            
                            this.setState({active_menu_item: '', submenu: [], show_sub_menu: false})
                        }, 400)
                    });
                }}>

                    <div className='submenu'>

                        {this.renderSubmenu()}
                    </div>
                </div> */}                

            </div>
        );        
        
        return (

            <div>

                {(this.props.success_message && this.props.success_message != '') &&
                    <>
                        <Snackbar
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={true}
                            autoHideDuration={5000}
                            key={this.props.success_message}
                        >
                            <Alert elevation={6} variant="filled" severity="success">{this.props.success_message}</Alert>
                        </Snackbar>
                    </>
                }

                {(this.props.error_message && this.props.error_message != '') &&
                    <>
                        <Snackbar
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={true}
                            autoHideDuration={5000}
                            key={this.props.error_message}
                        >
                            {this.renderMessages('error', this.props.error_message)}
                        </Snackbar>
                    </>
                }

                <Drawer
                    variant="temporary"
                    open={this.state.mobileOpen}
                    onClose={this.handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#3877da' },
                    }}
                >
                    {sidebarContent}
                </Drawer>                

                <Container maxWidth={false} disableGutters={true} className='primary-container-wrapper-block'>
                    
                    <Grid container spacing={0} className={"main-container-wrapper-block"} alignItems="stretch" direction="row" justifyContent="flex-start">
                    
                        {/* backgroundColor: 'rgba(56, 119, 218, 1)' */}
                        <Grid size={3} sx={{zIndex: 99, flexBasis: {lg: '220px'}, maxWidth: {lg: '200px', margin: 0},display: { xs: 'none', sm: 'block' }}} className="nav-container">

                            <Paper elevation={0} square={true} sx={{padding: 0, position:'relative', backgroundColor:'transparent'}}>

                                {sidebarContent}

                            </Paper>
                        </Grid>
                            
                        <Grid item xs={12} size={9} className="main-col" sx={{flex: 1,  paddingLeft: 0, '@media (min-width:600px)': {paddingLeft: this.props.full_width ? 0 : 4, }, backgroundColor:'#fff'}}>

                            <Paper elevation={0} square={true} sx={{height: '100vh', overflow: 'auto', backgroundColor:'transparent'}}>
                            
                                <AppHeader
                                    onMenuClick={this.handleDrawerToggle}
                                    success_message={this.props.success_message}
                                    error_message={this.props.error_message}
                                    active_link={this.props.active_link}
                                    page={this.props.page}
                                />

                                <Box id="main_container" className={`main-container ${this.props.full_width ? 'full-width' : ''}`}>
                                
                                    {this.props.title || this.props.title_action
                                        ?

                                            <div className="main-title-block">
                                                {this.props.title &&

                                                    <h1 className='justify-center'>

                                                        {this.props.crumbs &&
                                                        
                                                            this.props.crumbs.map((_crumb, crumb_index) => {

                                                                return (
                                                                    <Link className='justify-center' key={`crumb_${crumb_index}`} to={_crumb.link}>
                                                                        <strong className='gr-5 fw-semibold'>{_crumb.label}</strong>

                                                                        <Icon style={{paddingTop: 5}}>chevron_right</Icon>
                                                                    </Link>
                                                                )
                                                            })
                                                        }

                                                        {this.props.title}
                                                    </h1>
                                                }

                                                {this.renderTitleButtons()}
                                            </div>
                                        :
                                            null
                                    }

                                    <div className="main-container-wrapper">

                                        {this.props.children}
                                    </div>
                                </Box>

                                <Snackbar
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    open={this.state.flash_success_message !== '' ? true : false}
                                    autoHideDuration={5000}
                                    key={"success_message"}
                                    onClose={() => {

                                        this.setState({flash_success_message: ''})
                                    }}
                                >
                                    <Alert elevation={6} variant="filled" severity="success">{this.state.flash_success_message}</Alert>
                                </Snackbar>

                                <Snackbar
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    open={this.state.flash_error_message !== '' ? true : false}
                                    autoHideDuration={5000}
                                    key={"error_message"}
                                    onClose={() => {

                                        this.setState({flash_error_message: ''})
                                    }}
                                >
                                    <Alert elevation={6} variant="filled" severity="error">{this.state.flash_error_message}</Alert>
                                </Snackbar>

                                <AppFooter />
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        )
    }

    renderTitleButtons = () => {

        let title_action = this.props.title_action;

        if(title_action && this.props.title_action.length){

            return (

                <div>
                    {title_action.map((_title_action, index) => {

                        let props = {}

                        if(_title_action.hasOwnProperty('link')){

                            props['to'] = _title_action.link;
                        }

                        if(_title_action.onClick){

                            props['onClick'] = _title_action.onClick;
                        }

                        return <Btn key={`title_button_${index}`} color="secondary" variant="contained" className="ml-10" {...props}>{_title_action.label}</Btn>
                    })}
                </div>
            )
        }else{

            return title_action
        }
    }

    renderMenu = () => {

        let menu_links = [];

        menu.forEach((_row) => {

            if(_row.hasOwnProperty('type') && _row.type === 'divider'){

                menu_links.push(<Divider key={_row.key} />)

            }else if(_row.hasOwnProperty('link')){

                menu_links.push(
                    <li key={_row.key} className={`${_row.key === this.props.active_page ? 'current' : ''}`}>
                        <Link to={`/${_row.link}`} onClick={() => { if(this.state.mobileOpen) this.handleDrawerToggle(); }}>
                            <div className='icon'>
                                <Icon>{_row.icon}</Icon>
                            </div>
                            
                            <span>{_row.label}</span>
                        </Link>
                    </li>
                )
            }else{

                menu_links.push(
                    <li
                        className={`has-childs ${_row.key === this.props.active_page ? '' : ''}`}
                        key={_row.key}
                        onClick={(e) => {

                        //     if(this.state.active_menu_item === ''){
                            
                        //         this.setState({show_sub_menu: true, sub_menu_shown: true, active_menu_item: _row.key}, () => {

                        //             window.setTimeout(() => {

                        //                 this.setState({submenu: _row.childs})
                        //             }, 200)
                        //         })
                        //     }else{

                        //         if(this.state.active_menu_item === _row.key){

                        //             this.setState({sub_menu_shown: false}, () => {
                                        
                        //                 window.setTimeout(() => {
                                            
                        //                     this.setState({active_menu_item: '', submenu: [], show_sub_menu: false})
                        //                 }, 400)
                        //             });
                        //         }else{

                        //             this.setState({submenu: _row.childs, active_menu_item: _row.key})
                        //         }
                        //     }

                            let clist = e.currentTarget.classList;

                            if(clist.contains('hovered')){

                                clist.remove('hovered')
                                e.currentTarget.className = clist;
                            }else{

                                e.currentTarget.className += ' hovered'
                            }
                            
                            if(this.state.active_menu_item === ''){
                            
                                this.setState({show_sub_menu: true, sub_menu_shown: true, active_menu_item: _row.key}, () => {

                                    window.setTimeout(() => {

                                        this.setState({submenu: _row.childs})
                                    }, 200)
                                })
                            }else{

                                if(this.state.active_menu_item === _row.key){

                                    this.setState({show_sub_menu: false}, () => {
                                        
                                        window.setTimeout(() => {
                                            
                                            this.setState({active_menu_item: '', sub_menu_shown: false, submenu: []})
                                        }, 400)
                                    });
                                }else{

                                    this.setState({submenu: _row.childs, active_menu_item: _row.key})
                                }
                            }
                        }}
                    >
                        <div className='label'>

                            <div>
                                <div className='icon'>
                                    <Icon>{_row.icon}</Icon>
                                </div>
                                <span>{_row.label}</span>
                            </div>

                            <div className={`end-icon`} style={{transform:this.state.active_menu_item === _row.key || this.props.active_page === _row.key ? 'rotate(90deg)' : 'rotate(0deg)', transition:'.2s all ease-in-out'}}>
                                <Icon>chevron_right</Icon>
                            </div>
                        </div>

                        {_row.hasOwnProperty('childs') &&
                        
                            <div className={`submenu ${this.state.active_menu_item === _row.key || this.props.active_page === _row.key ? 'shown' : 'hidden'}`}>
                                <ul>
                                    {_row.childs.map((_child_menu, index) => {

                                        return (
                                            <li key={_child_menu.key}>
                                                <Link to={`/${_child_menu.link}`} onClick={() => {

                                                    this.setState({show_sub_menu: false}, () => {
                                                                                        
                                                        window.setTimeout(() => {
                                                            
                                                            this.setState({active_menu_item: '', sub_menu_shown: false, submenu: []})
                                                        }, 400)
                                                    });
                                                }}>
                                                    - {_child_menu.title}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        }
                    </li>
                )
            }
        })

        return menu_links;
    }

    renderSubmenu = () => {

        let submenu = this.state.submenu;

        if(submenu.length > 0){

            let submenu_html = submenu.map((_submenu, index) => {

                if(_submenu.hasOwnProperty('type') && _submenu.type === 'divider'){

                    return <li key={_submenu.key}><Divider /></li>
                }

                if(_submenu.hasOwnProperty('childs')){

                    return (
                        <ul>
                            {
                                _submenu.childs.map((_child_menu, index) => {

                                    return (
                                        <li key={_child_menu.key}>
                                            <Link to={`/${_child_menu.link}`} onClick={() => {

                                                this.setState({show_sub_menu: false}, () => {
                                                                                    
                                                    window.setTimeout(() => {
                                                        
                                                        this.setState({active_menu_item: '', sub_menu_shown: false, submenu: []})
                                                    }, 400)
                                                });
                                            }}>
                                                {_child_menu.label}
                                            </Link>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    )
                }else{
                
                    return (
                        <li key={_submenu.key}>
                            <Link to={`/${_submenu.link}`}>
                                {_submenu.label}
                            </Link>
                        </li>
                    )
                }
            })

            return <ul>{submenu_html}</ul>
        }
    }

    uploadProfileImgae = async (croppedImage) => {

        const formData = new FormData();
        formData.append('account_token', this.state.account_token);
        formData.append('tmp_file_name', croppedImage);
        formData.append('upload_dir', 'restaurant_gallery/');

        this.setState({image_uploading: true});

        this.setState({
            temp_profile_image: null,
        });

        var that = this;

        Api.post('clients/profile/update_profile_photo', formData, function(data){

            that.setState({picture: null, preview_image: null, logo_image_loading: false, main_img_loading: false, croppedImageUrl: null, croppedImage: null, image_uploading: false});

            if(data.status){

                that.setState({user: data.user});
                localStorage.setItem('user', JSON.stringify(data.user));
                that.props.User(data.user);
            }
        });
    }

    renderMessages = (type, message) => {

        if(typeof message == 'object'){

            var alert = [];

            for(var m in message){

                alert.push(<p style={{marginTop:0, marginBottom:5}} key={type + '_message_' + m}>{message[m]}</p>);
            }

            return <Alert elevation={6} variant="filled" severity={type}>{alert}</Alert>;
        }else{

            return <Alert elevation={6} variant="filled" severity={type}>{message}</Alert>
        }
    }
}

const mapStateToProps = state => {
	return {
        user: state.user.user
	}
}

export default connect(mapStateToProps, { User } )(Main);