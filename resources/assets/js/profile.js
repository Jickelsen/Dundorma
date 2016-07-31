import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

const MAX_NAME_LENGTH = 10;
const MAX_NNID_LENGTH = 16;
const MIN_PASS_LENGTH = 6;

class ProfileEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name:'', email:'', emailConf:'', nnid:'', pass:'', passConf:'', currentMail:''};
    this.loadProfile();
  }
  loadProfile(url) {
    $.get('json/profile', function (json) {
      let state = {...this.state, currentMail: json.email};
      this.setState({...state, ...json});
    }.bind(this));
  }
  passValidate(pass, passConf) {
    if ((pass.length >= MIN_PASS_LENGTH && pass === passConf) || pass.length === 0 && passConf.length === 0)  {
      return true;
    } else {
      return false;
    }
  }
  emailValidate(email, emailConf) {
    if (email === emailConf || email === this.state.currentMail) {
      return true;
    } else {
      return false;
    }
  }
  lenCheck(value, length, minLength) {
    const len = value.length;
    return len >= minLength && len <= length;
  }
  stateChange (key, value) {
    if (key === 'name' && !this.lenCheck(value, MAX_NAME_LENGTH, 0)) {
      return;
    } else if (key === 'nnid' && !this.lenCheck(value, MAX_NNID_LENGTH, 0)) {
      return;
    }
    this.state[key] = value;
    this.forceUpdate();
  }
  updateProfile() {
    $.ajax({
      context: this,
      type: "POST",
      url: 'json/profile/update',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: $.param({
            name: this.state.name,
            email: this.state.emailConf,
            nnid: this.state.nnid,
            pass: this.state.pass,
      }),
      success: function(data) {
        window.location = "/";
      },
    });
  }
  render() {
    let ok = this.emailValidate(this.state.email, this.state.emailConf) && this.passValidate(this.state.pass,this.state.passConf) && this.lenCheck(this.state.name, MAX_NAME_LENGTH, 1) && this.lenCheck(this.state.nnid, MAX_NNID_LENGTH, 0);
    return (
      <div className="panel panel-default">
        <div className="panel-body no-margin">
          <h3>Edit Profile</h3>
          <div className={"form-group has-feedback " + (this.state.name.length > 0 ? "has-success" : "has-warning")}>
            <label>Hunter Name</label>
            <input className="form-control" type="text" value={this.state.name} onChange = {(e) => this.stateChange("name", e.target.value)}/>
            <span className={"glyphicon " + (this.state.name.length > 0 ? "" : "glyphicon-warning-sign") + " form-control-feedback"} aria-hidden="true"></span>
          </div>
          <div className={"form-group has-feedback " + (this.emailValidate(this.state.email, this.state.emailConf) ? "has-success" : "has-warning")}>
            <label>Email</label>
            <input className="form-control" type="text" value={this.state.email} onChange = {(e) => this.stateChange("email", e.target.value)}/>
            <label>Confirm Email</label>
            <input className="form-control" type="text" value={this.state.emailConf} onChange = {(e) => this.stateChange("emailConf", e.target.value)}/>
            <span className={"glyphicon " + (this.emailValidate(this.state.email, this.state.emailConf) ? "" : "glyphicon-warning-sign") + " form-control-feedback"} aria-hidden="true"></span>
          </div>
          <div className="form-group">
            <label>Nintendo Network ID</label>
            <input className="form-control" type="text" value={this.state.nnid} onChange = {(e) => this.stateChange("nnid", e.target.value)}/>
          </div>
          <div className={"form-group has-feedback " + (this.passValidate(this.state.pass, this.state.passConf) ? "has-success" : "has-warning")}>
            <label>Password (leave blank to keep)</label>
            <input className="form-control" type="text" value={this.state.pass} onChange = {(e) => this.stateChange("pass", e.target.value)}/>
            <label>Confirm Password</label>
            <input className="form-control" type="text" value={this.state.passConf} onChange = {(e) => this.stateChange("passConf", e.target.value)}/>
            <span className={"glyphicon " + (this.passValidate(this.state.pass, this.state.passConf) ? "" : "glyphicon-warning-sign") + " form-control-feedback"} aria-hidden="true"></span>
          </div>
        <button className='btn btn-primary pull-right' onClick={() => this.updateProfile(this.state)} disabled={!ok}> Save Changes </button>
        <a href="/"><button className="btn btn-default pull-right">Cancel</button></a>
      </div>
    </div>
    );
  }
}

ReactDOM.render(
  <ProfileEditor />,
  document.getElementById('profile')
);
