import React from 'react';
import Modal from 'react-bootstrap-modal';
import PlayerTable from './playertable';
import { withRouter } from 'react-router';

class HallViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open:false};
  }
  componentDidMount() {
    this.setState({open:true});
  }
  render() {
    let closeModal = () => this.props.router.push('/');
    let userInHall = false;
    if (this.props.user && this.props.hall && this.props.hall.players && this.props.hall.players.find(pla => pla.id === this.props.user.id)) {
      userInHall = true;
    }
    let joinLeaveButton;
    if (userInHall) {
      joinLeaveButton = <button type='button' className='btn btn-warning' onClick={() => this.props.leaveHandler(this.props.hall)}>Leave</button>;
    } else if (this.props.user) {
      joinLeaveButton = <button type='button' className='btn btn-primary' onClick={() => this.props.joinHandler(this.props.hall) }>Join</button>;
    } else {
      joinLeaveButton = '';
    }
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
                  {this.props.hall.idcode}
                </p>
                <p>
                  <label>Name<br/></label><br/>
                  {this.props.hall.name}
                </p>
                <p>
                  <label>Description<br/></label><br/>
                  {this.props.hall.desc}
                </p>
                <p>
                  <label>Password<br/></label><br/>
                  {this.props.hall.pass}
                </p>
                <p>
                  <label><input type="checkbox" checked={this.props.hall.private} disabled /> Private</label>
                </p>
              </div>
              <div className="col-sm-7 col-sm-offset-1">
                <p><label>Players</label></p>
                <PlayerTable players={this.props.hall.players} />
              </div>
            </div>
              <label>Direct Link</label><input className="form-control" type="text" defaultValue={"http://0.0.0.0/"+this.props.hall.idcode} />
          </Modal.Body>
          <Modal.Footer>
            <Modal.Dismiss className='btn btn-default'>Cancel</Modal.Dismiss>
            {joinLeaveButton}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
export default withRouter(HallViewer);
