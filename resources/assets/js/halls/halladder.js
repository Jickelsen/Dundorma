import React from 'react';
import Modal from 'react-bootstrap-modal';

export default class HallAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name:'', desc:'', idcode:'', pass:'', private: false, open:false};
  }
  stateChange (key, value) {
    console.log("Got " + key + " as " + value);
    this.state[key] = value;
    this.forceUpdate();
  }
  render() {
    let closeModal = () => this.setState({...this.state, open: false });
    let saveAndClose = () => {
      this.props.addHandler(this.state);
      this.setState({...this.state, open: false });
    };
    return (
      <div>
        <button style={{marginTop: 20}}  type='button' className='btn btn-primary pull-right' onClick={() => this.setState({...this.state, open: true }) }>Post New Hall</button>
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
              <input className="form-control" type="text" value={this.state.idcode} onChange = {(e) => this.stateChange("idcode", e.target.value)}/>
              <label>Password</label>
              <input className="form-control" type="text" value={this.state.pass} onChange = {(e) => this.stateChange("pass", e.target.value)}/>
              <div class="checkbox">
                <label><input type="checkbox" value=""/>Private</label>
              </div>
              {/* <button className="col-xs-2" type="button" onClick={() => {console.log("add state", this.state); this.props.addHandler(this.state);}}>Post Hall</button> */}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Dismiss className='btn btn-default'>Cancel</Modal.Dismiss>
            <button className='btn btn-primary' onClick={saveAndClose}>
              Post Hall
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
