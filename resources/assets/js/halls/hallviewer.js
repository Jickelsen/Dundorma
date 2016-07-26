import React from 'react';
import Modal from 'react-bootstrap-modal';
import PlayerTable from './playertable';

export default class HallViewer extends React.Component {
  constructor(props) {
    super(props);
    let state = {open:false};
    this.state = {...state, ...{...this.props.hall}};
  }
  getNewHall(hallId) {
      let state = this.props.getHall(hallId);
      this.setState({...state, ...{open:true}});
  }
  componentDidMount() {
    if (this.props.params && this.props.params.hallId) {
      this.getNewHall(this.props.params.hallId);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params !== this.props.params) {
      this.getNewHall(nextProps.params.hallId);
    }
  }
  render() {
    let closeModal = () => this.setState({...this.state, open: false });
    // let joinHall = () => this.setState({...this.state, open: false });
    // let joined =  CHECK THAT PLAYER IS NOT ALREADY IN HALL
    return (
      <div>
        <Modal
          show={this.state.open}
          onHide={closeModal}
          aria-labelledby="ModalHeader"
        >
          <Modal.Header closeButton>
            <Modal.Title id='ModalHeader'>Hall Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-sm-4">
                <p>
                  <label>Hall-ID</label><br/>
                  <b>{this.state.idcode}</b>
                </p>
                <p>
                  <label>Name<br/></label><br/>
                  <b>{this.state.name}</b>
                </p>
                <p>
                  <label>Description<br/></label><br/>
                  <b>{this.state.desc}</b>
                </p>
                <p>
                  <label>Password<br/></label><br/>
                  <b>{this.state.pass}</b>
                </p>
                <p>
                  <label><input type="checkbox" checked={this.state.private} disabled />Private</label>
                </p>
              </div>
              <div className="col-sm-7 col-sm-offset-1">
                <p><label>Players</label></p>
                <PlayerTable players={this.state.players} />
              </div>
            </div>
              <label>Direct Link</label><input className="form-control" type="text" defaultValue={"http://0.0.0.0/"+this.state.idcode} />
          </Modal.Body>
          <Modal.Footer>
            <Modal.Dismiss className='btn btn-default'>Cancel</Modal.Dismiss>
            <button className='btn btn-primary' > Join Hall </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
