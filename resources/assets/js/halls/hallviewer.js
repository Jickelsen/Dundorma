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
      joinLeaveButton = <button type="button" className="btn btn-warning" onClick={() => this.props.leaveHandler(this.props.hall)}>Leave</button>;
    } else if (this.props.user && this.props.hall && !this.props.hall.full) {
      joinLeaveButton = <button type="button" className="btn btn-primary" onClick={() => this.props.joinHandler(this.props.hall) }>Join</button>;
    } else if (this.props.user) {
      joinLeaveButton = <button type="button" className="btn btn-danger" disabled={true}>Full</button>;
    } else {
      joinLeaveButton = '';
    }
    let passcode;
    if (this.props.hall.pass) {
      passcode = this.props.hall.pass;
    } else {
      passcode = 'None';
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
                  <label>Hub ID</label><br/>
                  {this.props.hall.idcode}
                </p>
                <p>
                  <label>Title<br/></label><br/>
                  {this.props.hall.name}
                </p>
                <p>
                  <label>Description<br/></label><br/>
                  {this.props.hall.desc}
                </p>
                <p>
                  <label>Passcode<br/></label><br/>
                  {passcode}
                </p>
                <p className="row">
                  <label className="col-xs-7"><input type="checkbox" checked={this.props.hall.onquest} disabled /> On Quest</label>
                  <label className="col-xs-5"><input type="checkbox" checked={this.props.hall.full} disabled /> Full</label>
                </p>
              </div>
              <div className="col-sm-7 col-sm-offset-1">
                <p><label>Players</label></p>
        <PlayerTable players={this.props.hall.players} owner={this.props.hall.owner} />
              </div>
            </div>
            <p><label>Direct Link</label><input className="form-control" type="text" defaultValue={"http://hunterhubs.com/"+this.props.hall.idcode} /></p>
            <p><label>Permalink to owner's latest active hall</label><input className="form-control" type="text" defaultValue={"http://hunterhubs.com/"+this.props.hall.owner.name.toLowerCase()} /></p>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Dismiss className="btn btn-default">Cancel</Modal.Dismiss>
            {joinLeaveButton}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
export default withRouter(HallViewer);
