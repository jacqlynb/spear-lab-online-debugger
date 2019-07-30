import React from "react";
import LoggingPoints from "./LoggingPoints";
import "./CallPath.css";

// TODO: convert to function component
class Callpath extends React.Component {
  render() {
    const { callPathElement, log, loggingPointClicked, currentFile, duplicatesClicked } = this.props;

    return (
      <div className="CallPath">
        <button onClick={() => duplicatesClicked()}>Allow duplicates</button>
        <div className="loggingPointsContainer">
          <LoggingPoints
            loggingPointData={callPathElement}
            log={log}
            loggingPointClicked={loggingPointClicked}
            currentFile={currentFile}
          />
        </div>
      </div>
    );
  }
}

export default Callpath;
