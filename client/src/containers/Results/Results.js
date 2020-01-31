import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Grid,
  Hidden,
} from '@material-ui/core';

import CalendarViewIcon from '@material-ui/icons/CalendarViewDay';
import GraphIcon from '@material-ui/icons/GraphicEq';
import challengeActions from '../../redux/challenge/actions';

import { Talent, Insight } from './Pages';
import DemoTalent from './Demo/DemoTalent';
import DemoInsight from './Demo/DemoInsight';
import './ResultWrapper.scss';

import MiniLogo from '../../images/logo-mini.png';
import SettingMenu from './SettingMenu';
import ConfirmModal from '../../components/Modals/ConfirmModal';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';

const { getChallenge, deleteChallenge } = challengeActions;

const DEMO_CHALLENGE_ID = '123456';

class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: 0,
      showCardDeleteModal: false,
      menuOpened: false,
    };
  }

  componentDidMount() {
    const { challengeId } = this.props.match.params;
    const { getChallenge } = this.props;

    getChallenge(challengeId);
    // ListItem.defaultProps.disableFocusRipple = true;
  }

  handleClickTab = selectedTab => () => {
    this.setState({
      selectedTab,
    });
  };

  handleClickDelete = event => {
    const { curChallenge } = this.props;
    this.setState({ showCardDeleteModal: true, curChallenge });
  };

  hideTestCardDeleteModal = () => {
    this.setState({ showCardDeleteModal: false });
  };

  handleConfirmDelete = () => {
    const { deleteChallenge } = this.props;
    const { challengeId } = this.props.match.params;

    this.setState({ showCardDeleteModal: false });
    deleteChallenge(challengeId);
    this.props.history.push(`/dashboard`);
  };

  handleOpenMenu = () => {
    this.setState({
      menuOpened: true,
    });
  };

  handleCloseMenu = () => {
    this.setState({
      menuOpened: false,
    });
  };

  render() {
    const { selectedTab, menuOpened } = this.state;
    const selectedStyle = 'result-drawer-item-selected';
    const drawerStyle = menuOpened ? 'drawer-opened' : 'drawer-closed';
    const theme = createMuiTheme({
      props: {
        // Name of the component
        MuiListItem: {
          // The properties to apply
          disableRipple: true, // No more ripple, on the whole application!
        },
      },
    });
    const drawer = (
      <div className="result-drawer">
        {/* <List>
          <ListItem className="result-logo-item" button key="logo">
            <Link to="/dashboard">
              <img
                className="result-logo-mini"
                src={MiniLogo}
                alt="logo-mini"
              />
            </Link>
          </ListItem>
        </List>
        <List className="result-switch-list">
          <ListItem
            className={selectedTab === 0 ? selectedStyle : ''}
            selected={selectedTab === 0}
            onClick={this.handleClickTab(0)}
            button
            key="Talent"
          >
            <ListItemIcon>
              <CalendarViewIcon />
            </ListItemIcon>
            <ListItemText primary="Talent" />
          </ListItem>
          <ListItem
            className={selectedTab === 1 ? selectedStyle : ''}
            selected={selectedTab === 1}
            onClick={this.handleClickTab(1)}
            button
            key="Analytics"
          >
            <ListItemIcon>
              <GraphIcon />
            </ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItem>
        </List>
        <List className="setting-menu">
          <SettingMenu
            onOpen={this.handleOpenMenu}
            onClose={this.handleCloseMenu}
            onDelete={this.handleClickDelete}
          />
        </List> */}
        <MuiThemeProvider theme={theme}>
          <List>
            <ListItem className="result-logo-item" button key="logo">
              <Link to="/dashboard">
                <img
                  className="result-logo-mini"
                  src={MiniLogo}
                  alt="logo-mini"
                />
              </Link>
            </ListItem>
          </List>
          <List className="result-switch-list">
            <ListItem
              className={`${
                selectedTab === 0 ? selectedStyle : ''
              } drawer-item`}
              selected={selectedTab === 0}
              onClick={this.handleClickTab(0)}
              button
              key="Talent"
              style={{ alignItems: 'center', display: 'flex' }}
            >
              <Tooltip title="Talent" placement="left-end">
                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justify="center"
                  alignContent="center"
                >
                  <div
                    className={
                      selectedTab === 0 ? 'menu_item_selected' : 'menu_item'
                    }
                  >
                    <CalendarViewIcon />
                  </div>
                </Grid>
              </Tooltip>
            </ListItem>
            <ListItem
              className={`${
                selectedTab === 0 ? selectedStyle : ''
              } drawer-item`}
              selected={selectedTab === 1}
              onClick={this.handleClickTab(1)}
              button
              key="Analytics"
            >
              <Tooltip title="Analytics" placement="left-end">
                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justify="center"
                  alignContent="center"
                >
                  <div
                    className={
                      selectedTab === 1 ? 'menu_item_selected' : 'menu_item'
                    }
                  >
                    <GraphIcon />
                  </div>
                </Grid>
              </Tooltip>
            </ListItem>
          </List>
          <List className="setting-menu">
            <SettingMenu
              onOpen={this.handleOpenMenu}
              onClose={this.handleCloseMenu}
              onDelete={this.handleClickDelete}
            />
          </List>
        </MuiThemeProvider>
      </div>
    );

    const { challengeId } = this.props.match.params;

    let content;
    if (challengeId === DEMO_CHALLENGE_ID) {
      content = selectedTab === 0 ? <DemoTalent /> : <DemoInsight />;
    } else {
      content =
        selectedTab === 0 ? (
          <Talent challengeId={challengeId} />
        ) : (
          <Insight challengeId={challengeId} />
        );
    }

    return (
      <>
        <Hidden xsDown implementation="css">
          <Drawer
            className={`result-drawer-container ${drawerStyle}`}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
          {content}
          <ConfirmModal
            onConfirm={this.handleConfirmDelete}
            content={this.context.t('are-you-sure-you-want-to-delete-this')}
            confirmText={this.context.t('delete')}
            isOpened={this.state.showCardDeleteModal}
            onCancel={this.hideTestCardDeleteModal}
          />
        </Hidden>
      </>
    );
  }
}

Results.contextTypes = {
  t: PropTypes.func,
};

Results.propTypes = {
  curChallenge: PropTypes.object.isRequired,
  getChallenge: PropTypes.func.isRequired,
  deleteChallenge: PropTypes.func.isRequired,
  i18nState: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  curChallenge: state.challengeReducer.curChallenge,
  i18nState: state.i18nState,
});

const mapDispatchToProps = {
  getChallenge,
  deleteChallenge,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(Results);
