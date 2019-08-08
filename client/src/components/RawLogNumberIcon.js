import React from 'react';
import { renderRawLogNumberIcon } from '../helpers/helpers.js';
import './RawLogNumberIcon.css';

class RawLogNumberIcon extends React.Component {
  componentDidMount() {
    renderRawLogNumberIcon(this.props.rawLogNumber);
  }

  render() {
    const { rawLogNumber } = this.props
    return <svg className={'rawLogNumber' + rawLogNumber} width="25px" height="25px">
    </svg>
  }
}

export default RawLogNumberIcon;