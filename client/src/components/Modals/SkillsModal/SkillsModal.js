import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Modal,
  Paper,
  Grid,
  IconButton,
  Divider,
} from '@material-ui/core';
import { Close, FileCopy } from '@material-ui/icons';
import 'chartjs-plugin-labels';
import ChartData from './ChartData';
import SkillChart from '../../SkillChart';
import './SkillsModal.scss';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    position: 'absolute',
    top: `${40}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    maxHeight: window.innerHeight - 160,
  };
}
class SkillsModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      outData: [],
      inData: [],
      outLabels: [],
      inLabels: [],
      skillTips: [],
    };
  }
  componentDidMount() {
    this.setState({
      outData: [].concat(
        ...ChartData.map(idea => idea.skills.map(skill => skill.data)),
      ),
      inData: ChartData.map(idea => idea.data),
      outLabels: [].concat(
        ...ChartData.map(idea => idea.skills.map(skill => skill.title)),
      ),
      inLabels: ChartData.map(idea => idea.bmodel),

      skillTips: [].concat(
        ...ChartData.map(idea => idea.skills.map(skill => skill.desc)),
      ),
    });
  }

  handleClose() {
    this.props.onHide();
  }

  render() {
    const { show } = this.props;

    return (
      <Modal className="skills-modal" open={show} onClose={this.handleClose}>
        <div>
          <Paper className="paper-main" elevation={0} style={getModalStyle()}>
            <Divider className="divider" />
            <Grid
              className="skills-modal-header"
              container
              alignItems="center"
              justify="space-between"
            >
              <Typography variant="h5" component="h5">
                {'Skills Model'}
              </Typography>
              <Typography variant="h6" component="h6">
                {
                  'The challenge you’re about to experience will measure your ability to communicate, make decisions, and understand your general personality type in a real company scenario. The model below is generic and serves to give you an idea of what we can capture. You will not be assessed on every skill in this challenge.'
                }
              </Typography>
            </Grid>
            <Grid className="skill-chart">
              <SkillChart {...this.state} />
            </Grid>
          </Paper>
        </div>
      </Modal>
    );
  }
}

SkillsModal.contextTypes = {
  t: PropTypes.func,
};

SkillsModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

export default SkillsModal;
