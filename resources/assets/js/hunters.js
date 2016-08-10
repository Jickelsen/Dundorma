import React from 'react';
import HunterTable from './hunters/huntertable';

export default class hunters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hunters:[]};
    this.getHunters();
  }
  getHunters() {
    $.get('json/players/all', function (json) {
      this.setState({...this.state, hunters: json});
    }.bind(this));
  }
  render() {
    let popup;
    let hunterInfo;
    if (this.props.children) {
      hunterInfo= this.state.hunters.find(hunter => hunter.name.toUpperCase() === this.props.params.hunter.toUpperCase());
    }
    if (hunterInfo) {
      popup = React.cloneElement(this.props.children, { hunter: hunterInfo });
    }
    return (
      <div>
        {popup}
        <div className="row">
        <h3 className="col-xs-12">Hunter Directory</h3>
          <div className="col-xs-12">
            <HunterTable players={this.state.hunters}/>
          </div>
        </div>
      </div>
    );
  }
}
