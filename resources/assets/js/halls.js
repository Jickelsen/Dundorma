import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';

import HallTable from './halls/halltable';
import HallAdder from './halls/halladder';
import HallViewer from './halls/hallviewer';
//Will this work?
import 'whatwg-fetch';

class Halls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  loadHallsFromServer(url, key) {
    this.serverRequest = $.get(url, function (json) {
      let newState = {...this.state};
      newState[key] = json;
      this.setState(newState);
    }.bind(this));
  }
  postNewHall(newHall) {
    $.ajax({
      context: this,
      type: "POST",
      url: 'json/halls/create',
      data: JSON.stringify({
            name: newHall.name,
            desc: newHall.desc,
            idcode: newHall.idcode,
            pass: newHall.pass,
            private: newHall.private,
          }),
      success: function(data) {
        this.setState({...this.state, ...newHall});
      },
    });
  }
  updateHall(newHall) {
    $.ajax({
      context: this,
      type: "POST",
      url: 'json/halls/update',
      data: JSON.stringify({
            id: newHall.id,
            name: newHall.name,
            desc: newHall.desc,
            idcode: newHall.idcode,
            pass: newHall.pass,
            private: newHall.private,
      }),
      success: function(data) {
        this.loadHallsFromServer('json/halls/owned', 'myHalls');
      },
    });
  }
  deleteHall(hall) {
    $.ajax({
      context: this,
      type: "POST",
      url: 'json/halls/delete',
      data: JSON.stringify({
        id: hall.id,
      }),
      success: function(data) {
        this.loadHallsFromServer('json/halls/owned', 'myHalls');
      },
    });
  }
  getHall(hallID) {
    let index = this.state.halls.map((e) => { return e.idcode; }).indexOf(hallID);
    return this.state.halls[index];
  }
  componentDidMount() {
    this.loadHallsFromServer('json/halls/all', 'halls');
    //this.setState({...this.state, myHalls: this.state.filter((hall) => hall.owner.name ==)});
    this.loadHallsFromServer('json/halls/owned', 'myHalls');
    let popup
    setInterval(() => this.loadHallsFromServer('json/halls/all', 'halls'), 10000);
    setInterval(() => this.loadHallsFromServer('json/halls/owned', 'myHalls'), 10000);
  }
  render() {
    let popup;
    if (this.props.children && this.state.halls) {
      popup = React.cloneElement(this.props.children, { getHall: this.getHall.bind(this) });
    }
    return (
      <div>
        {popup}
        <div className="row">
          <h2 className="col-xs-9">Gathering Hall</h2>
          <div className="col-xs-3">
            <HallAdder addHandler={this.postNewHall.bind(this)}/>
          </div>
        </div>
        <hr/>
        <div className="row">
          <h3 className="col-xs-12">My Halls</h3>
          <div className="col-xs-12">
            <HallTable updateHandler={this.updateHall.bind(this)} deleteHandler={this.deleteHall.bind(this)} data={this.state.myHalls} editmode={true} />
          </div>
          <h3 className="col-xs-12">Other Halls</h3>
          <div className="col-xs-12">
            <HallTable data={this.state.halls} editmode={false} />
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/halls" component={Halls}>
      <Route path="/:hallId" component={HallViewer}/>
    </Route>
  </Router>,
  document.getElementById('halls')
);
