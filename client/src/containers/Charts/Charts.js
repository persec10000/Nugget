import React, { Component } from 'react';
import { Chip, Typography } from '@material-ui/core';
import Highcharts from 'highcharts';
import PropTypes from 'prop-types';
import HighchartsMore from 'highcharts/highcharts-more';
import { cloneDeep as _cloneDeep, range as _range } from 'lodash';
import HighchartsReact from 'highcharts-react-official';
import GraphLegends from './GraphLegends';
import { Grid } from '@material-ui/core';

import { getRandomName, getRandomInt } from '../Results/dummyData';
import './Charts.scss';

export { BubbleChart } from './BubbleChart';

const filterValues = [
  {
    label: 'Speed',
    value: 'speed',
    color: '#fbb5c0',
    checked: true,
  },
  {
    label: 'Planning',
    value: 'planning',
    color: '#1890ff',
    checked: true,
  },
  {
    label: 'Attention to Detail',
    value: 'assertiveness',
    color: '#5eb290',
    checked: false,
  },
  {
    label: 'Neutrality',
    value: 'hardworking',
    color: '#618bb2',
    checked: false,
  },
  {
    label: 'Clarity & Reasoning',
    value: 'honesty',
    color: '#fc8e7f',
    checked: false,
  },
];

const checkedFilters = [1, 2];

export class ScatterPlot extends Component {
  state = {
    checkedLegend: checkedFilters,
    checkedCount: 2,
    legends: {
      shape: {
        square: true,
        circle: true,
        triangle: true,
      },
      size: {
        small: true,
        big: false,
      },
      color: [true, true],
    },
    axis: { x: { title: 'Speed' }, y: { title: 'Planning' } },
  };

  static propTypes = {
    isDummyData: PropTypes.bool,
    onClickPlot: PropTypes.func,
    data: PropTypes.array,
  };

  userData = [];

  getToolTip = (xPos, yPos) => {
    return '';
  };

  getFilter = () => {
    const { legends } = this.state;

    return legends;
  };

  handleChangeLegends = value => {
    const { checkedLegend } = this.state;
    if (!checkedLegend.includes(value)) {
      if (checkedLegend.length === 2) {
        checkedLegend.shift();
      }
      checkedLegend.push(value);
      this.setState({ checkedLegend });
    }
  };

  getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  render() {
    const {
      isDummyData,
      onClickPlot,
      data,
      categories,
      onClickSeeMore,
    } = this.props;
    let employeeData = [[150.2, 47.6], [162.6, 54.5], [175.8, 71.3]];

    let candidateData = [
      [174.0, 65.6],
      [175.3, 71.8],
      [193.5, 80.7],
      [186.5, 72.6],
      [187.2, 78.8],
      [181.5, 74.8],
      [184.0, 86.4],
      [184.5, 78.4],
      [175.0, 62.0],
      [184.0, 81.6],
      [180.0, 76.6],
      [177.8, 83.6],
      [192.0, 90.0],
      [176.0, 74.6],
      [174.0, 71.0],
      [184.0, 79.6],
      [192.7, 93.8],
      [171.5, 70.0],
      [173.0, 72.4],
      [176.0, 85.9],
      [176.0, 78.8],
      [180.5, 77.8],
      [172.7, 66.2],
      [176.0, 86.4],
      [173.5, 81.8],
      [178.0, 89.6],
      [180.3, 82.8],
      [180.3, 76.4],
      [164.5, 63.2],
      [173.0, 60.9],
    ];

    let series;
    const { checkedLegend } = this.state;
    if (isDummyData) {
      series = data.map((pipeline, ind) => {
        const { users } = pipeline;

        employeeData = _range(users.length).map(ind => {
          const randomValue = this.getRandomInt(candidateData.length);

          const point = [
            candidateData[randomValue][0],
            candidateData[randomValue][1],
          ];

          this.userData[ind] = {
            xPos: point[0],
            yPos: point[1],
            data: users[ind],
          };

          return point;
        });

        return {
          name: pipeline.title,
          color: pipeline.color,
          data: employeeData,
          marker: {
            symbol: 'circle',
            radius: 5,
          },
        };
      });
    } else {
      series = data.map((pipeline, ind) => {
        const { users } = pipeline;

        employeeData = users.map((user, ind) => {
          const categoryNames = [
            categories[checkedLegend[0] - 1].label,
            categories[checkedLegend[1] - 1].label,
          ];
          const point = [
            user[categoryNames[0]] * 100,
            user[categoryNames[1]] * 100,
          ];
          this.userData[ind] = {
            xPos: point[0],
            yPos: point[1],
            data: user,
          };
          return point;
        });
        return {
          name: pipeline.title,
          color: pipeline.color,
          data: employeeData,
          marker: {
            symbol: 'circle',
            radius: 5,
          },
        };
      });
    }

    const options = {
      chart: {
        type: 'scatter',
        zoomType: 'xy',
        spacingBottom: 30,
      },
      title: {
        text: '',
      },
      subtitle: {
        text: '',
        style: { color: '#4B4D4C', background: '#4DB192' },
      },
      offset: 0,
      xAxis: {
        title: {
          enabled: true,
          margin: 10,
          text: `<b class="title-x">${
            categories[checkedLegend[0] - 1]
              ? categories[checkedLegend[0] - 1].label
              : ''
          }</b>`,
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true,
      },
      yAxis: {
        title: {
          text: `<b class="title-x">${
            categories[checkedLegend[1] - 1]
              ? categories[checkedLegend[1] - 1].label
              : ''
          }</b>`,
        },
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        x: 0,
        y: 30,
        floating: true,
        backgroundColor:
          (Highcharts.theme && Highcharts.theme.legendBackgroundColor) ||
          '#FFFFFF',
        borderWidth: 0,
      },
      pane: {
        size: '50%',
      },
      tooltip: {
        enabled: true,
        shared: true,
        formatter: function() {
          return `${getRandomName()}, Rank: ${getRandomInt(20)}`;
        },
      },
      plotOptions: {
        scatter: {
          marker: {
            states: {
              hover: {
                enabled: true,
                lineColor: 'rgb(100,100,100)',
              },
            },
          },
          states: {
            hover: {
              marker: {
                enabled: false,
              },
            },
          },
          tooltip: {},
        },
        series: {
          events: {
            click: event => {
              onClickPlot(getRandomName(), getRandomInt(50));
            },
          },
        },
      },
      series: _cloneDeep(series),
      credits: {
        enabled: false,
      },
    };

    return (
      <Grid container spacing={24}>
        <Grid item xs={4}>
          <GraphLegends
            value={this.state.legends}
            onChange={this.handleChangeLegends}
            filters={this.props.categories}
            checkedLegend={this.state.checkedLegend}
          />
          {this.props.needSeeMore && (
            <a className="btn-see-more" onClick={onClickSeeMore}>
              See more
            </a>
          )}
        </Grid>
        <Grid item xs={8}>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </Grid>
      </Grid>
    );
  }
}

HighchartsMore(Highcharts);

export class PolarSpiderChart extends Component {
  constructor(props, context) {
    super(props, context);
    this.chartComponent = React.createRef();
  }

  componentDidMount() {
    const container = this.chartComponent.current.container.current;
    container.style.width = '100%';
    container.style.height = 'auto';
    this.chartComponent.current.chart.reflow();
  }

  render() {
    const { series, categories, hideLabel, labels } = this.props;
    const options = {
      chart: {
        polar: true,
        type: 'areaspline',
      },

      title: {
        text: null,
      },

      xAxis: {
        categories: categories,
        tickmarkPlacement: 'on',
        lineWidth: 0,
        labels: {
          format:
            '<h6 style="font-size: 12px; letter-spacing: normal; color: #505d6f;">{value}</h6>',
        },
      },
      yAxis: {
        labels: {
          enabled: false,
        },
      },
      tooltip: {
        enabled: true,
        formatter: function() {
          let count = 0;
          series.map(pipeline => {
            if (pipeline.name === this.series.legendItem.textStr) {
              count = pipeline.count;
            }
          });
          return (
            '<span>' +
            this.series.legendItem.textStr +
            '</span>' +
            '<br/>' +
            '<span><b>' +
            'Count: ' +
            count +
            '</b></span>' +
            '<br/>' +
            '<br/>' +
            '<span><b>'
          );
        },
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 300,
            },
            chartOptions: {
              pane: {
                size: '60%',
              },
            },
          },
        ],
      },
      series,
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
        {!hideLabel && (
          <div className="polar-label-pane">
            <Typography component="p" className="polar-label-wrapper">
              {labels.map((item, key) => (
                <Chip
                  key={key}
                  label={item.title}
                  onDelete={() => {
                    this.props.onDelete(item);
                  }}
                  color="primary"
                  variant="outlined"
                  className="polar-label"
                />
              ))}
            </Typography>
          </div>
        )}
      </div>
    );
  }
}
PolarSpiderChart.propTypes = {
  series: PropTypes.array.isRequired,
  ref: PropTypes.any,
};
PolarSpiderChart.defaultProps = {
  labels: [],
};

export class AreaChart extends Component {
  constructor(props, context) {
    super(props, context);
    this.chartComponent = React.createRef();
  }

  componentDidMount() {
    const container = this.chartComponent.current.container.current;
    container.style.width = '100%';
    this.chartComponent.current.chart.reflow();
  }
  clickHandle(e) {
    this.setState({ hoverData: e.target.category });
  }
  changeRange(range) {
    this.props.selectArea(range);
  }
  render() {
    // const { series } = this.props;

    const options = {
      chart: {
        type: 'area',
      },
      title: {
        text: '',
      },
      yAxis: {
        labels: {
          formatter: function() {
            return String(100 + this.value) + '%';
          },
        },
        min: -100,
      },
      xAxis: {
        categories: ['', '', '', '', '', '', '', ''],
      },
      credits: {
        enabled: true,
      },
      tooltip: {
        enabled: true,
        formatter: function() {
          return '<span>' + 'Talent Count: ' + Math.abs(this.y) + '</span>';
        },
      },
      plotOptions: {
        area: {
          pointStart: 0,
          allowPointSelect: false,
          cursor: 'pointer',
          trackByArea: true,

          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: false,
              },
            },
          },
        },
      },
      series: [
        {
          name: 'Top Performer',
          data: [0, -20, -80, -100, -100, -80, -20, 0],
          color: '#C8E6C9',
          events: {
            click: event => {
              this.changeRange(100);
            },
          },
        },
        {
          name: 'Medium Performer',
          data: [0, -20, -80, -80, -80, -80, -20, 0],
          color: '#FFF9C4',
          events: {
            click: event => {
              this.changeRange(80);
            },
          },
        },
        {
          name: 'Low Performer',
          data: [0, -20, -20, -20, -20, -20, -20, 0],
          color: '#ffcdd2',
          events: {
            click: event => {
              this.changeRange(20);
            },
          },
        },
      ],
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
