import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import Chart from './Chart';

class BugTypePieChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      legendData: [],
    };

    this.convertBugsToState = this.convertBugsToState.bind(this);
  }

  convertBugsToState(bugs) {
    const moduleToInfo = {};

    bugs.forEach(({ 'Custom field (功能模块)': type }) => {
      type = type || '未分类';
      moduleToInfo[type] = moduleToInfo[type] || { name: type, value: 0 };
      moduleToInfo[type].value++;
    });

    const data = Object.values(moduleToInfo);
    const legendData = Object.keys(moduleToInfo);
    return { data, legendData };
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
    const { data, legendData } = this.state;
    const option = {
      title: {
        text: 'Bug所属功能模块分类',
        x:'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      legend: {
        x: 'center',
        y: 'bottom',
        data: legendData,
      },
      series: [
        {
          name: 'Bug模块分类',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          roseType: 'area',
          data,
        },
      ],
    };

    return <Chart option={option} width={width} height={height}/>;
  }
}

BugTypePieChart.propTypes = {
  bugs: PropTypes.array,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default BugTypePieChart;
