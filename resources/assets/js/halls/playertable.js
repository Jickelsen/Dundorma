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
            <strong>Name & Friend Code</strong>
          </Th>
          <Th column="nnid">
            <strong>NNID</strong>
          </Th>
        </Thead>
        {data.map((player, i) => {
           let playerName;
           if (player.name === this.props.owner.name) {
             playerName =
               <Td column="name">
                 <div>{player.name + ' (owner)'}<br/>
                 {player.friendcode}
                 </div>
               </Td>;
         } else {
             playerName =
               <Td column="name">
                 {player.name}
               </Td>;
         }
        return (
        <Tr key={i}>
            {playerName}
          <Td column="nnid">
            <a href={"https://miiverse.nintendo.net/users/"+player.nnid} target="_blank">{player.nnid}</a>
          </Td>
        </Tr>);
        })}
      </Table>);
  }
}
