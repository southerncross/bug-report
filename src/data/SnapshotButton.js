import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import html2canvas from 'html2canvas';

class SnapshotButton extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    html2canvas(document.body).then((canvas) => {
      const a = document.createElement('a');
      a.download = this.props.filename;
      a.href = canvas.toDataURL('image/png;base64');
      const e = document.createEvent('MouseEvents');
      e.initMouseEvent('click');
      a.dispatchEvent(e);
    });
  }

  render() {
    const { className } = this.props;
    return <button className={className} onClick={this.onClick} data-html2canvas-ignore>导出报告</button>
  }
}

SnapshotButton.defaultProps = {
  filename: 'Bug分析报告',
};

SnapshotButton.propTypes = {
  className: PropTypes.string,
  filename: PropTypes.string,
};

export default styled(SnapshotButton)`
  border: 1px solid grey;
  border-radius: 2px;
  background-color: transparent;
  cursor: pointer;
`;
