import React from 'react';
import RawLogNumberIcon from './RawLogNumberIcon';
import './RawLogLine.css';

class RawLogLine extends React.Component {
  render() {
    const { disabled, checked, changed, rawLogNumber } = this.props;

    return (
      
      <div className={checked ? "rawLogLine--checked" : "rawLogLine"}>
        <div className="checkbox">
          <label>
            <div className="logLineWrapper">
              <input
                type="checkbox"
                className="checkbox--input"
                checked={checked}
                disabled={disabled}
                onChange={changed}
              />
              <span className="React__checkbox--span" />
              <div className="logText">{this.props.name}</div>
            </div>
          </label>
        </div>
      </div>
    );
  }
}

export default RawLogLine;
