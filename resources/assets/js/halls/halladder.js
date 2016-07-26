import React from 'react';
import Modal from 'react-bootstrap-modal';

const MAX_NAME_LENGTH = 64; 
const MAX_DESC_LENGTH = 100; 
export default class HallAdder extends React.Component {

  constructor(props) {
    super(props);
    let state = {name:'', desc:'', idcode:'', pass:'', private: false, open:false, editmode:false, viewmode:false};
    if (this.props.editmode && this.props.hall) {
      this.state = {...state, ...{...this.props.hall, editmode: true}};
    } else {
      this.state = state;
    }
  }
  componentDidMount() {
    if (this.props.params && this.props.params.hallId) {
      let state = this.props.getHall(this.props.params.hallId);
      this.setState({...state, ...{open:true, viewmode:true}});
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
    const isFilled = len === 4 || len === 0;
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
  lenCheck(value, length) {
    const len = value.length;
    return len > 0 && len <= length;
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
    } else if (key === 'name' && !this.lenCheck(value, MAX_NAME_LENGTH)) {
      return;
    } else if (key === 'desc' && !this.lenCheck(value, MAX_DESC_LENGTH)) {
      return;
    }
    this.state[key] = value;
    this.forceUpdate();
  }
  render() {
    let closeModal = () => this.setState({...this.state, open: false });
    let saveAndClose = () => {
      this.props.addHandler(this.state);
      this.setState({...this.state, ...{name:'', desc:'', idcode:'', pass:'', private: false, open:false}});
    };
    let deleteAndClose = () => {
      this.props.deleteHandler(this.state);
      this.setState({...this.state, open: false });
    };
    let openButton;
    let saveButton;
    let deleteButton;
    let ok = this.idValidate(this.state.idcode) && this.passValidate(this.state.pass) && this.lenCheck(this.state.name, MAX_NAME_LENGTH) && this.lenCheck(this.state.desc, MAX_DESC_LENGTH);
    if (this.state.editmode) {
      openButton = <a onClick={() => this.setState({...this.state, open: true }) }>Edit Hall</a>;
      saveButton = <button className='btn btn-primary' onClick={saveAndClose} disabled={!ok}> Save Changes </button>
      deleteButton = <button className='btn btn-danger pull-left' onClick={deleteAndClose}> Delete Hall </button>;
    } else if (this.state.viewmode) {

    } else {
      saveButton = <button className='btn btn-primary' onClick={saveAndClose} disabled={!ok}> Post Hall </button>
        openButton = <button style={{marginTop: 20}}  type='button' className='btn btn-primary pull-right' onClick={() => this.setState({...this.state, open: true }) }>Post New Hall</button>;
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
            <Modal.Title id='ModalHeader'>Hall Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={"form-group " + (this.idValidate(this.state.idcode) && !this.state.viewmode ? "has-success" : "has-warning")}>
              <label>Hall-ID</label>
              <input className="form-control" type="text" value={this.state.idcode} onChange = {(e) => this.stateChange("idcode", e.target.value)}/>
            </div>
            <div className={"form-group " + (this.state.name.length > 0 && !this.state.viewmode ? "has-success" : "has-warning")}>
              <label>Name</label>
              <input className="form-control" type="text" value={this.state.name} onChange = {(e) => this.stateChange("name", e.target.value)}/>
            </div>
            <div className={"form-group " + (this.state.desc.length > 0 && !this.state.viewmode ? "has-success" : "has-warning")}>
              <label>Description</label>
              <input className="form-control" type="text" value={this.state.desc} onChange = {(e) => this.stateChange("desc", e.target.value)}/>
            </div>
            <div className={"form-group " + (this.passValidate(this.state.pass) && !this.state.viewmode ? "has-success" : "has-warning")}>
              <label>Password</label>
              <input className="form-control" type="text" value={this.state.pass} onChange = {(e) => this.stateChange("pass", e.target.value)}/>
            </div>
            <div className="form-group">
              <div className="checkbox">
                <label><input type="checkbox" checked={this.state.private} onChange = {(e) => this.stateChange("private", e.target.checked)}/>Private</label>
              </div>
            </div>
            {/* <button className="col-xs-2" type="button" onClick={() => {this.props.addHandler(this.state);}}>Post Hall</button> */}
          </Modal.Body>
          <Modal.Footer>
            {deleteButton}
            <Modal.Dismiss className='btn btn-default'>Cancel</Modal.Dismiss>
            {saveButton}
          </Modal.Footer>
        </Modal>
      </div>
    );
}
}
