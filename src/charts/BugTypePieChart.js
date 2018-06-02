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
    const typeToInfo = {};

    bugs.forEach(({ 'Custom field (Bug原因分类)': type }) => {
      type = type || '未分类';
      typeToInfo[type] = typeToInfo[type] || { name: type, value: 0 };
      typeToInfo[type].value++;
    });

    const data = Object.values(typeToInfo);
    const legendData = Object.keys(typeToInfo);
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
        text: 'Bug原因分类',
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
          name: 'Bug原因分类',
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
