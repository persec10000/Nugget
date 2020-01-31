import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Badge,
  IconButton,
  MenuItem,
  ClickAwayListener,
  MenuList,
  Popper,
  Paper,
  Grow,
  Typography,
  Tooltip,
} from '@material-ui/core';
import './NotificationButton.scss';

export default class NotificationButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null,
    };
  }
  handleToggle = e => {
    e.stopPropagation();
    this.setState(state => ({ open: !state.open, anchorEl: e.currentTarget }));
  };

  handleMenuItemClick = (event, index) => {
    // setSelectedIndex(index);
    const { handleNotifications } = this.props;
    this.setState(state => ({
      anchorEl: null,
    }));
    handleNotifications(index);
  };

  handleClose = () => {
    this.setState(state => ({
      anchorEl: null,
      open: false,
    }));
  };

  handleTime2String = time => {
    if (time > 0) {
      const mins = parseInt((Date.now() - time) / 1000 / 60);
      if (mins === 0) {
        return this.context.t('now');
      } else if (mins === 1) {
        return this.context.t('min-ago');
      } else {
        return this.context.t('mins-ago', { time: mins });
      }
    }
    return '';
  };

  render() {
    const { open } = this.state;
    const { options } = this.props;
    return (
      <div className="notification-button">
        <Tooltip title="Notifications">
          <IconButton
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={open ? 'menu-list-grow' : undefined}
            aria-label="notification"
            size="small"
            onClick={this.handleToggle}
            aria-haspopup="true"
            aria-controls="lock-menu"
          >
            <Badge
              color="error"
              badgeContent={options === undefined ? 0 : options.length}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                transform={this.state.open ? 'rotate(15)' : 'rotate(0)'}
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  fill="#8c92f7"
                  d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
                />
              </svg>
            </Badge>
          </IconButton>
        </Tooltip>
        <Popper
          open={open}
          anchorEl={this.anchorEl}
          transition
          disablePortal
          placement="bottom"
          className="menu-popper"
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper className="notification-paper">
                <ClickAwayListener onClickAway={this.handleClose}>
                  <div className="menu-header">
                    <Typography className="menu-title">
                      {this.context.t('notifications')}
                    </Typography>
                    <div className="menu-button" onClick={this.handleClose}>
                      {this.context.t('close')}
                    </div>
                  </div>
                  {options === undefined || options.length === 0 ? (
                    <div className="menu-body">
                      <Typography className="menu-body-text">
                        {this.context.t('caught-all')}
                      </Typography>
                    </div>
                  ) : (
                    <MenuList>
                      {options.map((item, idx) => {
                        return (
                          <MenuItem
                            onClick={e => {
                              this.handleMenuItemClick(e, item.index);
                            }}
                            className="menu-item"
                            key={idx}
                          >
                            <Typography className="menu-item-text">
                              {item.title}
                            </Typography>
                            <div className="menu-item-placeholder">
                              <Typography className="menu-item-placeholder-text-1">
                                {item.subtitle}
                              </Typography>
                              <Typography className="menu-item-placeholder-text">
                                {this.handleTime2String(item.time)}
                              </Typography>
                            </div>
                          </MenuItem>
                        );
                      })}
                    </MenuList>
                  )}
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
}

NotificationButton.contextTypes = {
  t: PropTypes.func,
};

NotificationButton.propTypes = {
  options: PropTypes.array.isRequired,
  handleNotifications: PropTypes.func.isRequired,
};
