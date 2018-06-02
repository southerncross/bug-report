import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import echarts from 'echarts';
import isEqual from 'lodash/isEqual';

class Chart extends React.Component {
  constructor(props) {
    super(props);

    this.chart = null;
  }

  componentDidMount() {
    this.chart = echarts.init(ReactDOM.findDOMNode(this));
    this.chart.setOption(this.props.option);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps, this.props)) {
      this.chart.setOption(this.props.option);
    }
  }

  render() {
    const { width, height } = this.props;

    return (
      <div style={{ width, height }}/>
    );
  }
}

Chart.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
}

export default Chart;
