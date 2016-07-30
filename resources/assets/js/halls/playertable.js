import React from 'react';
import { Table, Thead, Th, Tr, Td } from 'reactable';

export default class PlayerTable extends React.Component {
  render() {
    let data = [];
    if (this.props.players) {
      data = this.props.players;
    }
    return (
      <Table className="table" sortable={false} >
        <Thead>
          <Th column="name">
            <strong>Name</strong>
          </Th>
          <Th column="nnid">
            <strong>NNID</strong>
          </Th>
        </Thead>
        {data.map((player, i) => {
        return (
        <Tr key={i}>
          <Td column="name">
              {player.name}
          </Td>
          <Td column="nnid">
            <a href={"https://miiverse.nintendo.net/users/"+player.nnid} target="_blank">{player.nnid}</a>
          </Td>
        </Tr>);
        })}
      </Table>);
  }
}
