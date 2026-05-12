import React, { Component } from 'react';
import { Link } from "react-router-dom";

import { connect } from 'react-redux';
import { Paging } from 'actions/paging';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableSortLabel from '@mui/material/TableSortLabel';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';
import Menu from '@mui/material/Menu';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Paper from '@mui/material/Paper';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import Skeleton from '@mui/material/Skeleton';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Edit from '@mui/icons-material/Edit';
import FilterList from '@mui/icons-material/FilterList';
import Clear from '@mui/icons-material/Clear';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CalendarToday from '@mui/icons-material/CalendarToday';
import CheckBox from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlank from '@mui/icons-material/CheckBoxOutlineBlank';
import Close from '@mui/icons-material/Close';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import DateHelper from 'helpers/DateHelper';

import NoData from 'components/blocks/NoData';
import Btn from 'components/Btn';

import EditableCell from './EditableCell';

import Api from 'api/Api';

import 'assets/styles/datatable.css';

class DataTable extends Component { 
    constructor(props) {
        super();

        this.state = {

            page: 0,

            loading: true,
            fadeOut: false,
            show_loader: false,

            hide_search: false,

            per_page: 10,
            total_records: 0,

            data: [],

            no_data: false,

            column_sort_by: null,
            sort_by_dir: 'desc',

            search: {},

            range_popover: false,

            range_init: false,
            range_start: false,
            range_end: false,
            range_selected_column: false,

            main_checked: false,
            select_all: false,
            checked_rows: [],
            checked_rows_data: [],

            bulk_action: false,
            selected_bulk_action: "",

            bulk_selection: false,

            selected_row_index: false,
            selected_row_data: false,

            editable_cell: false,

            applied_tabbed_filters: [],

            active_tab: '**'
        }

        this.search_interval = null;
    }

    componentDidMount = () => {

        if(this.getTableIndex('page')){

            let page = this.getTableIndex('page');

            this.setState({page: page});
        }

        if(this.getTableIndex('per_page')){

            let per_page = this.getTableIndex('per_page');

            this.setState({per_page: per_page});
        }

        if(this.getTableIndex('search') !== false){

            let search_values = {};

            let _search = this.getTableIndex('search');

            _search = JSON.parse(_search);

            if(Object.keys(_search).length > 0){

                for(let _s in _search){

                    search_values[_s] = _search[_s]['keyword']
                }

                this.setState({search_values: search_values, search: _search});
            }
        }

        var page = this.state.page;
        var per_page = this.state.per_page;

        var paging = this.props.paging;

        if(this.props.index && paging.hasOwnProperty(this.props.index)){

            if(paging[this.props.index].hasOwnProperty('page')){

                page = paging[this.props.index]['page'];
                this.setState({page: page});
            }

            if(paging[this.props.index].hasOwnProperty('per_page')){

                per_page = paging[this.props.index]['per_page'];
                this.setState({per_page: per_page});
            }
        }

        if(this.props.per_page){

            this.setState({per_page: this.props.per_page})
        }

        let applied_tabbed_filters = this.tabbedFilters()

        let active_tab = applied_tabbed_filters.default_active_tab;

        if(active_tab.hasOwnProperty('default')){
        
            if(active_tab.default === ''){

                this.setState({active_tab: '**'})
            }else{

                this.setState({active_tab: active_tab.default})
            }
        }

        if(this.props.default_sort_by){

            this.setState({column_sort_by: this.props.default_sort_by});

            if(this.props.sort_by_dir && (this.props.sort_by_dir === 'asc' || this.props.sort_by_dir === 'desc')){

                this.setState({sort_by_dir: this.props.sort_by_dir})
            }

            this.setState({applied_tabbed_filters: applied_tabbed_filters.applied_tabbed_filters})

            var that = this;

            window.setTimeout(() => {
                
                that.loadData(that.state.page, that.props.account_token, false, true);
            }, 500);
            
        }else{

            this.setState({applied_tabbed_filters: applied_tabbed_filters}, () => {

                this.loadData(this.state.page, this.props.account_token, false, true);
            })
        }
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {

        if(
            this.props.do_reload
            &&
            this.props.do_reload !== prevProps.do_reload
            &&
            this.props.do_reload === true
        ){

            this.loadData(this.state.page, this.props.account_token, false, false);
        }

        if(
            this.props.close_bulk_action
            &&
            this.props.close_bulk_action !== prevProps.close_bulk_action
            &&
            this.props.close_bulk_action === true
        ){

            this.setState({bulk_action: false, select_all: false, main_checked: false})
            this.props.onBulkActionClose();
            this.unCheckAll();
        }
    }

    componentWillUnmount = () => {

        clearTimeout(this.search_interval);
    }

    updatePage = (_props) => {

        var paging = this.props.paging;
        
        if(this.props.index){

            if(!paging.hasOwnProperty(this.props.index)){

                paging[this.props.index] = {};
            }
            
            if(_props.hasOwnProperty('page')){
            
                paging[this.props.index]['page'] = _props.page;

                this.setTableIndex('page', _props.page)
            }

            if(_props.hasOwnProperty('per_page')){
            
                paging[this.props.index]['per_page'] = _props.per_page;

                this.setTableIndex('per_page', _props.per_page)
            }
            
            this.props.Paging(paging);
        }
    }

    bulkActionTitle = () => {

        if(this.state.selected_bulk_action){

            const _action = this.props.bulk_actions.find(a => a.key === this.state.selected_bulk_action);
            
            if(_action){

                return _action.title;
            }
        }

        if(this.state.select_all){

            return <div>Bulk Actions <span className="op-7">({this.state.total_records} selected)</span></div>
        }else{
        
            return this.state.checked_rows.length > 0 ? <div>Bulk Actions <span className="op-7">({this.state.checked_rows.length} selected)</span></div> : "Bulk Actions";
        }
    }

    tabbedFilters = () => {

        let applied_tabbed_filters = [];
        let default_active_tab = {};

        let tabbed_filters = this.props.tabbed_filters;

        if(tabbed_filters && tabbed_filters.hasOwnProperty('filters')){

            tabbed_filters.filters.map((_tabbed_filters) => {

                if(_tabbed_filters.hasOwnProperty('default') && _tabbed_filters.default !== ''){

                    default_active_tab['tab'] = _tabbed_filters.key
                    default_active_tab['default'] = _tabbed_filters.default;

                    applied_tabbed_filters.push({key: _tabbed_filters.key, value: _tabbed_filters.default})
                }
                // else{

                //     if(_tabbed_filters.hasOwnProperty('options') && _tabbed_filters.options > 0){

                //         applied_tabbed_filters.push({key: _tabbed_filters.key, value: _tabbed_filters.options[0]['key']})
                //     }
                // }
            })
        }

        return {applied_tabbed_filters: applied_tabbed_filters, default_active_tab: default_active_tab}
    }

    renderTabbedFilters = () => {

        let tabbed_filters = this.props.tabbed_filters;

        if(tabbed_filters && tabbed_filters.hasOwnProperty('filters') && tabbed_filters.filters.length > 0){

            if(tabbed_filters.hasOwnProperty('type') && tabbed_filters.type === 'tabs'){

                return (
                    <Tabs
                        className="mb-10"
                        value={this.state.active_tab}
                        size="small"
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        onChange={(e, tab_num) => {

                            let applied_tabbed_filters = this.state.applied_tabbed_filters;

                            this.setState({active_tab: tab_num})

                            if(this.props.activeTab){

                                this.props.activeTab(tab_num)
                            }

                            const _applied = applied_tabbed_filters.findIndex(row => row.key === tabbed_filters.filters[0]['key']);

                            if(_applied > -1){

                                applied_tabbed_filters[_applied]['value'] = tab_num
                            }else{

                                applied_tabbed_filters.push({key: tabbed_filters.filters[0]['key'], value: tab_num})
                            }

                            this.setState({applied_tabbed_filters: applied_tabbed_filters}, () => {

                                if(this.props.onTabClick){

                                    this.props.onTabClick(tab_num)
                                }

                                this.loadData(0, this.props.account_token, true);
                            })
                        }}
                    >
                        {tabbed_filters.filters.map((_tabbed_filter, index) => {

                            let _options = [];

                            if(_tabbed_filter.hasOwnProperty('hide_all') && _tabbed_filter.hide_all === true){


                            }else{

                                _options.push({key: '**', value: 'All'})
                            }

                            if(_tabbed_filter.hasOwnProperty('options') && _tabbed_filter.options.length > 0){

                                _options = [..._options, ..._tabbed_filter.options];
                            }

                            return _options.map((_option, _index) => {

                                return (
                                    <Tab
                                        value={_option.key}
                                        key={`tabbed_filter_tab_option_${_index}_${index}`}
                                        label={`${_option.value}`}
                                    />
                                )
                            })
                        })}
                    </Tabs>
                )
            }

            let filters = [];

            tabbed_filters.filters.map((_tabbed_filter, index) => {

                let _filter_options = [];

                let _options = [];

                // _options.push({key: '**', value: 'All'})

                if(_tabbed_filter.hasOwnProperty('options') && _tabbed_filter.options.length > 0){

                    _options = [..._options, ..._tabbed_filter.options];
                }

                _options.map((_option, _index) => {

                    _filter_options.push(
                        <Chip
                            key={`tabbed_filter_option_${_index}_${index}_${_tabbed_filter.key}`}
                            size="small"
                            label={<div className='align-center'><span className='fs-11 fw-semibold'>{_option.value}</span>{this.inAppliedTabbedFilters(_tabbed_filter.key, _option.key) === 'primary' ? <span style={{marginLeft: 5, width: 14, height: 14, borderRadius: '50%', padding: 2, backgroundColor: 'rgba(0, 0, 0, .2)'}} className='align-center'><Close style={{fontSize: 12}} /></span> : ''}</div>}
                            color={this.inAppliedTabbedFilters(_tabbed_filter.key, _option.key)}
                            onClick={() => {

                                let applied_tabbed_filters = this.state.applied_tabbed_filters;

                                const _applied = applied_tabbed_filters.findIndex(row => row.key === _tabbed_filter.key);

                                if(_applied > -1){

                                    if(applied_tabbed_filters[_applied]['value'].indexOf(_option.key) > -1){

                                        applied_tabbed_filters[_applied]['value'].splice(applied_tabbed_filters[_applied]['value'].indexOf(_option.key), 1)

                                        if(applied_tabbed_filters[_applied]['value'].length <= 0){

                                            applied_tabbed_filters.splice(_applied, 1);
                                        }
                                    }else{

                                        applied_tabbed_filters[_applied]['value'].push(_option.key)
                                    }
                                }else{

                                    applied_tabbed_filters.push({key: _tabbed_filter.key, value: [_option.key]})
                                }

                                this.setState({applied_tabbed_filters: applied_tabbed_filters}, () => {

                                    this.loadData(0, this.props.account_token, true);
                                })
                            }}
                        />
                    );
                })

                filters.push(
                    <ul key={`tabbed_filter_${index}_${_tabbed_filter.key}`}>
                        <li>
                            <strong>{_tabbed_filter.label}</strong>
                            <Stack direction="row" spacing={1}>{_filter_options}</Stack>
                            {this.tabbedFilterClearButton(_tabbed_filter.key)}
                        </li>
                    </ul>
                );
            })

            return filters
        }
    }

    tabbedFilterClearButton = (key) => {

        let applied_tabbed_filters = this.state.applied_tabbed_filters;

        const _applied = applied_tabbed_filters.findIndex(row => row.key === key);

        if(_applied > -1){

            return <Btn className="ml-10" size="small" type="button" icon={true} onClick={() => {

                applied_tabbed_filters.splice(_applied, 1);

                this.setState({applied_tabbed_filters: applied_tabbed_filters}, () => {

                    this.loadData(0, this.props.account_token, true);
                })

            }}><Close style={{fontSize: 14}} /></Btn>
        }
    }

    inAppliedTabbedFilters = (filter_key, option_key) => {

        let applied_tabbed_filters = this.state.applied_tabbed_filters;

        const _applied = applied_tabbed_filters.find(row => row.key === filter_key);

        if(_applied && _applied.value.indexOf(option_key) > -1){

            return 'primary'
        }

        return 'default'
    }

    renderToolbarActions = () => {

        if(this.props.toolbar_actions){
            
            return this.props.toolbar_actions.map((_toolbar_action, index) => {

                let props = {className: 'ml-10'}

                if(_toolbar_action.hasOwnProperty('startIcon')){

                    props['startIcon'] = _toolbar_action.startIcon
                }

                if(_toolbar_action.hasOwnProperty('endIcon')){

                    props['endIcon'] = _toolbar_action.endIcon
                }

                if(_toolbar_action.hasOwnProperty('to')){

                    props['to'] = _toolbar_action.to
                }

                if(_toolbar_action.hasOwnProperty('onClick')){

                    props['onClick'] = _toolbar_action.onClick
                }

                if(_toolbar_action.hasOwnProperty('className')){

                    props['className'] = `${props.classNames} ${_toolbar_action.className}`
                }

                return (
                    <Btn {...props} key={`toolbar_action_${index}`} color="primary" variant="outlined" size="small">{_toolbar_action.label}</Btn>
                )
            })
        }
    }

    render () {
        
        return (

            <div className="datatable">

                <div className='tabbed-filters'>

                    <div className='tabbed-filters-list'>
                        {this.renderTabbedFilters()}
                    </div>
                </div>

                {this.props.beforeUpperToolbar}

                {this.props.hide_upper_toolbar
                    ?
                        null
                    :

                        <div className="toolbar upper">

                            <div className='primary'>

                                {this.props.bulk_actions &&
                                
                                    <>
                                        <Button disabled={this.state.checked_rows_data.length > 0 ? false : true} color="secondary" variant='outlined' className='mr-5' size="small" endIcon={<ExpandMore />} aria-controls="bulk-actions" aria-haspopup="true" onClick={(e) => {

                                            this.setState({bulk_action: e.currentTarget})
                                        }}>
                                            {this.bulkActionTitle()}
                                        </Button>

                                        <Menu
                                            id="bulk-actions"
                                            anchorEl={this.state.bulk_action}
                                            keepMounted
                                            open={Boolean(this.state.bulk_action)}
                                            onClose={() => {

                                                this.setState({bulk_action: false, main_checked: false, select_all: false})
                                                this.props.onBulkActionClose();
                                                this.unCheckAll();
                                            }}
                                        >
                                            {this.props.bulk_actions}
                                        </Menu>
                                    </>
                                }

                                <Menu
                                    id="bulk-selection"
                                    anchorEl={this.state.bulk_selection}
                                    keepMounted
                                    open={Boolean(this.state.bulk_selection)}
                                    onClose={() => {

                                        this.setState({bulk_selection: false})
                                    }}
                                >
                                    <MenuItem key="select_visible" value="select_visible" style={{padding:0}}>

                                        <FormControlLabel
                                            style={{padding:5, width:'100%', margin:0}}
                                            label={<span className='mr-10'>Select Visible</span>}
                                            control={
                                                <Checkbox
                                                    color="primary"
                                                    size="small"
                                                    checked={this.state.main_checked}
                                                    onChange={(e) => {
                                                        if(e.target.checked){

                                                            this.checkAll();
                                                            this.setState({main_checked: true, select_all: false, bulk_selection: false})
                                                        }else{

                                                            this.setState({checked_rows: [], checked_rows_data: [], main_checked: false, bulk_selection: false});
                                                        }

                                                        if(this.props.onSelectAll){

                                                            this.props.onSelectAll(false, {})
                                                        }
                                                    }}
                                                />
                                            }
                                        />
                                    </MenuItem>
                                    <MenuItem key="select_all" value="select_all" style={{padding:0}}>

                                        <FormControlLabel
                                            style={{padding:5, width:'100%', margin:0}}
                                            label="Select All"
                                            control={
                                                <Checkbox
                                                    color="primary"
                                                    size="small"
                                                    checked={this.state.select_all}
                                                    onChange={(e) => {
                                                        if(e.target.checked){

                                                            this.checkAll();
                                                            this.setState({select_all: true, main_checked: false, bulk_selection: false});
                                                            
                                                            if(this.props.onSelectAll){

                                                                this.props.onSelectAll(true, this.state.search)
                                                            }
                                                        }else{

                                                            this.setState({checked_rows: [], checked_rows_data: [], select_all: false, bulk_selection: false});
                                                            
                                                            if(this.props.onSelectAll){

                                                                this.props.onSelectAll(false, {})
                                                            }
                                                        }
                                                    }}
                                                />
                                            }
                                        />
                                    </MenuItem>
                                </Menu>

                                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14}}>
                                    <strong>Total Records:</strong> <span className="ml-10">{this.state.total_records}</span>
                                </Box>

                                <div className="toolbar-paging">

                                    <TablePagination
                                        style={{marginLeft:20}}
                                        rowsPerPageOptions={this.props.hide_rows_per_page ? [] : [10, 20, 50, 100]}
                                        component="div"
                                        count={this.state.total_records}
                                        rowsPerPage={parseInt(this.state.per_page)}
                                        page={this.state.page}
                                        onPageChange={(e, page) => {
                                            this.setState({page: page});

                                            this.updatePage({page: page});
                                            this.loadData(page, this.props.account_token, true);
                                        }}
                                        onRowsPerPageChange={(e) => {

                                            this.setState({per_page: e.target.value}, () => {

                                                this.setState({page: 0});

                                                this.updatePage({page: 0, per_page: e.target.value});
                                                this.loadData(0, this.props.account_token, true);
                                            });
                                        }}
                                    />

                                    <div className="search-button">
                                    
                                        {this.props.hide_search_bar
                                            ?
                                                null
                                            :
                                                <IconButton onClick={() => {
                                                    this.setState({hide_search: !this.state.hide_search})
                                                }}>
                                                    <FilterList />
                                                </IconButton>
                                        }
                                    </div>
                                </div>
                            </div>

                            <div>
                                {this.renderToolbarActions()}
                            </div>
                        </div>
                }

                {this.props.afterUpperToolbar}

                {this.state.checked_rows.length > 0 &&
                        
                    <div className='ml-5'>
                        <div>
                            <strong className='fs-13'>{this.state.checked_rows.length} record's selected</strong>
                            <Btn className="ml-10" color="secondary" variant="text" size="small" endIcon={<Clear fontSize='12px' style={{fontSize: 12}} />} onClick={() => {

                                this.setState({checked_rows: [], checked_rows_data: [], select_all: false, bulk_selection: false, main_checked: false});
                                                
                                if(this.props.onSelectAll){

                                    this.props.onSelectAll(false, {})
                                }

                                if(this.props.onRowCheck){

                                    this.props.onRowCheck([])
                                }
                            }}>Clear Selection</Btn>
                        </div>
                    </div>
                }

                {this.props.list_component
                    ?
                
                        <Grid container spacing={this.props.list_component_spacing ? this.props.list_component_spacing : 5}>

                            {this.renderListComponent()}

                            {this.state.loading &&
                                this.renderSkeleton()
                            }
                        </Grid>
                    :

                        <TableContainer style={{position:'relative'}}>

                            <Table aria-label="simple table" className="data-table" sx={{minWidth: 100}}>

                                <TableHead>
                                    {this.renderHeaders()}
                                </TableHead>

                                <TableBody>

                                    {this.props.hide_search_bar
                                        ?
                                            null
                                        :
                                            this.state.hide_search
                                                ?
                                                    null
                                                :
                                                    this.renderSearch()
                                    }
                                    
                                    {this.state.no_data
                                        ?
                                            this.noData()
                                        :
                                            <>
                                                {this.renderData()}
                                            </>
                                    }
                                    
                                </TableBody>
                            </Table>

                            {this.state.loading &&
                                this.renderSkeleton()
                            }

                            {this.state.show_loader &&

                                <div style={{position:'absolute', width:'100%', height:'calc(100% - 120px)', backgroundColor:'rgba(255,255,255,.1)', zIndex:999, top:120, left:0, display:'flex', alignItems:'flex-start', justifyContent:'center'}}>
                                    <div style={{width:100, height:100, marginTop:30, textAlign:'center'}}>
                                        <CircularProgress size="40" color="primary" />
                                        <strong>Loading</strong>
                                    </div>
                                </div>
                            }
                        </TableContainer>
                }

                {this.props.hide_bottom_toolbar
                    ?
                        null
                    :
                        <TablePagination
                            rowsPerPageOptions={this.props.hide_rows_per_page ? [] : [10, 20, 50, 100]}
                            component="div"
                            count={this.state.total_records}
                            rowsPerPage={parseInt(this.state.per_page)}
                            page={this.state.page}
                            onPageChange={(e, page) => {
                                this.setState({page: page});

                                this.updatePage({page: page});
                                this.loadData(page, this.props.account_token, true);
                            }}
                            onRowsPerPageChange={(e) => {

                                this.setState({per_page: e.target.value}, () => {

                                    this.setState({page: 0});

                                    this.updatePage({page: 0, per_page: e.target.value});
                                    this.loadData(0, this.props.account_token, true);
                                });
                            }}
                        />
                }

                <Popover
                    onClose={() => {
                        this.setState({range_popover: false})
                    }}
                    open={this.state.range_popover ? true : false}
                    anchorEl={this.state.range_popover}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                >
                    <div className="popover-confirm" style={{width:360}}>

                        <div className="content" style={{padding:20}}>

                            {this.renderDateRangeView()}

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                            
                                <DateCalendar
                                    disableToolbar
                                    variant="static"
                                    inputFormat="MM/dd/yyyy"
                                    inputVariant="standard"
                                    minDate={this.minDate()}
                                    value={this.state.range_start != false ? this.state.range_start : null}
                                    onChange={(e, date) => {

                                        if(this.state.range_init){

                                            this.setState({range_start: e, range_init: false})
                                        }else{

                                            this.setState({range_end: e, range_popover: false}, () => {

                                                this.gridSearch(this.state.range_selected_column, [this.state.range_start, this.state.range_end]);
                                            });                                            
                                        }
                                    }}
                                    autoOk={true}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                </Popover>
            </div>
        )
    }

    renderDateRangeView = () => {

        return (
            this.state.range_start != false &&
                                    
                <div className="space-between mb-10">
                    <span className='fs-14'>
                        {DateHelper.formattedDate(new Date(this.state.range_start))} -  
                        
                        {this.state.range_end != false &&
                        
                            DateHelper.formattedDate(new Date(this.state.range_end))
                        }
                    </span>

                    <IconButton onClick={() => {

                        this.gridSearch(this.state.range_selected_column, '')

                        this.setState({range_start: false, range_end: false, range_selected_column: false, range_popover: false})

                        window.setTimeout(() => {
                            this.loadData(0, this.props.account_token, false, true)
                        }, 200)
                    }}>
                        <Clear className='c-red' style={{fontSize: 14}} />
                    </IconButton>
                </div>
        )
    }

    minDate = () => {

        if(this.state.range_init){

            let date = new Date();
            date.setFullYear( date.getFullYear() - 5 );

            return date;
        }else{

            const _date = new Date(this.state.range_start);
            return _date;
        }
    }

    noData = () => {

        var columns = this.props.columns;

        return (
            <TableRow className="data-table-row-no-data">
                <TableCell colSpan={(columns.length) + 1}>
                    <NoData size="small" message={this.props.label ? this.props.label + " not found!" : "Records not found!"} />
                </TableCell>
            </TableRow>
        )
    }

    renderHeaders = () => {

        var columns = this.props.columns;
        if(columns.length > 0){

            var cols = [];

            for(var i in columns){

                var column = columns[i];
                
                if(column && typeof column == 'object' && column.hasOwnProperty('column')){
                
                    cols.push(

                        this.renderHeaderCell(column, i)
                    )
                }
            }

            return (
                <TableRow className="card">
                    {cols}
                    <TableCell></TableCell>
                </TableRow>
            )
        }
    }

    renderSearch = () => {

        var columns = this.props.columns;
        if(columns.length > 0){

            var cols = [];

            for(var i in columns){

                var column = columns[i];

                if(column && typeof column == 'object' && column.hasOwnProperty('column')){

                    cols.push(
                        <TableCell key={`search_${column.column}_${i}`} style={{padding:0}}>

                            {this.renderSearchDropdown(column)}
                        </TableCell>
                    )
                }
            }

            return (
                <>
                    <TableRow className="data-table-row-search">
                        {cols}
                        <TableCell style={{padding:0}}>
                            {this.clearSearch()}
                        </TableCell>
                    </TableRow>
                    <TableRow className="data-table-row-spacer">
                        <TableCell colSpan={(cols.length) + 1}></TableCell>
                    </TableRow>
                </>
            )
        }
    }

    clearSearch = () => {
        
        var search = this.state.search;
        
        if(Object.keys(search).length > 0){

            return (
                <IconButton size="small" color="secondary" style={{color:'#ff0000'}} onClick={() => {
                    
                    this.setState({search: {}, page: 0});

                    this.removeTableIndex('search');
                    
                    var data_table_select = document.querySelectorAll('.data-table-input');
                    
                    data_table_select.forEach(_select => {
                        _select.value = '';
                    });

                    let columns = this.props.columns;
                    if(columns.length > 0){

                        columns.forEach((_column) => {

                            if(_column.search_input && _column.search_input == 'date'){

                                this.setState({[_column.column]: null})
                            }

                            if(_column.search_input && _column.search_input == 'date_range'){

                                this.setState({range_start: false, range_end: false, range_selected_column: false})
                            }
                        })
                    }
                    
                    window.setTimeout(() => {
                        this.loadData(0, this.props.account_token, false, true)
                    }, 200)
                }}>
                    <Clear />
                </IconButton>
            )
        }
    }

    renderListComponent = () => {

        let data_list = this.getData();

        const size = this.props.list_component_size ? this.props.list_component_size : 3

        return data_list.map((_data_list, index) => {

            return (
                <Grid size={size} key={`list_item_${index}`}>
                    {/* <Paper elevation={0} variant='elevation'>
                        <Box sx={this.props.list_item_box_styles ? this.props.list_item_box_styles : {padding: 2}}> */}
                            {this.props.list_component(_data_list, index)}
                        {/* </Box>
                    </Paper> */}
                </Grid>
            )
        })
    }

    getData = () => {

        var data = this.state.data;

        if(this.props.data){

            data = this.props.data;
        }

        return data;
    }

    renderData = () => {

        var columns = this.props.columns;
        if(columns.length > 0){

            var data = this.getData();

            if(data && data.length > 0){

                var rows = [];

                for(var n in data){

                    var _row = data[n];
                    let _n = n;

                    var cols = [];

                    columns.forEach((column, index) => {

                        if(column && typeof column == 'object' && column.hasOwnProperty('column')){
                        
                            var _row_data = _row;
                            var row_data = _row[column.column];
                            let original_value = row_data;

                            if(column.hasOwnProperty('search_data') && column.search_data.length > 0){

                                let _row_data_value = column.search_data.find(row => row.key === row_data);

                                if(_row_data_value){

                                    row_data = _row_data_value.value;
                                }
                            }

                            var row_index = "data_" + n + "_" + index + "_" + column.column;

                            if(column.selectable){

                                var check_index = "data_" + n + + "_check";
                                var _column = column.column;
                                
                                cols.push(
                                    <TableCell className='col-cell' key={check_index} style={{padding:4}}>
                                        <Checkbox
                                            color="primary"
                                            size="small"
                                            checked={this.state.checked_rows && this.state.checked_rows.indexOf(row_data) > -1 ? true : false}
                                            onChange={(e) => {
                                                var checked_rows = this.state.checked_rows;
                                                var checked_rows_data = this.state.checked_rows_data;

                                                if(checked_rows.indexOf(row_data) > -1){

                                                    checked_rows.splice(checked_rows.indexOf(row_data), 1);
                                                    
                                                    if(checked_rows_data && checked_rows_data.length > 0){

                                                        for(var i in checked_rows_data){

                                                            if(checked_rows_data[i][_column] == row_data){

                                                                checked_rows_data.splice(checked_rows_data.indexOf(i), 1);
                                                            }
                                                        }
                                                    }
                                                }else{

                                                    checked_rows.push(row_data);
                                                    checked_rows_data.push(_row_data);
                                                }
                                                
                                                this.setState(state => ({checked_rows: checked_rows, checked_rows_data: checked_rows_data}), () => {

                                                    this.returnCheckedRows()
                                                });
                                            }}
                                        />
                                    </TableCell>
                                )
                            }else if(column.renderer){

                                if(typeof column.renderer == 'function'){

                                    cols.push(
                                        <EditableCell
                                            original_value={original_value}
                                            key={row_index}
                                            column={column}
                                            row={_row}
                                            num={_n}
                                            row_data={row_data}
                                            value={column.renderer(_row, _n, row_data)}
                                            account_token={this.props.account_token}
                                            onClick={(e) => {

                                                this.setState({editable_cell: e.target, selected_row_data: column, selected_row_index: _n})
                                            }}
                                            onCancel={() => {

                                                this.setState({selected_row_index: false})
                                            }}
                                            cell_update_url={column.hasOwnProperty('cell_update_url') ? column.cell_update_url : this.props.cell_update_url}
                                            onUpdate={(row_data, column) => {

                                                const _row_id = column.row_id;

                                                if(this.props.updateData){

                                                    const data = this.props.data;
                                                    
                                                    const _row_index = data.findIndex(row => row[_row_id] === row_data[_row_id]);

                                                    data[_row_index] = row_data

                                                    let record = {}
                                                    record.records = data;

                                                    this.props.updateData(record)
                                                }else{

                                                    const data = this.state.data;

                                                    const _row_index = data.findIndex(row => row[_row_id] === row_data[_row_id]);

                                                    data[_row_index] = row_data

                                                    this.setState({data: data})
                                                }
                                            }}
                                        />
                                    )
                                }else{
                                    cols.push(
                                        <EditableCell
                                            original_value={original_value}
                                            key={row_index}
                                            column={column}
                                            row={_row}
                                            num={_n}
                                            row_data={row_data}
                                            value={this.props[column.renderer](_row, n, row_data)}
                                            account_token={this.props.account_token}
                                            onClick={(e) => {

                                                this.setState({editable_cell: e.target, selected_row_data: column, selected_row_index: _n})
                                            }}
                                            onCancel={() => {

                                                this.setState({selected_row_index: false})
                                            }}
                                            cell_update_url={column.hasOwnProperty('cell_update_url') ? column.cell_update_url : this.props.cell_update_url}
                                            onUpdate={(row_data) => {

                                                const _row_id = this.props.row_id;

                                                if(this.props.updateData){

                                                    const data = this.props.data;
                                                    
                                                    const _row_index = data.findIndex(row => row[_row_id] === row_data[_row_id]);

                                                    data[_row_index] = row_data

                                                    let record = {}
                                                    record.records = data;

                                                    this.props.updateData(record)
                                                }else{

                                                    const data = this.state.data;

                                                    const _row_index = data.findIndex(row => row[_row_id] === row_data[_row_id]);

                                                    data[_row_index] = row_data

                                                    this.setState({data: data})
                                                }
                                            }}
                                        />
                                    )
                                }
                            }else{
                            
                                cols.push(
                                    <EditableCell
                                        original_value={original_value}
                                        key={row_index}
                                        column={column}
                                        row={_row}
                                        num={_n}
                                        row_data={row_data}
                                        value={row_data}
                                        account_token={this.props.account_token}
                                        onClick={(e) => {

                                            this.setState({editable_cell: e.target, selected_row_data: column, selected_row_index: _n})
                                        }}
                                        onCancel={() => {

                                            this.setState({selected_row_index: false})
                                        }}
                                        cell_update_url={column.hasOwnProperty('cell_update_url') ? column.cell_update_url : this.props.cell_update_url}
                                        onUpdate={(row_data) => {

                                            const _row_id = this.props.row_id;

                                            if(this.props.updateData){

                                                const data = this.props.data;
                                                
                                                const _row_index = data.findIndex(row => row[_row_id] === row_data[_row_id]);

                                                data[_row_index] = row_data

                                                let record = {}
                                                record.records = data;

                                                this.props.updateData(record)
                                            }else{

                                                const data = this.state.data;

                                                const _row_index = data.findIndex(row => row[_row_id] === row_data[_row_id]);

                                                data[_row_index] = row_data

                                                this.setState({data: data})
                                            }
                                        }}
                                    />
                                )
                            }
                        }
                    });

                    rows.push(
                        <React.Fragment key={"row_" + "_" + n}>
                            <TableRow className={`card has-hoverable-action row_${_n} ${(this.props.active_row === _n || this.state.selected_row_index === _n) ? 'active-row' : ''} ${_n}-${this.state.selected_row_index}`}>
                                {cols}
                                <TableCell>

                                    {this.props.row_actions
                                        ?
                                            this.props.row_actions(_row, n)
                                        :
                                            <>
                                                {this.props.view_url && this.props.row_id
                                                    ?
                                                        <>
                                                            <div className="hoverable-action">
                                                                <Link to={"/" + this.props.view_url + "/" + _row[this.props.row_id]}>
                                                                    <IconButton color="primary" size="small">
                                                                        <Edit />
                                                                    </IconButton>
                                                                </Link>
                                                            </div>
                                                        </>
                                                    :
                                                        null
                                                }
                                            </>
                                    }
                                </TableCell>
                            </TableRow>
                            <TableRow className="data-table-row-spacer">
                                <TableCell colSpan={(cols.length) + 1}></TableCell>
                            </TableRow>
                        </React.Fragment>
                    )
                }

                return rows
            }
        }
    }

    renderSkeleton = () => {

        if(this.props.list_component){

            const size = this.props.list_component_size ? this.props.list_component_size : 3

            let skeletons = [];

            for(let sk = 0; sk < 12; sk++){

                skeletons.push(
                    <Grid key={`sk_${sk}`} size={size}>
                        <Skeleton animation="wave" variant="rect" width={'100%'} height={250} style={{borderRadius:10}} />
                    </Grid>
                )
            }

            return skeletons;
        }else{

            return (
                <div style={{width:'100%', minHeight:400, top:102, left:0, zIndex:999}} className={this.state.fadeOut ? 'fade-out' : null}>
                    <div>
                        <Skeleton animation="wave" variant="rect" width={'100%'} height={51} style={{borderRadius:10}} />
                        <Skeleton animation="wave" variant="rect" width={'100%'} height={51} className="mt-10" style={{borderRadius:10}} />
                        <Skeleton animation="wave" variant="rect" width={'100%'} height={51} className="mt-10" style={{borderRadius:10}} />
                        <Skeleton animation="wave" variant="rect" width={'100%'} height={51} className="mt-10" style={{borderRadius:10}} />
                        <Skeleton animation="wave" variant="rect" width={'100%'} height={51} className="mt-10" style={{borderRadius:10}} />
                        <Skeleton animation="wave" variant="rect" width={'100%'} height={51} className="mt-10" style={{borderRadius:10}} />
                        <Skeleton animation="wave" variant="rect" width={'100%'} height={51} className="mt-10" style={{borderRadius:10}} />
                        <Skeleton animation="wave" variant="rect" width={'100%'} height={51} className="mt-10" style={{borderRadius:10}} />
                    </div>
                </div>
            )
        }
    }

    loadData = (page, account_token, paging_request, loader) => {

        this.setState({loading: loader});

        if(!loader){
            this.setState({show_loader: true})
        }

        var formData = new FormData();
        formData.append('account_token', account_token);
        formData.append('page', page);
        formData.append('per_page', this.state.per_page);

        if(this.state.column_sort_by != ''){

            formData.append('sort_by', this.state.column_sort_by);
            formData.append('sort_dir', this.state.sort_by_dir);
        }

        var search = this.state.search;
        
        if(Object.keys(search).length > 0){

            formData.append('search', JSON.stringify(this.state.search));
        }

        if(this.props.post_params && this.props.post_params.length > 0){

            var post_params = this.props.post_params;

            for(var i in post_params){

                formData.append(post_params[i]['key'], post_params[i]['value']);
            }
        }

        let filters = {};

        if(this.props.filter_params && this.props.filter_params.length > 0){

            this.props.filter_params.forEach((_filter_param) => {

                filters[_filter_param.key] = _filter_param.value;
            })
        }

        let applied_tabbed_filters = this.state.applied_tabbed_filters;

        if(applied_tabbed_filters.length > 0){

            applied_tabbed_filters.map((_tabbed_filters) => {

                if(_tabbed_filters.value !== '**'){

                    formData.append(_tabbed_filters.key, _tabbed_filters.value);
                    filters[_tabbed_filters.key] = _tabbed_filters.value;
                }
            })
        }

        if(Object.keys(filters).length > 0){

            formData.append('filters', JSON.stringify(filters));
        }

        var that = this;

        Api.post(this.props.api_url, formData, function(data){
            
            that.setState({fadeOut: true});
            
            // window.setTimeout(() => {
                that.setState({loading: false})
            // }, 500);

            if(that.props.relaodDone){

                that.props.relaodDone();
            }

            that.setState({show_loader: false});

            if(data.status){
                
                if(data.records && data.records.length > 0){

                    that.setState({no_data: false});
                }else{

                    that.setState({no_data: true})
                }

                if(that.props.updateData){

                    that.props.updateData(data)
                }else{

                    that.setState({data: data.records});
                }

                // if(!paging_request){

                    that.setState({total_records: data.total, per_page: data.per_page});
                // }
            }else{

                // if(data.code == 'no_account'){

                //     window.location = Api.url + 'logout';
                // }
            }
        });
    }

    renderSearchDropdown = (column) => {

        let _column = column.column;

        if(column.hasOwnProperty('db_column')){

            _column = column.db_column;
        }

        let value = this.state.search.hasOwnProperty(_column) ? this.state.search[_column].keyword : '';

        if(column.hide_search || column.selectable){

            return false;
        }

        if(column.search_input && column.search_input == 'dropdown'){

            var options = [];

            options.push(
                <option key={"search_select_empty_" + column.column} value="">Search {column.name}</option>
            )

            if(column.search_data){

                var search_data = column.search_data;
                
                for(var i in search_data){

                    options.push(
                        <option key={"search_select_" + i + "_" + search_data[i]['key'] + "_" + column.column} value={search_data[i]['key']}>{search_data[i]['value']}</option>
                    )
                }
            }

            return <select className="data-table-input" onChange={(event) => {
                this.gridSearch(column, event.target.value)
            }}>{options}</select>
            
        }else if(column.search_input && column.search_input == 'date'){

            return (
                <>
                    {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>

                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            inputVariant="standard"
                            // label="Valid From Date"
                            value={this.state[column.column] ? this.state[column.column] : null}
                            onChange={(e, date) => {
                                this.setState({[column.column]: date});
                                this.gridSearch(column, date)
                            }}
                            autoOk={true}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider> */}
                </>
            )
        
        }else if(column.search_input && column.search_input == 'date_range'){

            return (
                <div className='pt-5'>
                    <Button onClick={(e) => {

                        this.setState({range_popover: e.currentTarget, range_init: true, range_selected_column: column})
                    }}>
                        {this.state.range_start != false
                            ?           
                                <div className="flex-center vertical" style={{width:75}}>
                                    <span className="fs-11" style={{lineHeight:1.1}}>{DateHelper.formattedDate(new Date(this.state.range_start))}</span>
                                    
                                    {this.state.range_end != false &&
                                    
                                        <span className="fs-11" style={{lineHeight:1.1}}>{DateHelper.formattedDate(new Date(this.state.range_end))}</span>
                                    }
                                </div>
                            :
                                <CalendarToday className="fs-16" style={{fontSize: 16}} />
                        }
                    </Button>
                </div>
            )
        }else{
        
            return <input className="data-table-input" onKeyUp={(event) => {
                this.gridSearch(column, event.target.value)
            }} type="text" placeholder={"Search " + column.name} />
        }
    }

    gridSearch = (column, keyword) => {

        if(this.search_interval){
            clearTimeout(this.search_interval);
        }

        let search = this.state.search;
        
        let _column = column.field || column.column;

        if(column.hasOwnProperty('db_column')){
            
            _column = column.db_column
        }

        if(column.table){

            _column = column.table + '.' + _column;
        }

        if(keyword == ''){

            delete search[_column];
        }else{
            
            search[_column] = {'keyword': keyword, 'type': column.search_type || 'like'};
        }

        this.setTableIndex('search', JSON.stringify(search));
        
        this.setState({search: search, page: 0});
        
        var that = this;

        this.search_interval = setTimeout(() => {
            that.loadData(0, this.props.account_token, true, false);
        }, 500);
    }

    renderHeaderCell = (column, index) => {

        const header_action = (column.hasOwnProperty('header_action') ? column.header_action : null)

        if(column.selectable){

            return (
                <TableCell key={"heading_check_all"} style={{padding:'8px 4px'}}>
                    <Button size="small" style={{padding:'5px 5px', minWidth:10}} onClick={(e) => {

                        if(this.state.select_all || this.state.main_checked){

                            this.setState({checked_rows: [], checked_rows_data: [], select_all: false, bulk_selection: false, main_checked: false});
                            if(this.props.onSelectAll){

                                this.props.onSelectAll(false, {})
                            }

                            if(this.props.onBulkActionClose){

                                this.props.onBulkActionClose();
                            }

                            if(this.props.onRowCheck){

                                this.props.onRowCheck([]);
                            }
                        }else{

                            this.setState({bulk_selection: e.currentTarget})
                        }
                    }}>
                        {this.state.select_all || this.state.main_checked
                            ?
                                <CheckBox className='fs-12' style={{color:'#3f51b5', fontSize: 20}} />
                            :
                                <>
                                    <CheckBoxOutlineBlank className='op-6' size={10} style={{fontSize: 20}} />
                                    <ExpandMore className='fs-12 op-6' size={16} />
                                </>
                        }
                    </Button>
                </TableCell>
            )
        }else if(column.sortable){

            return (
                <TableCell key={`${column.column}_${index}`}>
                    <TableSortLabel
                        active={this.state.column_sort_by == (column.field || column.column)}
                        direction={this.state.sort_by_dir}
                        onClick={(e) => {
                            this.sortColumn(column)
                        }}
                    >
                        {column.name}
                    </TableSortLabel>
                </TableCell>
            )
        }else{

            return (
                <TableCell key={`${column.column}_${index}`}>
                    <div className='justify-start'>
                        <span>{column.name}</span>
                        {header_action}
                    </div>
                </TableCell>
            )
        }
    }

    sortColumn = (column) => {

        var sort_dir = this.state.sort_by_dir;

        this.setState({
            column_sort_by: column.field || column.column,
            sort_by_dir: (sort_dir == 'asc' ? 'desc' : 'asc'),
            page: 0
        });

        var that = this;

        window.setTimeout(() => {
            that.loadData(that.state.page, that.props.account_token, false, false);
        }, 500);
    }

    checkAll = () => {

        var checked_rows = [];
        var checked_rows_data = [];

        var data = this.getData();
        var columns = this.props.columns;

        data.forEach(_row => {

            columns.forEach(column => {

                if(column.selectable){

                    checked_rows.push(_row[column.column]);
                    checked_rows_data.push(_row);
                }
            })
        })

        this.setState({checked_rows: checked_rows, checked_rows_data: checked_rows_data}, () => {

            this.returnCheckedRows()
        });
    }

    unCheckAll = () => {

        this.setState({checked_rows: [], checked_rows_data: [], main_checked: false}, () => {

            this.returnCheckedRows()
        });
    }

    returnCheckedRows = () => {

        if(this.props.onRowCheck){

            var checked_rows_data = this.state.checked_rows_data;
            this.props.onRowCheck(checked_rows_data);
        }
    }

    setTableIndex = (key, value) => {

        let table_index = localStorage.getItem(`${process.env.REACT_APP_PREFIX}wd_datatable_index_${this.props.index}`)

        if(table_index){

            let _table_index = JSON.parse(table_index)

            _table_index[key] = value;

            localStorage.setItem(`${process.env.REACT_APP_PREFIX}wd_datatable_index_${this.props.index}`, JSON.stringify(_table_index));
        }else{

            let _table_index = {};

            _table_index[key] = value;

            localStorage.setItem(`${process.env.REACT_APP_PREFIX}wd_datatable_index_${this.props.index}`, JSON.stringify(_table_index));
        }
    }

    getTableIndex = (key) => {

        let table_index = localStorage.getItem(`${process.env.REACT_APP_PREFIX}wd_datatable_index_${this.props.index}`)

        if(table_index){

            table_index = JSON.parse(table_index)

            if(table_index.hasOwnProperty(key)){

                return table_index[key]
            }
        }
        
        return false;
    }

    removeTableIndex = (key) => {

        let table_index = localStorage.getItem(`${process.env.REACT_APP_PREFIX}wd_datatable_index_${this.props.index}`)

        if(table_index){

            table_index = JSON.parse(table_index)

            if(table_index.hasOwnProperty(key)){

                delete table_index[key]
            }

            localStorage.setItem(`${process.env.REACT_APP_PREFIX}wd_datatable_index_${this.props.index}`, JSON.stringify(table_index));
        }
        
        return false;
    }
}

const mapStateToProps = state => {
	return {
        paging: state.paging.paging
	}
}

export default connect(mapStateToProps, { Paging } )(DataTable);
