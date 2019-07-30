import React from 'react';
import './RawLogLine.css';

class RawLogLine extends React.Component {
  render() {
    const { disabled, checked, changed } = this.props;

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
              <div style={{background: "blue"}}>
              <svg 
                className="numberIcon"
                width="20px"
                height="20px"
                viewBox="0 0 100 100"
                >
                <circle
                  style={{fill: "pink"}}
                  fill="#49c"
                  r={10}
                  cx="0"
                  cy="0"
                >
                1
                </circle>
              </svg>
              </div>
            </div>
          </label>
        </div>
      </div>
    );
  }
}

export default RawLogLine;
