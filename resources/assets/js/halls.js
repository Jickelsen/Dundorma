import React from 'react';
import ReactDOM from 'react-dom';

// import HallTable from './halls/halltable';
// import HallAdder from './halls/halladder';
// Will this work?
import 'whatwg-fetch';

class Halls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {halls:[]};
  }
  loadHallsFromServer() {
    fetch('json/halls/all')
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        this.setState({halls: json});
        console.log('parsed json', json);
      }).catch(function(ex) {
        console.log('parsing failed', ex);
      });
  }
  postNewHall(newHall) {
    fetch('json/halls/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newHall.name,
        desc: newHall.desc,
        idCode: newHall.idCode,
        pass: newHall.pass,
        players: newHall.players,
        private: newHall.private,
      })
    });
  }
  //componentDidMount() {
    // this.loadCommentsFromServer();
    // setInterval(this.loadhallsFromServer.bind(this), 3000);
  //}
  render() {
    return (
      <div className="row">
        <div className="row">
          <h2 className="col-sm-8">Gathering Hall</h2>
          {/*   <div className="col-sm-4"><HallAdder addFn={postNewHall}/></div> */}
        </div>
        <div className="row">
          {/* <HallTable /> */}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Halls />,
  document.getElementById('halls')
);
