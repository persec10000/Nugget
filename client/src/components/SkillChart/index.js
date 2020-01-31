import React, { Component } from 'react';

import { Doughnut } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import 'chartjs-plugin-labels/build/chartjs-plugin-labels.min';

/**
 * options for skill chart
 * here we can customize chart, tooltip and intergrate plugin
 */
const options = {
  padding: '5px',
  responsive: true,
  maintainAspectRatio: true,
  defaultFontSize: '18px',
  cutoutPercentage: 30,
  legend: {
    display: false,
  },
  plugins: {
    labels: {
      render: args => {
        return args.dataset.labels[args.index];
      },
      precision: 0,
      textAlign: 'center',
      showZero: true,
      fontSize: 10,
      fontColor: '#fff',
      fontStyle: 'normal',
      fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      textShadow: true,
      shadowBlur: 10,
      shadowOffsetX: -5,
      shadowOffsetY: 5,
      shadowColor: 'rgba(255,0,0,0.75)',
      arc: true,
      position: 'default',
      overlap: true,
      showActualPercentages: true,
      outsidePadding: 4,
      textMargin: 4,
    },
  },
  tooltips: {
    bodyFontSize: 15,
    height: 50,
    callbacks: {
      titleFontSize: 10,
      bodyFontSize: 10,
      useHTML: true,
      shared: false,
      label: function(tooltipItem, data) {
        var dataset = data.datasets[tooltipItem.datasetIndex];
        var index = tooltipItem.index;
        return dataset.skillTips[index];
      },
    },
  },
};

class SkillChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      options: {},
    };
  }
  componentDidMount() {
    this.setState({
      /**
       * Data for chart
       */
      data: {
        labels: this.props.outLabels,
        datasets: [
          {
            data: this.props.outData,
            labels: this.props.outLabels,
            skillTips: this.props.skillTips,
            backgroundColor: [
              '#ED7D31',
              '#ED7D31',
              '#ED7D31',
              '#ED7D31',
              '#ED7D31',

              '#4472C4',
              '#4472C4',
              '#4472C4',
              '#4472C4',
              '#4472C4',
              '#4472C4',
              '#4472C4',

              '#7031A1',
              '#7031A1',
              '#7031A1',
              '#7031A1',
              '#7031A1',
            ],
          },
          {
            data: this.props.inData,
            labels: this.props.inLabels,
            skillTips: ['Personality', 'Decision Making', 'Communication'],
            backgroundColor: ['#ED7D31', '#4472C4', '#7031A1'],
          },
        ],
      },
    });
  }
  render() {
    const { data } = this.state;
    console.log(data, options);
    return (
      <div>
        <Doughnut data={this.state.data} options={options} ref="chart" />
      </div>
    );
  }
}
SkillChart.propTypes = {
  outData: PropTypes.array.isRequired,
  inData: PropTypes.array.isRequired,
  outLabels: PropTypes.array.isRequired,
  inLabels: PropTypes.array.isRequired,
  skillTips: PropTypes.array.isRequired,
};
export default SkillChart;
