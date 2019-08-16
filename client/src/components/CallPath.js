import React from 'react';
import LoggingPoints from './LoggingPoints';
import './CallPath.css';

// TODO: convert to function component
class Callpath extends React.Component {
  render() {
    const {
      callPathElement,
      log,
      loggingPointClicked,
      currentFile,
      allSelectedFiles
    } = this.props;

    return (
      <div className="CallPath">
        <div className="loggingPointsContainer">
          <LoggingPoints
            loggingPointData={callPathElement}
            log={log}
            loggingPointClicked={loggingPointClicked}
            currentFile={currentFile}
            allSelectedFiles={allSelectedFiles}
          />
        </div>
      </div>
    );
  }
}

export default Callpath;
