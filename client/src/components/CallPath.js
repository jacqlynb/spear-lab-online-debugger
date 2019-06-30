import React from "react";
import LoggingPoints from "./LoggingPoints";
import "./Callpath.css";

// TODO: convert to function component
class Callpath extends React.Component {
  render() {
    const {
      callPathElement,
      log,
      onClick,
      currentFile,
      // currentCodeLine,
    } = this.props;

    return (
      <div className="CallPath">
        <p className="callpath-header">Call path:</p>
        <LoggingPoints
          loggingPointData={callPathElement}
          log={log}
          onClick={onClick}
          currentFile={currentFile}
          // currentCodeLine={currentCodeLine}
        />
      </div>
    );
  }
}

export default Callpath;
