import React from 'react';
import LoggingPoint from './LoggingPoint';
import './Callpath.css'

class Callpath extends React.Component {
  constructor(props) {
    super(props);
    this.showLoggingPoint = this.showLoggingPoint.bind(this);

  }
  

  showLoggingPoint(fileName, lineNumber) {
    console.log('called');
    console.log(fileName.toString());
    console.log(lineNumber);
    this.props.click(fileName, lineNumber);
  }
  
  render() {
    return (
    <div className="CallPath">
    <p className="callpath-header">Call path: </p>
      <LoggingPoint
        loggingPointData={this.props.callPathElement}
        log={this.props.log}
        loggingPointClicked={this.props.click}
      />
    </div>

    )
  }

}

export default Callpath;