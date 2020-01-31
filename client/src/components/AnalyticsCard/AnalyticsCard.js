import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  Typography,
  Button,
  Popper,
  MenuItem,
  Paper,
  ClickAwayListener,
  MenuList,
  Grow,
  ListItemIcon,
  ListItemText,
  withStyles,
  Divider,
} from '@material-ui/core';
import {
  InfoOutlined,
  MoreHoriz,
  FileCopyOutlined,
  DeleteOutlined,
  SaveAltOutlined,
} from '@material-ui/icons';
import data from '../../static/convertcsv.json';
import './AnalyticsCard.scss';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
} from 'react-vis';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
const theme = createMuiTheme({
  overrides: {
    MuiSwitch: {
      bar: {
        '$checked$checked + &': {
          opacity: 0.4,
          backgroundColor: '#52d869', // Light green, aka #74d77f
        },
      },
    },
  },
});

const GreenSwitch = withStyles({
  switchBase: {
    '&$checked': {
      transform: 'translateX(16px)',
      color: '#5bd632',
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  colorSecondary: {
    '&$checked': {
      '& + $bar': {
        opacity: 0.3,
        backgroundColor: 'white',
      },
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid #5bd632`,
    backgroundColor: '#5bd632',
    opacity: 1,
  },
  checked: {},
  focusVisible: {},
})(Switch);

export default class AnalyticsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      benchmark: true,
      anchorEl: null,
      open: false,
      data: [],
    };
  }
  handleToggle = e => {
    e.stopPropagation();
    this.setState(state => ({ open: !state.open }));
  };
  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };
  onFileCopyClicked = () => {
    const { openSnackBar, copyLink } = this.props;
    openSnackBar(this.props.pipeline.title);
    copyLink();
  };

  handleRemovePipeline = pipeline_id => () => {
    const { challengeId: challenge_id } = this.props.match.params;
    const { deletePipeline } = this.props;

    deletePipeline({
      challenge_id,
      pipeline_id,
    });
  };

  handleArchive = event => {
    this.props.onRemove(event);
    this.handleClose(event);
  };

  handleChangeSwitch = name => event => {
    if (!this.props.isDummy) {
      this.props.changeBenchmark(this.props.pipeline._id);
    } else {
      this.props.changeBenchmark(this.props.pid);
    }
  };

  handleSelectPipeline = pipeline => {
    const { onSelectPipleLine } = this.props;
    if (onSelectPipleLine) {
      onSelectPipleLine(pipeline);
    }
  };
  handleRemove = event => {
    this.props.onRemove(event);
    this.handleClose(event);
  };

  render() {
    const { open } = this.state;
    const { pipeline, renderChild, benchmark, onClick, data } = this.props;
    const timelineData = data.map(value => {
      return { x: new Date(value.Date), y: value.Price };
    });
    // const timestamp = new Date('September 9 2017').getTime();
    // const MSEC_DAILY = 86400000;
    return (
      <div
        className="analyticscard"
        onClick={event => this.handleSelectPipeline('')}
      >
        {renderChild ? (
          this.props.children
        ) : (
          <>
            <div className="info-pane">
              <div
                className="pipelines-description"
                onClick={event => this.handleSelectPipeline('')}
              >
                {pipeline.title}
              </div>
            </div>
            <div className="info-pane">
              {pipeline.color == 'green' ? (
                <div className="pipelines-count1">{pipeline.length}</div>
              ) : (
                <div className="pipelines-count">{pipeline.length}</div>
              )}
            </div>
            <XYPlot xType="time" width={220} height={130}>
              <LineSeries
                data={timelineData}
                curve={'curveMonotoneX'}
                style={{ fill: 'none' }}
                stroke={pipeline.color}
              />
            </XYPlot>
          </>
        )}
      </div>
    );
  }
}
AnalyticsCard.propTypes = {};
AnalyticsCard.defaultProps = {
  headerColor: '#552c84',
  height: '160',
  pipeline: { users: [], title: 'Test ' },
  renderChild: false,
};
