import React, { Component } from 'react';

import DataTable from 'components/wd/data_table/DataTable';
import WdForm from 'components/wd/form/WdForm';

import Btn from 'components/Btn';

import Edit from '@mui/icons-material/Edit';

import Api from 'api/Api';

import Main from 'components/Main';

import LayoutHelper from 'helpers/LayoutHelper'

class UsersList extends Component {

    constructor(props) {
        super();
        this.state = {

            error_message: '',
            success_message: '',

            user: false,

            account_token: false,

            do_reload: false,

            row_id: false,

            add_new: false
        }
    }

    componentDidMount = () => {

        let account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        let user = localStorage.getItem(import.meta.env.VITE_ACCOUNT_USER);
        
        if(account_token){
            
            this.setState({account_token: account_token, user: JSON.parse(user)})
        }
    }

    render(){

        return (

            <Main
                page="users"
                active_page="users"
                title="Users"
                error_message={this.state.error_message}
                success_message={this.state.success_message}

                title_action={[{key: 'users_add', label: 'Add User', onClick: () => {

                    this.setState({add_new: true})
                }}]}
            >

                <DataTable
                    index="users"
                    label="Users"

                    active_row={this.state.active_row}

                    do_reload={this.state.do_reload}
                    relaodDone={() => {

                        this.setState({do_reload: false});
                    }}

                    columns={[
                        {name: 'First Name', column: 'first_name', sortable: true},
                        {name: 'Last Name', column: 'last_name', sortable: true},
                        {name: 'Email', column: 'email', sortable: true},
                        {name: 'Mobile', column: 'contact', sortable: true},
                        {name: 'Created On', column: 'added_on_formatted', sortable: true, hide_search: true}
                    ]}

                    row_actions={(row, row_index) => {

                        return (

                            <div className="hoverable-action">
                                <div className="align-start">

                                    <Btn size="small" color="primary" startIcon={<Edit style={{fontSize: 15}} />} onClick={() => {

                                        this.setState({row_id: row.row_id}, () => {

                                            this.setState({add_new: true})
                                        })
                                    }}>
                                        View
                                    </Btn>
                                </div>
                            </div>
                        )
                    }}

                    default_sort_by="added_on"

                    api_url="app/users"

                    account_token={this.state.account_token}
                    
                    row_id="row_id"
                />

                <WdForm                        
                    drawer={true}
                    open={this.state.add_new}
                    position="bottom"
                    size="medium"
                    
                    title='Sub User'
                    back_label="Cancel"
        
                    submit_url='app/users/save'
                    data_url='app/users/single'
        
                    onSubmit={(result) => {
        
                        this.setState({add_new: false, row_id: false, do_reload: true})
                    }}
                    onBack={() => {
        
                        this.setState({add_new: false, row_id: false})
                    }}

                    post_fields={[
                        {key: 'users_of', value: this.state.user.row_id}
                    ]}
                
                    row_id={this.state.row_id}
                    id="row_id"
                    title_field="first_name"
                    updated_on="updated_on_formatted"
                                            
                    fields={{
                        rows: [
                            {
                                fields: [
                                    {key: 'first_name', type: 'input', name: 'first_name', label: 'First Name', validations: ['r'], span: 6},
                                    {key: 'last_name', type: 'input', name: 'last_name', label: 'Last Name', validations: ['r'], span: 6},
                                ]
                            },
                            {
                                fields: [
                                    {key: 'email', type: 'input', name: 'email', label: 'Email', validations: ['r', 'email', 'unique|app/users/unique/email'], span: 6},
                                    {key: 'contact', type: 'input', name: 'contact', label: 'Mobile', validations: ['r', 'number', 'min-10', 'unique|app/users/unique/mobile'], span: 6},
                                ]
                            },
                            {
                                fields: [
                                    {key: 'password', type: 'input', name: 'password', label: 'Passwrd', validations: ['r', 'min-6'], span: 6},
                                ]
                            },
                        ]
                    }}
                />
            </Main>
            
        )
    }
}

export default UsersList;
