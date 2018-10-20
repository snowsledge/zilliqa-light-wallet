import React, { Component } from 'react';
import { connect } from 'react-redux';

import Dashboard from './Dashboard';
import SendButton from './SendButton';
import ReceiveButton from './ReceiveButton';
import SendToken from './SendToken';
import ReceiveToken from './ReceiveToken';

class Wallet extends Component {
  render() {
    return (
      <div>
        <Dashboard />
        <div className="buttons-container">
          <SendButton />
          <ReceiveButton />
        </div>
        <SendToken />
        <ReceiveToken />
      </div>
    );
  }
}

export default connect()(Wallet);
