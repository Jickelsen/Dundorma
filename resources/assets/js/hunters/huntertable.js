import React from 'react';
import { Table, Thead, Th, Tr, Td } from 'reactable';
import { Link } from 'react-router';
import * as moment from 'moment';

export default class HunterTable extends React.Component {
  render() {
    let data = [];
    if (this.props.players) {
      data = this.props.players;
    }
    return (
      <Table className="table" sortable={true} >
        <Thead>
          <Th column="name">
            <strong>Name</strong>
          </Th>
          <Th column="friendcode">
            <strong>3DS Friend Code</strong>
          </Th>
          <Th column="nnid">
            <strong>NNID</strong>
          </Th>
          <Th column="halls">
            <strong>Active Hubs and Events</strong>
          </Th>
        </Thead>
        {data.map((player, i) => {
        return (
        <Tr key={i}>
          <Td column="name">
            {player.name}
          </Td>
          <Td column="friendcode">
            {player.friendcode}
          </Td>
          <Td column="nnid">
            <a href={"https://miiverse.nintendo.net/users/"+player.nnid} target="_blank">{player.nnid}</a>
          </Td>
          <Td column="halls">
            <div>
              {player.halls.map((hall, j) => {
                 let permalink = hall.idcode;
                 if (hall.scheduled_for !== '') {
                   const date = new Date();
                   const scheduledFor =  moment.default(hall.scheduled_for).format("YYYY-MM-DD HH:mm:ss");
                   const s = scheduledFor.split(/[- :]/);
                   const ds = new Date(Date.UTC(s[0], s[1]-1, s[2], s[3], s[4], s[5])).toString();
                   const dateString = ds.substring(0, ds.lastIndexOf(":"));
                   console.log("Scheduled for", dateString);
                   permalink = hall.name.replace(/\W+/g, '-').toLowerCase();
                   return <div key={j} className="row">
              <a className="col-md-7" href={permalink} target="_blank"><b>{hall.name}</b></a>
                     <div className="col-md-5">{dateString}</div>
                   </div>;
                 }
                 return <div key={j}><a href={permalink} target="_blank"><b>{hall.name}</b></a><br/></div>;
               })}
            </div>
          </Td>
        </Tr>);
        })}
      </Table>);
  }
}
