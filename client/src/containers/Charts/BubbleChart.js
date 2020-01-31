import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import { getFixedNumber } from '../../utils/stringHelper';

HighchartsMore(Highcharts);

export class BubbleChart extends Component {
  constructor(props, context) {
    super(props, context);
    this.chartComponent = React.createRef();
    this.state = {
      currentData: {},
    };
  }

  componentDidMount() {
    const container = this.chartComponent.current.container.current;
    container.style.width = '100%';
    container.style.height = 'auto';
    this.chartComponent.current.chart.reflow();
  }

  clickBubble(data) {
    this.props.onSelectBubble(data);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.name === nextProps.name &&
      this.props.data === nextProps.data
    ) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const { title, data: data } = this.props;
    console.log('bubble-data=>>>>>>>>>>>>>>>>', data);
    const series = [];

    data.forEach(item => {
      series.push({
        name: item.label,
        cursor: 'pointer',
        color: item.color,
        data: [
          {
            name: item.label,
            value: getFixedNumber(item.value),
            color: item.color,
            description: item.description,
            positions: item.positions,
          },
        ],
      });
    });
    const maxValue = data.reduce((max, item) => {
      return Math.max(max, item.value);
    }, 0);

    const options = {
      chart: {
        type: 'packedbubble',
        backgroundColor: 'transparent',
        height: 600,
      },
      credits: {
        enabled: false,
      },
      title: {
        text: title,
      },
      tooltip: {
        useHTML: true,
        backgroundColor: 'white',
        borderWidth: 0,
        pointFormat: '<b>{point.y}%</b> ',
        hearderFormat: "<span style='font-size: 19px'>{point.key}</span><br/>",
        style: {
          color: '#505d6f',
          cursor: 'default',
          fontSize: '16px',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        },
      },
      plotOptions: {
        packedbubble: {
          minSize: '70%',
          maxSize: '130%',
          zMin: 0,
          zMax: maxValue,
          layoutAlgorithm: {
            splitSeries: false,
            parentNodeLimit: true,
            gravitationalConstant: 0.02,
            initialPositions: 'random',
          },
          events: {
            click: event => {
              this.clickBubble({
                ...event.point,
              });
            },
          },
          states: { inactive: { opacity: 0.9 } },
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            filter: {
              property: 'y',
              operator: '>',
              value: 0,
            },
            style: {
              color: 'black',
              fontSize: '12px',
              textOutline: 'none',
              fontWeight: 'normal',
            },
          },
        },
      },
      series: series,
      legend: {
        itemMarginTop: 5,
        itemMarginBottom: 5,
      },
    };
    return (
      <div className={this.props.className}>
        <HighchartsReact
          ref={this.chartComponent}
          allowChartUpdate={true}
          highcharts={Highcharts}
          options={options}
        />
      </div>
    );
  }
}

BubbleChart.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array.isRequired,
  onSelectBubble: PropTypes.func.isRequired,
};
BubbleChart.defaultProps = {
  labels: [],
  title: '',
};
