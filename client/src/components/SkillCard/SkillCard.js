import React from 'react';
import PropTypes from 'prop-types';
import './SkillCard.scss';
import { Typography, Grid } from '@material-ui/core';
const className = 'animation-card';

const SkillCard = ({ title, content, percent, color }) => (
  <Typography
    component="div"
    className={className}
    style={{ borderColor: color }}
  >
    <Typography component="div" className="title">
      <Typography component="div" className="card-title">
        {title}
      </Typography>
      <Typography component="div" className="card-percent">
        {percent}
      </Typography>
    </Typography>
    <Typography component="div" className="card-content">
      {content}
    </Typography>
  </Typography>
);

export default SkillCard;
