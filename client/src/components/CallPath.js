import React from "react";
import LoggingPoints from "./LoggingPoints";
import "./CallPath.css";

// TODO: convert to function component
class Callpath extends React.Component {
  render() {
    const { callPathElement, log, onClick, currentFile } = this.props;

    return (
      <div className="CallPath">
        <p className="callpath-header">Call path:</p>
        <div className="loggingPointsContainer">
          <LoggingPoints
            loggingPointData={callPathElement}
            log={log}
            onClick={onClick}
            currentFile={currentFile}
          />
        </div>
      </div>
    );
  }
}

export default Callpath;
