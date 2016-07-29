import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import HallTable from './halls/halltable';
import HallAdder from './halls/halladder';
import HallViewer from './halls/hallviewer';

class Halls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.loadHallsFromServer('json/halls/all', 'halls');
    setInterval(() => this.loadHallsFromServer('json/halls/all', 'halls'), 10000);
    this.getUser();
  }
  getUser() {
    $.ajax({
      context: this,
      type: "GET",
      url: 'json/players/current',
      success: function(data) {
        if (data.id !== 0) {
          this.setState({...this.state, user: data});
          this.loadHallsFromServer('json/halls/owned', 'myHalls');
          setInterval(() => this.loadHallsFromServer('json/halls/owned', 'myHalls'), 10000);
        }
      },
    });
  }
  loadHallsFromServer(url, key) {
    $.get(url, function (json) {
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
  joinHall(hall) {
    $.ajax({
      context: this,
      type: "POST",
      url: 'json/halls/join',
      data: JSON.stringify({
        id: hall.id,
      }),
      success: function(data) {
        this.loadHallsFromServer('json/halls/all', 'halls');
      },
    });
  }
  leaveHall() {
    $.ajax({
      context: this,
      type: "GET",
      url: 'json/halls/leave',
      success: function(data) {
        this.loadHallsFromServer('json/halls/all', 'halls');
      },
    });
  }
  render() {
    let popup;
    if (this.props.children && this.state.halls) {
      popup = React.cloneElement(this.props.children, { hall: this.state.halls.find(hall => hall.idcode === this.props.params.hallId), joinHandler: this.joinHall.bind(this), leaveHandler: this.leaveHall.bind(this), user: this.state.user });
    }
    let usersHalls = <div></div>;
    let addButton = <div></div>;
    if (this.state.user && this.state.user.id != 0) {
      usersHalls =
      <div>
        <h3 className="col-xs-12">My Halls</h3>
        <div className="col-xs-12">
          <HallTable updateHandler={this.updateHall.bind(this)} deleteHandler={this.deleteHall.bind(this)} data={this.state.myHalls} editmode={true} />
        </div>
        <h3 className="col-xs-12">Other Halls</h3>
      </div>;
      addButton = <HallAdder addHandler={this.postNewHall.bind(this)}/>;
    }
    return (
      <div>
        {popup}
        <div className="row">
          <h2 className="col-xs-9">Gathering Hall</h2>
          <div className="col-xs-3">
            {addButton}
          </div>
        </div>
        <div className="row">
          {usersHalls}
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
    <Route path="/" component={Halls}>
      <Route path="/:hallId" component={HallViewer}/>
    </Route>
  </Router>,
  document.getElementById('halls')
);
