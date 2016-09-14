import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import HallTable from './halls/halltable';
import HallAdder from './halls/halladder';
import HallViewer from './halls/hallviewer';
import Hunters from './hunters';

import io from 'socket.io-client';


var socket = io('http://0.0.0.0:3000');
class Halls extends React.Component {
  constructor(props) {
    socket.on("chat-channel:App\\Events\\ChatEvent", (message) => {
      console.log("websocket message is", message);
      this.setState({...this.state, chatMessage: message.data.chat_data});
    });
    socket.on("chatchannel:chatevent", (message) => {
      console.log("other websocket message is", message);
      this.setState({...this.state, chatMessage2: message});
    });
    super(props);
    this.state = {halls:[], myHalls:[], scheduledHalls:[], filter:"", chatMessage:""};
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
          this.loadHallsFromServer('json/halls/scheduled', 'scheduledHalls');
          setInterval(() => this.loadHallsFromServer('json/halls/scheduled', 'scheduledHalls'), 30000);
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
            scheduled_for: newHall.scheduled_for,
            pass: newHall.pass,
            onquest: newHall.onquest,
            full: newHall.full,
            private: newHall.private,
          }),
      success: function(data) {
        this.setState({...this.state, ...newHall});
        this.loadHallsFromServer('json/halls/owned', 'myHalls');
        this.loadHallsFromServer('json/halls/others', 'halls');
        this.loadHallsFromServer('json/halls/scheduled', 'scheduledHalls');
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
            scheduled_for: newHall.scheduled_for,
            onquest: newHall.onquest,
            full: newHall.full,
            pass: newHall.pass,
            private: newHall.private,
      }),
      success: function(data) {
        this.loadHallsFromServer('json/halls/owned', 'myHalls');
        this.loadHallsFromServer('json/halls/others', 'halls');
        this.loadHallsFromServer('json/halls/scheduled', 'scheduledHalls');
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
          this.loadHallsFromServer('json/halls/scheduled', 'scheduledHalls');
        } else {
          this.loadHallsFromServer('json/halls/others', 'halls');
          this.loadHallsFromServer('json/halls/scheduled', 'scheduledHalls');
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
      let idParam = this.props.params.selParam.charAt(2) === "-" && this.props.params.selParam.length == 17;
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
      if (!hallInfo) {
        hallInfo = this.state.scheduledHalls.find(hall => 
          hall.name.replace(/\W+/g, '-').toLowerCase() === this.props.params.selParam.toLowerCase()
        );
      }
      if (hallInfo) {
        popup = React.cloneElement(this.props.children, { hall: hallInfo, joinHandler: this.joinHall.bind(this), leaveHandler: this.leaveHall.bind(this), user: this.state.user });
      }
    }
    let usersHalls = <div></div>;
    let addButton = <div></div>;
    let filterField = <div className="col-xs-3 form-inline">
      <div>
      {/* <label className="">Filter</label> */}
      <input type="text" className="form-control pull-right" placeholder="Filter" value={this.state.filter} onChange = {(e) => {this.state["filter"]= e.target.value; this.forceUpdate();}}/></div></div>;
    if (this.state.user && this.state.user.id != 0) {
      addButton = <HallAdder addHandler={this.postNewHall.bind(this)}/>;
      usersHalls =
        <div>
          <h3 className="col-xs-9">My Hubs & Events</h3>
          <div className="col-xs-3">
            {addButton}
          </div>
          <div className="col-xs-12">
            <HallTable updateHandler={this.updateHall.bind(this)} deleteHandler={this.deleteHall.bind(this)} data={this.state.myHalls} editmode={true} />
          </div>
          <div>
            <h3 className="col-xs-9">Other Hubs</h3>
            {filterField}
          </div>
        </div>;
    } else {
      usersHalls =
      <div>
        <h3 className="col-xs-9">Hubs</h3>
        {filterField}
      </div>;
    }
    return (
      <div>
        {popup}
        <div className="row">
          {usersHalls}
          <div className="col-xs-12">
            <HallTable data={this.state.halls} editmode={false} filter={this.state.filter} />
          </div>
          <h3 className="col-xs-12">Upcoming Events</h3>
          <div className="col-xs-12">
            <HallTable data={this.state.scheduledHalls} editmode={false} scheduled={true} filter={this.state.filter} />
          </div>
        </div>
        <div><center><p align="center">Hubs are automatically deleted after four hours of inactivity. All dates and times are given in your local timezone.</p></center></div>
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
    <Route path="/hunters" component={Hunters}>
    </Route>
    <Route path="/" component={Halls}>
      <Route path="/:selParam" component={HallViewer}/>
    </Route>
  </Router>,
  document.getElementById('halls')
);
