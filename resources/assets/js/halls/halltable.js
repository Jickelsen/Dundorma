import React from 'react';
import { Table, Thead, Th, Tr, Td, unsafe } from 'reactable';

import { withRouter } from 'react-router';

import HallAdder from './halladder';

class HallTable extends React.Component {
  render() {
    let data = [];
    if (this.props.data) {
      data = this.props.data;
    }
    let editButton = function(editmode, halldata, updateHall, deleteHall) {
      if (editmode) {
        return <HallAdder editmode={true} addHandler={updateHall} deleteHandler={deleteHall} hall={halldata}/>;
      } else {
        return <div></div>;
      }
    };
    let scheduledHead;
    if (this.props.scheduled || this.props.editmode) {
      scheduledHead = <Th column="scheduled">
        <em>Starts At</em>
      </Th>;
    } else {
      scheduledHead = <Th column="updated">
        <em>Updated</em>
      </Th>;
    }
    return (
      <div>
        <Table className="table" sortable={false} filterable={['name', 'players']} filterBy={this.props.filter} hideFilterInput >
          <Thead>
            <Th column="name">
              <em>Title & Description</em>
            </Th>
            <Th column="idcode">
              <em>Hall ID</em>
            </Th>
            <Th column="pass">
              <em>Passcode</em>
            </Th>
            {scheduledHead}
            <Th column="players">
              <em>Players</em>
            </Th>
          </Thead>
          {data.map((hall, i) => {
             const now = new Date();
             const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000).getTime();
             // Solution from http://stackoverflow.com/questions/3075577/convert-mysql-datetime-stamp-into-javascripts-date-format
             // Split timestamp into [ Y, M, D, h, m, s ]
             const t = hall.updated_at.split(/[- :]/);
             // Apply each element to the Date function
             const d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]).getTime();
             const minutes = Math.floor((utc - d) / 60000);

             let ds;
             let scheduledFor = "";
             if (hall.scheduled_for && hall.scheduled_for !== "") {
               const s = hall.scheduled_for.split(/[- :]/);
               ds = new Date(Date.UTC(s[0], s[1]-1, s[2], s[3], s[4], s[5])).toString();
               scheduledFor = ds.substring(0, ds.lastIndexOf(":"));
             }

             let cellClass;
             let rowClass;
             if (hall && hall.full) {
               rowClass = 'row-full';
               cellClass = 'wrap-full';
             } else if (hall && hall.onquest) {
               rowClass = 'row-onquest';
               cellClass = 'wrap-onquest';
             }
             let scheduledBody;
             if (hall.scheduled_for !== "") {
               scheduledBody = <Td column="scheduled">
                {scheduledFor}
               </Td>;
             }
             let permalink;
             let idcode = hall.idcode;
             if (hall.idcode !== "") {
               permalink = idcode;
             } else {
               permalink = hall.name.replace(/\W+/g, '-').toLowerCase();
               idcode = "None yet";
             }
          return (
             <Tr id="hall-table" onClick = {() => this.props.router.push('/' + permalink) } key={i} className = {rowClass}>
               <Td column="name" value={unsafe(hall.name + ' ' + hall.desc)} >
                 <div>
                   <p className = "col-xs-9">
                     <b>{hall.name}</b><br/>
                     <i>{hall.desc}</i>
                   </p>
                   <div onClick={(e) => e.stopPropagation()} className = "col-xs-3">
                     {editButton(this.props.editmode, hall, this.props.updateHandler, this.props.deleteHandler)}
                   </div>
                 </div>
               </Td>
               <Td column="idcode">
              {idcode}
            </Td>
            <Td column="pass">
              {hall.pass}
            </Td>
            <Td column="players" value={unsafe(hall.players.map((player) =>
                player.name
              ).join(","))} >
              <div className = {cellClass}>
                <div className = "row inner">
                  {hall.players.map((player, j) => {
                     if (hall.owner && player.name === hall.owner.name) {
                       return <div key={j}><b>{player.name}</b><br/></div>;
                     } else {
                       return <div key={j}>{player.name}<br/></div>;
                     }
                   })}
                </div>
              </div>
            </Td>
            <Td column="updated">
              {minutes + "m ago"}
            </Td>
            {scheduledBody}
             </Tr>);
          })}
        </Table>
      </div>
    );
  }
}

export default withRouter(HallTable);
