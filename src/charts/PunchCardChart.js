import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import isEqual from 'lodash/isEqual';

import Chart from './Chart';

const HOURS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

class PunchCardChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };

    this.convertBugsToState = this.convertBugsToState.bind(this);
  }

  convertBugsToState(bugs) {
    /**
     * [
     *   [hour index, day index, value],
     *   ...,
     * ]
     */
    const data = [];
    for (let i = 0; i < HOURS.length; i++) {
      for (let j = 0; j < DAYS.length; j++) {
        data.push([i, j, 0]);
      }
    }
    bugs.forEach(({ Created: created }) => {
      const date = moment(created, 'DD/MMM/YY h:m A');
      const day = date.day();
      const hour = date.hour();
      const index = hour * DAYS.length + day;
      data[index][2]++;
    });
    return { data };
  }

  componentDidMount() {
    this.setState(this.convertBugsToState(this.props.bugs));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.bugs.length !== this.props.bugs.length || !isEqual(prevProps.bugs[0], this.props.bugs[0])) {
      this.setState(this.convertBugsToState(this.props.bugs));
    }
  }

  render() {
    const { width, height } = this.props;
    const { data } = this.state;

    const option = {
      title: {
        text: 'Bug创建时间分布',
      },
      legend: {
        data: ['Bug数量'],
        left: 'right',
      },
      tooltip: {
        position: 'top',
        formatter: ({ value: [hour, day, count]}) => `${DAYS[day]} ${HOURS[hour]}点 ${count}个bug`,
      },
      grid: {
        left: 2,
        bottom: 10,
        right: 10,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: HOURS,
        boundaryGap: false,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#999',
            type: 'dashed',
          },
        },
        axisLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'category',
        data: DAYS,
        axisLine: {
          show: false,
        },
      },
      series: [{
        name: 'Bug数量',
        type: 'scatter',
        symbolSize(val) {
          return val[2] * 2;
        },
        data,
        animationDelay(idx) {
          return idx * 5;
        },
      }],
    };

    return (
      <Chart option={option} width={width} height={height}/>
    );
  }
}

PunchCardChart.propTypes = {
  bugs: PropTypes.array,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default PunchCardChart;
