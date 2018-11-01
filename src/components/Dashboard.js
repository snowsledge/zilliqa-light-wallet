import React from 'react';
import { connect } from 'react-redux';

import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Card from '@material-ui/core/Card/Card';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import IconButton from '@material-ui/core/IconButton/IconButton';
import PermIdentity from '@material-ui/icons/PermIdentity';
import VpnKey from '@material-ui/icons/VpnKey';

import { getAddressAbbreviation } from '../utils/crypto';
import { getIdenticonImage } from '../utils/identicon';
import { createZilliqa } from '../utils/networks';

import AccountsMenu from './AccountsMenu';
import ChangeNetwork from './ChangeNetwork';
import WalletKeys from './WalletKeys';
import WalletBackup from './WalletBackup';
import Price from './Price';

import { hideAccounts, showAccounts } from '../actions/dashboard';
import { hideSnackbar, showSnackbar } from '../actions/snackbar';
import { showWalletKeys } from '../actions/wallet';
import { setActiveAccountDetails } from '../actions/account';

import logoZIL from '../images/logo_zil.svg';

class Dashboard extends React.Component {
  componentDidMount() {
    this.loadActiveAccountDetails();
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   // When close send token popup
  //   if (
  //     !this.props.sendTokenOpen &&
  //     prevProps.sendTokenOpen !== this.props.sendTokenOpen
  //   ) {
  //     this.loadActiveAccountDetails();
  //   }
  // }

  showAccounts = async event => {
    const { showAccounts } = this.props;
    showAccounts(event.currentTarget);
  };

  loadActiveAccountDetails = async () => {
    const {
      activeAccount,
      network,
      showSnackbar,
      hideSnackbar,
      setActiveAccountDetails,
    } = this.props;
    if (activeAccount && activeAccount.address) {
      showSnackbar('Loading account details...');
      const zilliqa = createZilliqa(network);
      const node = zilliqa.getNode();
      node.getBalance({ address: activeAccount.address }, (error, data) => {
        if (error || data.error) {
          console.error(error);
        } else {
          const activeAccountDetails = data.result;
          setActiveAccountDetails(activeAccountDetails);
          hideSnackbar();
        }
      });
    }
  };

  render() {
    const { activeAccountDetails } = this.props;
    if (!activeAccountDetails) {
      return (
        <div>
          <LinearProgress />
          <p>Loading the account details...</p>
        </div>
      );
    }

    const { activeAccount, showWalletKeys } = this.props;
    const { balance } = activeAccountDetails;
    const { address } = activeAccount;
    const identiconImage = getIdenticonImage(address);
    const addressAbbreviation = getAddressAbbreviation(address);

    return (
      <div className="cards">
        <Card className="card sign-in-card">
          <div className="address align-right">
            <img className="identicon" src={identiconImage} alt={address} />{' '}
            {addressAbbreviation}
            <Tooltip title="Switch Accounts">
              <IconButton
                aria-label="Switch Accounts"
                aria-owns="menuAccountsSelection"
                aria-haspopup="true"
                onClick={this.showAccounts}
              >
                <PermIdentity />
              </IconButton>
            </Tooltip>
            <AccountsMenu />
          </div>
          <div className="logo-container">
            <Tooltip title="Reload Account Details">
              <img
                src={logoZIL}
                alt="Zilliqa"
                className="token-logo"
                onClick={this.loadActiveAccountDetails}
              />
            </Tooltip>
          </div>

          <div className="balance">{balance} ZIL</div>
          <Price />

          <div className="balance">
            Address
            <Tooltip title="Show Private Key">
              <IconButton aria-label="Details" onClick={showWalletKeys}>
                <VpnKey />
              </IconButton>
            </Tooltip>
            <div className="address"> {address}</div>
          </div>
        </Card>
        <AccountsMenu />
        <WalletKeys />
        <ChangeNetwork />
        <WalletBackup />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeAccountDetails: state.account.activeAccountDetails,
  activeAccount: state.account.activeAccount,
  network: state.app.network,
  sendTokenOpen: state.wallet.sendTokenOpen,
  accountsOpen: state.dashboard.accountsOpen,
});

const mapDispatchToProps = {
  showSnackbar,
  hideSnackbar,
  showAccounts,
  hideAccounts,
  setActiveAccountDetails,
  showWalletKeys,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
