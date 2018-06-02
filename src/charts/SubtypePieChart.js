import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import Chart from './Chart';

class SubtypePieChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };

    this.convertBugsToState = this.convertBugsToState.bind(this);
  }

  convertBugsToState(bugs) {
    const typeToInfo = {};

    bugs.forEach(({ 'Custom field (Bug原因分类)': type, Created: created, ...rest }) => {
      type = type || '未分类';
      typeToInfo[type] = typeToInfo[type] || { name: type, value: 0 };
      typeToInfo[type].value++;
      let subtype = rest['Custom field (迷之bug详情)'] || rest['Custom field (样式交互bug详情)'] || rest['Custom field (不是bug的详情)'];
      if (subtype) {
        typeToInfo[type].subtypeToInfo = typeToInfo[type].subtypeToInfo || {};
        typeToInfo[type].subtypeToInfo[subtype] = typeToInfo[type].subtypeToInfo[subtype] || { name: subtype, value: 0 };
        typeToInfo[type].subtypeToInfo[subtype].value++;
      }
    });

    const data = Object.values(typeToInfo).map((info) => {
      if (info.subtypeToInfo) {
        info.children = Object.values(info.subtypeToInfo);
        delete info.subtypeToInfo;
      }
      return info;
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

    console.log('boring wtf', data);

    const option = {
      title: {
        text: 'Bug原因分类',
        textStyle: {
          fontSize: 14,
          align: 'center',
        },
        subtextStyle: {
          align: 'center',
        },
      },
      highlightPolicy: 'descendant',
      series: {
        type: 'sunburst',
        highlightPolicy: 'ancestor',
        data: data,
        radius: [0, '95%'],
        sort: null,
        levels: [{}, {
          r0: '25%',
          r: '70%',
          itemStyle: {
            borderWidth: 2,
          },
          label: {
            rotate: 0,
            position: 'outside',
            padding: 3,
          },
        }, {
          r0: '70%',
          r: '90%',
          label: {
            rotate: 0,
            minAngle: 10,
            position: 'outside',
            padding: 3,
          },
        }],
      },
    };

    return <Chart option={option} width={width} height={height}/>
  }
}

SubtypePieChart.propTypes = {
  bugs: PropTypes.array,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default SubtypePieChart;
