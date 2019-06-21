import React from 'react';
import PropTypes from 'prop-types';
import './LoggingPoint.css';

const log = (props) => {
  let loggingPoints = props.loggingPointData.map((e, index) => {
    // console.log('[LoggingPoint.js: file name:  ', e.fileName)
    // console.log('[LoggingPoint.js: line number:  ', e.lineNumber)
      return (
        <div className="LoggingPoint">
        <p className="loggingPointText"
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