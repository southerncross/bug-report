import React from 'react';
import PropTypes from 'prop-types';
import Papa from 'papaparse';
import styled from 'styled-components';
import uniqueId from 'lodash/uniqueId';

class DataInput extends React.Component {
  constructor(props) {
    super(props);

    this.id = uniqueId();
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const filename = e.target.files[0].name;
    Papa.parse(e.target.files[0], {
      delimiter: ',',
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => this.props.onChange(data, filename),
      error: (err) => console.error(err),
    });
  }

  render() {
    const { className } = this.props;

    return (
      <div className={className}>
        <label htmlFor={this.id}>点击上传csv</label>
        <input id={this.id} type="file" onChange={this.onChange} hidden/>
      </div>
    );
  }
}

DataInput.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
}

export default styled(DataInput)`
  label {
    cursor: pointer;
  }
`;
