import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ValuePanel.scss';
import { Button, Menu, MenuItem, Tooltip } from '@material-ui/core';

export default class ValuePanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      profileValue:
        props.pipelinesData !== undefined && props.pipelinesData.employees,
      currentValue: 'Employees',
    };
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    value: PropTypes.oneOfType(PropTypes.number, PropTypes.string),
    sidepane: PropTypes.bool.isRequired,
  };

  openMenu = e => {
    this.setState({
      anchorEl: e.currentTarget,
    });
  };

  clickMenuItem = value => {
    this.setState({
      currentValue: value,
      profileValue: this.props.pipelinesData[value.toLowerCase()],
    });
    this.closeMenu();
  };

  closeMenu = () => {
    this.setState({
      anchorEl: null,
    });
  };

  render() {
    const { title, description, value, pipelinesData } = this.props;
    const { anchorEl, profileValue, currentValue } = this.state;

    return (
      <div
        className={
          this.props.sidepane
            ? 'value-panel-wrapper value-panel-bg-sidepane'
            : 'value-panel-wrapper'
        }
      >
        <div className="value-panel-info">
          <h3>{title}</h3>
          <span>{description}</span>
        </div>
        <div className="value-panel-data">
          <span>{value}</span>
          <div className="pipeline-data">
            {pipelinesData === undefined && <i className="fas fa-lock" />}
            {pipelinesData !== undefined && (
              <div>
                <Tooltip title={currentValue}>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={this.openMenu}
                    className="pipeline-value"
                  >
                    {profileValue}
                  </Button>
                </Tooltip>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={this.closeMenu}
                >
                  <MenuItem onClick={e => this.clickMenuItem('Employees')}>
                    Employees
                  </MenuItem>
                  <MenuItem onClick={e => this.clickMenuItem('Candidates')}>
                    Candidates
                  </MenuItem>
                  <MenuItem onClick={e => this.clickMenuItem('Industry')}>
                    Industry
                  </MenuItem>
                </Menu>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
