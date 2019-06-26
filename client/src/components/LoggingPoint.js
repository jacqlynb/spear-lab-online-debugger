import React from 'react';
import PropTypes from 'prop-types';
import './LoggingPoint.css';

const log = (props) => {
  let loggingPoints = props.loggingPointData.map((e, index) => {
    let currentFileToHighlight;
    if (e.fileName === props.currentFile && e.lineNumber === props.currentCodeLine ||
      e.fileName === props.secondFile && e.lineNumber === props.secondCodeLine) {
      currentFileToHighlight = 'boldFileName'
    } else {
      currentFileToHighlight = 'regularFileName';
    }
      return (
        <div className="LoggingPoint">
        <p className={currentFileToHighlight}
           key={index} onClick={() => 
           props.loggingPointClicked(e.fileName, e.lineNumber)}>
          <span className="fileName">{e.fileName}:{e.lineNumber}</span>
          <span>{e.methodName} </span>
        </p>
        </div>
      );
    })
  return loggingPoints;
}

log.propType = {
  clicked: PropTypes.func
}

export default log;