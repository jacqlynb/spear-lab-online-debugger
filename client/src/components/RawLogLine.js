import React from 'react';
import Icon from '@material-ui/icons';
import './RawLogLine.css';

class RawLogLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };
  }

  _handleChange = () => {
    this.setState({
      checked: !this.state.checked
    });
  };

  render() {
    const { logLine, disabled } = this.props;
    const { checked } = this.state;
    return (
      <div className="rawLogLine">
        <div className="checkbox">
          <label>
          <div className="logLineWrapper">
            <input
              type="checkbox"
              className="checkbox--input"
              checked={checked}
              disabled={disabled}
              onChange={this._handleChange}
            />
            <span className="React__checkbox--span"/>
            <div className="logText">{logLine}</div>
          </div>
          </label>
        </div>
       
      </div>
    );
  }
}

export default RawLogLine;
