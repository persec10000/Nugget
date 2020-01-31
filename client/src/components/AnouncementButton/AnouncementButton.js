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

import AnouncementIcon from '../../images/announcements-icon.svg';

import './AnouncementButton.scss';

export default class AnouncementButton extends Component {
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
        <Tooltip title="Anouncements">
          <IconButton
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={open ? 'menu-list-grow' : undefined}
            aria-label="Anouncement"
            size="small"
            onClick={this.handleToggle}
            aria-haspopup="true"
            aria-controls="lock-menu"
          >
            <Badge
              color="error"
              badgeContent={options === undefined ? 0 : options.length}
            >
              <img src={AnouncementIcon} alt="" className="anouncement-icon" />
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
                    <Typography className="menu-title">Anouncements</Typography>
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

AnouncementButton.contextTypes = {
  t: PropTypes.func,
};

AnouncementButton.propTypes = {
  options: PropTypes.array.isRequired,
  handleNotifications: PropTypes.func.isRequired,
};
