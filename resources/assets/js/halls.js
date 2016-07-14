import React from 'react';
import ReactDOM from 'react-dom';

import HallTable from './halls/halltable';
import HallAdder from './halls/halladder';
//Will this work?
import 'whatwg-fetch';

class Halls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {halls:[]};
  }
  loadHallsFromServer(url, key) {
    this.serverRequest = $.get(url, function (json) {
      let newState = {...this.state};
      newState[key] = json;
      this.setState(newState);
      console.log('parsed json', json);
      console.log('state', this.state);
    }.bind(this));
    // fetch(url, {credentials: 'same-origin'})
    //   .then((response) => {
    //     return response.json();
    //   }).then((json) => {
    //    let newState = {...this.state};
    //     newState[key] = json;
    //     this.setState(newState);
    //     console.log('parsed json', json);
    //     console.log('state', this.state);
    //   }).catch((ex) => {
    //     console.log('parsing failed', ex);
    //   });
  }
  postNewHall(newHall) {
    $.ajax({
      type: "POST",
      url: 'json/halls/create',
      data: newHall,
      data: JSON.stringify({
            name: newHall.name,
            desc: newHall.desc,
            idcode: newHall.idcode,
            pass: newHall.pass,
            private: newHall.private,
          }),
      success: console.log("ok"),
      error: console.log("fail"),
      dataType: 'json'
    });
    // fetch('json/halls/create', {
    //   method: 'POST',
    //   credentials: 'same-origin',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     name: newHall.name,
    //     desc: newHall.desc,
    //     idcode: newHall.idcode,
    //     pass: newHall.pass,
    //     players: newHall.players,
    //     private: newHall.private,
    //   }),
    // });
  }
  componentDidMount() {
    this.loadHallsFromServer('json/halls/all', 'halls');
    //this.setState({...this.state, myHalls: this.state.filter((hall) => hall.owner.name ==)});
    this.loadHallsFromServer('json/halls/owned', 'myHalls');
    setInterval(() => this.loadHallsFromServer('json/halls/all', 'halls'), 10000);
    setInterval(() => this.loadHallsFromServer('json/halls/owned', 'myHalls'), 10000);
  }
  render() {
    return (
      <div>
        <div className="row">
          <h2 className="col-xs-9">Gathering Hall</h2>
          <div className="col-xs-3">
            <HallAdder addHandler={this.postNewHall}/>
          </div>
        </div>
        <hr/>
        <div className="row">
          <h3 className="col-xs-12">My Halls</h3>
          <div className="col-xs-12">
            <HallTable data={this.state.myHalls} />
          </div>
          <h3 className="col-xs-12">Other Halls</h3>
          <div className="col-xs-12">
            <HallTable data={this.state.halls} />
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Halls />,
  document.getElementById('halls')
);
