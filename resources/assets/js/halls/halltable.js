import React from 'react';
import { Table, Thead, Th, Tr, Td } from 'reactable';

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
        <Table className="table" sortable={true} >
          <Thead>
            <Th column="name">
              <strong>Name</strong>
            </Th>
            <Th column="desc">
              <em>Description</em>
            </Th>
            <Th column="idcode">
              <em>Hall ID</em>
            </Th>
            <Th column="pass">
              <em>Password</em>
            </Th>
            {/* <Th column="owner">
            <em>Owner</em>
            </Th> */}
            <Th column="players">
              <em>Players</em>
            </Th>
          </Thead>
          {data.map((hall, i) => {
          return (
          <Tr key={i}>
            <Td column="name">
              <div>
                {hall.name}
                {editButton(this.props.editmode, hall, this.props.updateHandler, this.props.deleteHandler)}
              </div>
            </Td>
            <Td column="desc">
              {hall.desc}
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
                if (player.name === hall.owner.name) {
                const name = player.name;
                return (<b key={j}>{name}</b>);
                } else {
                return (player.name);
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
