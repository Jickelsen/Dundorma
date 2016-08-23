import React from 'react';
import Modal from 'react-bootstrap-modal';
import { withRouter } from 'react-router';
import DateTimeField from 'react-bootstrap-datetimepicker';

const MAX_NAME_LENGTH = 64;
const MAX_DESC_LENGTH = 100;
const MAX_PASS_LENGTH = 4;

class HallAdder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {name:'', desc:'', idcode:'', pass:'', onquest: false, full:false, scheduled: false, scheduled_for:'', open:false, editmode:false, viewmode:false};
  }
  componentDidMount() {
    if (this.props.editmode && this.props.hall) {
      console.log("hall is", this.props.hall);
      let state = this.state;
      state = {...state, ...{...this.props.hall, editmode: true}};
      console.log("Fired", this.props.hall.scheduled_for);
      if (this.props.hall.scheduled_for && this.props.hall.scheduled_for !== '') {
        console.log("Fired 2");
        state = {...state, scheduled: true};
      }
      this.setState(state);
    }
  }
  componentWillReceiveProps(newProps) {
    if (!this.state.open) {
      this.setState({...this.state, ...this.props.hall});
    }
  }
  idValidate(value) {
    const len = value.length;
    const isDashedNumber = /^([0-9]*-*)*$/.test(value);
    const isFilled = len === 17;
    return isDashedNumber && isFilled;
  }
  passValidate(value) {
    const len = value.length;
    const isNumber = /^([0-9]*)*$/.test(value);
    const isFilled = len === MAX_PASS_LENGTH || len === 0;
    return isNumber && isFilled;
  }
  idFormat(value) {
    const len = value.length;
    if (len === 2 || len === 7 || len === 12) {
      if (this.state.idcode.substr(this.state.idcode.length - 1) ==="-") {
        value = value.slice(0, -1);
      } else {
        value += "-";
      }
    }
    let isDashedNumber = /^([0-9]*-*)*$/.test(value);
    let isFilled = len === 17;
    return [value, (isDashedNumber && len <= 17)];
  }
  passFormat(value) {
    const len = value.length;
    const isNumber = /^([0-9]*)*$/.test(value);
    return isNumber && len <= 4;
  }
  lenCheck(value, length, minLength) {
    const len = value.length;
    return len >= minLength && len <= length;
  }
  dateChange (date) {
    this.state["scheduled_for"] = date;
    this.forceUpdate();
  }
  stateChange (key, value) {
    if (key === 'idcode') {
      const newVal = this.idFormat(value);
      if (newVal[1]) {
        value = newVal[0];
      } else {
        return;
      }
    } else if (key === 'pass' && !this.passFormat(value)) {
      return;
    } else if (key === 'name' && !this.lenCheck(value, MAX_NAME_LENGTH, 0)) {
      return;
    } else if (key === 'desc' && !this.lenCheck(value, MAX_DESC_LENGTH, 0)) {
      return;
    }
    this.state[key] = value;
    if (this.state.editmode && key === 'full') {
      this.props.addHandler(this.state);
    }
    if (this.state.editmode && key === 'onquest') {
      this.props.addHandler(this.state);
    }
    this.forceUpdate();
  }
  render() {
    let closeModal = () => this.setState({...this.state, open: false });
    let saveAndClose = () => {
      let permalink = this.state.idcode;
      if (permalink === "") {
        const s = this.state.scheduled_for.split(/[- :]/);
        permalink = this.state.name.replace(/\W+/g, '-').toLowerCase();
      }
      this.props.addHandler(this.state);
      this.setState({...this.state, ...{name:'', desc:'', idcode:'', pass:'', onquest: false, full: false, scheduled: false, scheduled_for:'', open:false}});
      this.props.router.push('/' + permalink);};
    let save = () => {
      this.props.addHandler(this.state);
    };
    let deleteAndClose = () => {
      this.props.deleteHandler(this.state);
      this.setState({...this.state, open: false });
    };
    let openButton;
    let footer;
    let ok = (this.idValidate(this.state.idcode) || this.state.scheduled) && this.passValidate(this.state.pass) && this.lenCheck(this.state.name, MAX_NAME_LENGTH, 1) && this.lenCheck(this.state.desc, MAX_DESC_LENGTH, 1);
    let datePicker;
    let idSection;
      console.log("date is", this.state.scheduled_for);
      //console.log("props are", this.props);
    if (this.state.scheduled) {
      if (this.state.scheduled_for !== "") {
        datePicker = <DateTimeField onChange={this.dateChange.bind(this)} dateTime={this.state.scheduled_for} />;
      } else {
        datePicker = <DateTimeField onChange={this.dateChange.bind(this)} />;
      }
    } else {
      idSection =
        <div className={"form-group has-feedback " + (this.idValidate(this.state.idcode) && !this.state.viewmode ? "has-success" : "has-warning")}>
          <label>Hub-ID*</label>
          <input className="form-control" type="text" value={this.state.idcode} onChange = {(e) => this.stateChange("idcode", e.target.value)}/>
          <span className={"glyphicon " + (this.idValidate(this.state.idcode) && !this.state.viewmode ? "" : "glyphicon-warning-sign") + " form-control-feedback"} aria-hidden="true"></span>
        </div>;
    }
    if (this.state.editmode) {

      openButton = <button className="btn-sm btn-primary" onClick={() => this.setState({...this.state, open: true }) }>Edit</button>;
      footer =
      <div className = "row">
        <div className = "col-xs-3">
          <button className="btn btn-danger pull-left" onClick={deleteAndClose}> Delete </button>;
        </div>

        <div className="form-group col-xs-5" id="roomCheckboxes">
          <div className="row">
          <label className="col-xs-6"><input type="checkbox" checked={this.state.full} onChange = {(e) => this.stateChange("full", e.target.checked)}/> Full</label>
          <label className="col-xs-6"><input type="checkbox" checked={this.state.onquest} onChange = {(e) => this.stateChange("onquest", e.target.checked)}/> On Quest</label>
          </div>
        </div>
        <div className="col-xs-4">
          <Modal.Dismiss className="btn btn-default">Cancel</Modal.Dismiss>

          <button className='btn btn-primary' onClick={save} disabled={!ok}> Save </button>
        </div>
      </div>;
    } else if (this.state.viewmode) {

    } else {
      footer =
      <div className = "row">
        <div className = "col-xs-5 col-xs-offset-7"><button className='btn btn-primary' onClick={saveAndClose} disabled={!ok}> Post Hub </button>
        </div>
      </div>;
      openButton =
          <button type='button' className='btn btn-primary pull-right' onClick={() => this.setState({...this.state, open: true }) }>Post New Hub or Event</button>;
    }
    return (
      <div>
        {openButton}
        <Modal
          show={this.state.open}
          onHide={closeModal}
          aria-labelledby="ModalHeader"
        >
          <Modal.Header closeButton>
            <Modal.Title id='ModalHeader'>Hunt Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <div className="checkbox">
                <label><input type="checkbox" checked={this.state.scheduled} onChange = {(e) => this.stateChange("scheduled", e.target.checked)}/>Upcoming Event</label>
                {datePicker}
              </div>
            </div>
            {idSection}
            <div className={"form-group has-feedback " + (this.state.name.length > 0 && !this.state.viewmode ? "has-success" : "has-warning")}>
              <label>Title*</label>
              <input className="form-control" type="text" value={this.state.name} onChange = {(e) => this.stateChange("name", e.target.value)}/>
              <span className={"glyphicon " + (this.state.name.length > 0 && !this.state.viewmode ? "" : "glyphicon-warning-sign") + " form-control-feedback"} aria-hidden="true"></span>
            </div>
            <div className={"form-group has-feedback " + (this.state.desc.length > 0 && !this.state.viewmode ? "has-success" : "has-warning")}>
              <label>Description*</label>
              <input className="form-control" type="text" value={this.state.desc} onChange = {(e) => this.stateChange("desc", e.target.value)}/>
              <span className={"glyphicon " + (this.state.desc.length > 0 && !this.state.viewmode ? "" : "glyphicon-warning-sign") + " form-control-feedback"} aria-hidden="true"></span>
            </div>
            <div className={"form-group has-feedback " + (this.passValidate(this.state.pass) && !this.state.viewmode ? "has-success" : "has-warning")}>
              <label>Passcode</label>
              <input className="form-control" type="text" value={this.state.pass} onChange = {(e) => this.stateChange("pass", e.target.value)}/>
              <span className={"glyphicon " + (this.passValidate(this.state.pass) && !this.state.viewmode ? "" : "glyphicon-warning-sign") + " form-control-feedback"} aria-hidden="true"></span>
            </div>

          </Modal.Body>
          <Modal.Footer>
            {footer}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default withRouter(HallAdder);
