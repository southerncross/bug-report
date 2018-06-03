import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import Chart from './Chart';

class GaugeChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      donePercent: 0,
    };

    this.convertBugsToState = this.convertBugsToState.bind(this);
  }

  convertBugsToState(bugs) {
    let totalCount = bugs.length;
    let doneCount = 0;
    bugs.forEach(({ Status: status, Resolution: resolution }) => {
      if (status === 'Done' || resolution === 'Done') {
        doneCount++;
      }
    });

    return { donePercent: parseFloat(doneCount / totalCount * 100).toFixed(1) };
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
    const { donePercent } = this.state;
    const option = {
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%',
      },
      series: [
        {
          name: 'Bug修复率',
          type: 'gauge',
          detail: { formatter: '{value}%' },
          data: [{ name: 'Bug修复率', value: donePercent }],
        },
      ],
    };

    return <Chart option={option} width={width} height={height}/>
  };
}

GaugeChart.propTypes = {
  bugs: PropTypes.array,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default GaugeChart;
