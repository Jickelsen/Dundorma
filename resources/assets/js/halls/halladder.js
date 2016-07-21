import React from 'react';
import Modal from 'react-bootstrap-modal';

export default class HallAdder extends React.Component {
  constructor(props) {
    super(props);
    let state = {name:'', desc:'', idCode:'', pass:'', private: false, open:false};
    if (this.props.editmode && this.props.hall) {
      this.state = {...state, ...this.props.hall};
    } else {
      this.state = state;
    }
  }
  componentWillReceiveProps(newProps) {
    if (!this.state.open) {
      this.setState({...this.state, ...this.props.hall});
    }
  }
  idFormat(value) {
    const len = value.length;
    if (len === 16) {

    }
    if (len === 2 || len === 7 || len === 12) {
      if (this.state.idCode.substr(this.state.idCode.length - 1) ==="-") {
        value = value.slice(0, -1);
      } else {
        value += "-";
      }
    }
    let isDashedNumber = /^([0-9]*-*)*$/.test(value);
    return [value, (isDashedNumber && len <= 17) ]; 
  }
  stateChange (key, value) {
    if (key === 'idCode') {
      const newVal = this.idFormat(value);
      if (newVal[1]) {
        value = newVal[0];
      } else {
        return;
      }
    }
    this.state[key] = value;
    this.forceUpdate();
  }
  render() {
    let closeModal = () => this.setState({...this.state, open: false });
    let saveAndClose = () => {
      this.props.addHandler(this.state);
      this.setState({...this.state, open: false });
    };
    let deleteAndClose = () => {
      this.props.deleteHandler(this.state);
      this.setState({...this.state, open: false });
    };
    let openButton;
    let saveButton;
    let deleteButton;
    if (this.props.editmode) {
      openButton = <button type='button' className='btn btn-secondary pull-right btn-sm' onClick={() => this.setState({...this.state, open: true }) }>Edit Hall</button>;
      saveButton = <button className='btn btn-primary' onClick={saveAndClose}> Save Changes </button>
      deleteButton = <button className='btn btn-danger pull-left' onClick={deleteAndClose}> Delete Hall </button>;
    } else {
      saveButton = <button className='btn btn-primary' onClick={saveAndClose}> Post Hall </button>
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
            <Modal.Title id='ModalHeader'>Post new Gathering Hall</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">

              <label>Name</label>
              <input className="form-control" type="text" value={this.state.name} onChange = {(e) => this.stateChange("name", e.target.value)}/>
              <label>Description</label>
              <input className="form-control" type="text" value={this.state.desc} onChange = {(e) => this.stateChange("desc", e.target.value)}/>
              <label>Hall-ID</label>
              <input className="form-control" type="text" value={this.state.idCode} onChange = {(e) => this.stateChange("idCode", e.target.value)}/>
              <label>Password</label>
              <input className="form-control" type="text" value={this.state.pass} onChange = {(e) => this.stateChange("pass", e.target.value)}/>
              <div className="checkbox">
                <label><input type="checkbox" checked={this.state.private} onChange = {(e) => this.stateChange("private", e.target.checked)}/>Private</label>
              </div>
              {/* <button className="col-xs-2" type="button" onClick={() => {this.props.addHandler(this.state);}}>Post Hall</button> */}
            </div>
          </Modal.Body>
          <Modal.Footer>
            {deleteButton}
            <Modal.Dismiss className='btn btn-default'>Cancel</Modal.Dismiss>
            {saveButton}
            {/* <button className='btn btn-primary' onClick={saveAndClose}>
            Post Hall
            </button> */}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
