import React from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import isEqual from 'lodash/isEqual';
import moment from 'moment';

import Chart from './Chart';

class WeeklyTrendChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weeks: [],
      typeToCountList: {},
    };

    this.convertBugsToState = this.convertBugsToState.bind(this);
  }

  convertBugsToState(bugs) {
    /**
     * {
     *   1: {
     *     迷之bug: 3,
     *     低级错误: 7,
     *     ...
     *     },
     *   },
     *   ...
     * }
     */
    const weekToTypeToCount = {};
    let minDate = null;
    let maxDate = null;
    const typeSet = new Set();
    bugs.forEach(({ 'Custom field (Bug原因分类)': type, Created: created }) => {
      type = type || '未分类';
      typeSet.add(type);
      const date = moment(created, 'DD/MMM/YY h:m A');
      if (!minDate || date.isBefore(minDate)) {
        minDate = date;
      }
      if (!maxDate || date.isAfter(maxDate)) {
        maxDate = date;
      }
      const week = date.week();
      weekToTypeToCount[week] = weekToTypeToCount[week] || {};
      weekToTypeToCount[week][type] = (weekToTypeToCount[week][type] || 0) + 1;
    });

    const weeks = [];
    const typeToCountList = [...typeSet].reduce((result, type) => {
      result[type] = [];
      return result;
    }, {});
    for (let i = minDate; i.week() <= maxDate.week(); i = minDate.add(1, 'week')) {
      const week = i.week();
      weeks.push(`${i.startOf('week').format('M/D')}-${i.endOf('week').format('M/D')}`);
      for (const type of typeSet) {
        typeToCountList[type].push(weekToTypeToCount[week][type] || 0);
      }
    }
    return { weeks, typeToCountList };
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
    const { height, width } = this.props;
    const { weeks, typeToCountList } = this.state;

    const option = {
      title: {
        text: 'Bug数量走势',
      },
      tooltip : {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
           backgroundColor: '#6a7985',
          },
        },
      },
      legend: {
        type: 'scroll',
        formatter (name) {
          return echarts.format.truncateText(name, 50, '14px Microsoft Yahei', '…');
        },
        tooltip: {
          show: true,
        },
        data: Object.keys(typeToCountList),
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: weeks,
        },
      ],
      yAxis: [
        {
          type : 'value',
        },
      ],
      series : Object.keys(typeToCountList).map((type) => ({
        name: type,
        type: 'line',
        stack: '总量',
        smooth: true,
        label: {
          normal: {
            show: true,
            position: 'top',
          }
        },
        areaStyle: { normal: {} },
        data: typeToCountList[type],
      })),
    };

    return <Chart option={option} width={width} height={height}/>;
  }
}

WeeklyTrendChart.defaultProps = {
  width: '720px',
  height: '500px',
  bugs: [],
};

WeeklyTrendChart.propTypes = {
  bugs: PropTypes.array,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default WeeklyTrendChart;
