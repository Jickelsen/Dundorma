import React from 'react';
import { Table, Thead, Th, Tr, Td } from 'reactable';

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
    return (
      <div>
        <Table className="table" sortable={false} >
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
            <Th column="updated">
              <em>Updated</em>
            </Th>
            <Th column="players">
              <em>Players</em>
            </Th>
          </Thead>
          {data.map((hall, i) => {
             const now = new Date();
             const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000); 
             const minutes = Math.floor((utc - Date.parse(hall.updated_at)) / 60000);
             let cellClass;
             let rowClass;
             if (hall && hall.full) {
               rowClass = 'row-full';
               cellClass = 'wrap-full';
             } else if (hall && hall.onquest) {
               rowClass = 'row-onquest';
               cellClass = 'wrap-onquest';
             }
          return (
             <Tr id="hall-table" onClick = {() => this.props.router.push('/' + hall.idcode) } key={i} className = {rowClass}>
               <Td column="name">
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
              {hall.idcode}
            </Td>
            <Td column="pass">
              {hall.pass}
            </Td>
            <Td column="players">
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
             </Tr>);
          })}
        </Table>
      </div>
    );
  }
}

export default withRouter(HallTable);
