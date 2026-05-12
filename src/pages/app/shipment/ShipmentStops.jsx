import React, { Component } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

class ShipmentStops extends Component {

    render(){

        return (

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Stop Order</TableCell>
                            <TableCell>Stop Details</TableCell>
                            <TableCell>Planned Time</TableCell>
                            <TableCell>Events</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.shipment.stops.map((_stop, index) => {

                            return (
                                <TableRow key={`row_${index}`}>
                                    <TableCell>
                                        <strong>{index + 1}</strong>
                                    </TableCell>
                                    <TableCell>{_stop.stop_name}</TableCell>
                                    <TableCell>{_stop.stop_starting_at_date} {_stop.stop_starting_at_time}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

export default ShipmentStops
