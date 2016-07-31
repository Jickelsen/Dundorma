import React from 'react';
import { Table, Thead, Th, Tr, Td } from 'reactable';


import { Link } from 'react-router';

import HallAdder from './halladder';

export default class HallTable extends React.Component {
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
              <em>Name & Description</em>
            </Th>
            <Th column="idcode">
              <em>Hall ID</em>
            </Th>
            <Th column="pass">
              <em>Password</em>
            </Th>
            <Th column="players">
              <em>Players</em>
            </Th>
          </Thead>
          {data.map((hall, i) => {
          return (
          <Tr key={i}>
            <Td column="name">
              <div className = "row">
                <p className = "col-xs-10">
                  <Link to={`/${hall.idcode}`}>
                    <b>{hall.name}</b><br/>
                    <i>{hall.desc}</i>
                  </Link>
                </p>
                <div className = "col-xs-2">
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
            {/* <Td column="owner">
            {hall.owner.name}
            </Td> */}
            <Td column="players">
              <div>
                {hall.players.map((player, j) => {
                if (hall.owner && player.name === hall.owner.name) {
                  return <div key={j}><b>{player.name}</b><br/></div>;
                } else {
                  return <div key={j}>{player.name}<br/></div>;
                }
                })}
              </div>
            </Td>
          </Tr>);
          })}
        </Table>
      </div>
    );
  }
};
