import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import HallTable from './halls/halltable';
import HallAdder from './halls/halladder';
import HallViewer from './halls/hallviewer';

class Halls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {halls:[], myHalls:[]};
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
          this.loadHallsFromServer('json/halls/others', 'halls');
          setInterval(() => this.loadHallsFromServer('json/halls/others', 'halls'), 10000);
        } else {
          this.loadHallsFromServer('json/halls/all', 'halls');
          setInterval(() => this.loadHallsFromServer('json/halls/all', 'halls'), 10000);
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
            onquest: newHall.onquest,
            full: newHall.full,
            private: newHall.private,
          }),
      success: function(data) {
        this.setState({...this.state, ...newHall});
        this.loadHallsFromServer('json/halls/owned', 'myHalls');
        this.loadHallsFromServer('json/halls/others', 'halls');
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
            onquest: newHall.onquest,
            full: newHall.full,
            pass: newHall.pass,
            private: newHall.private,
      }),
      success: function(data) {
        this.loadHallsFromServer('json/halls/owned', 'myHalls');
        this.loadHallsFromServer('json/halls/others', 'halls');
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
        // In case of guest functionality
        if (this.state.user.id !== 0) {
          this.loadHallsFromServer('json/halls/all', 'halls');
        } else {
          this.loadHallsFromServer('json/halls/others', 'halls');
        }
      },
    });
  }
  leaveHall() {
    $.ajax({
      context: this,
      type: "GET",
      url: 'json/halls/leave',
      success: function(data) {
        // In case of guest functionality
        if (this.state.user.id !== 0) {
          this.loadHallsFromServer('json/halls/all', 'halls');
        } else {
          this.loadHallsFromServer('json/halls/others', 'halls');
        }
      },
    });
  }
  render() {
    let popup;
    let hallInfo;
    if (this.props.children) {
      let attempt;
      let idParam = this.props.params.selParam.charAt(2) === "-";
      if (idParam) {
        attempt = this.state.halls.find(hall => hall.idcode === this.props.params.selParam);
      } else {
        attempt = this.state.halls.find(hall => hall.owner.name.toUpperCase() === this.props.params.selParam.toUpperCase());
      }
      if (attempt) {
        hallInfo = attempt;
      } else {
        if (idParam) {
          hallInfo = this.state.myHalls.find(hall => hall.idcode === this.props.params.selParam);
        } else {
          hallInfo= this.state.myHalls.find(hall => hall.owner.name.toUpperCase() === this.props.params.selParam.toUpperCase());
        }
      }
      if (hallInfo) {
        popup = React.cloneElement(this.props.children, { hall: hallInfo, joinHandler: this.joinHall.bind(this), leaveHandler: this.leaveHall.bind(this), user: this.state.user });
      }
    }
    let usersHalls = <div></div>;
    let addButton = <div></div>;
    if (this.state.user && this.state.user.id != 0) {
      addButton = <HallAdder addHandler={this.postNewHall.bind(this)}/>;
      usersHalls =
      <div>
        <h3 className="col-xs-9">My Hubs</h3>
        <div className="col-xs-3">
        {addButton}
      </div>
        <div className="col-xs-12">
          <HallTable updateHandler={this.updateHall.bind(this)} deleteHandler={this.deleteHall.bind(this)} data={this.state.myHalls} editmode={true} />
        </div>
        <h3 className="col-xs-12">Other Hubs</h3>
      </div>;
    } else {
      usersHalls =
      <div>
        <h3 className="col-xs-12">Hubs</h3>
      </div>;
    }
    return (
      <div>
        {popup}
        <div className="row">
          {usersHalls}
          <div className="col-xs-12">
            <HallTable data={this.state.halls} editmode={false} />
          </div>
        </div>
        <div><center><p align="center">Hubs are automatically deleted after two hours of inactivity</p></center></div>
        <div className="row">
          <div id="onquest-legend" className="col-xs-2 col-xs-offset-4"><center><p><i className="fa fa-sign-out" style={{align: "middle"}}></i> On Quest</p></center></div>
          <div id="full-legend" className="col-xs-2"><center><p><i className="fa fa-users" style={{align: "middle"}}></i> Full</p></center></div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Halls}>
      <Route path="/:selParam" component={HallViewer}/>
    </Route>
  </Router>,
  document.getElementById('halls')
);
