import React from 'react';
import { Table, Thead, Th, Tr, Td } from 'reactable';
import { Link } from 'react-router';

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
            <strong>Active Hubs</strong>
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
                return <div key={j}><a href={hall.idcode} target="_blank"><b>{hall.name}</b></a><br/></div>;
                })}
              </div>
            </Td>
        </Tr>);
        })}
      </Table>);
  }
}
