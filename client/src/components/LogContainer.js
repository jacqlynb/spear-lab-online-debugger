import React from 'react';
import LoggingPoint from './LoggingPoint.js';
import './LogContainer.css';

const logContainer = (props) => {
  const logElements = props.logData.map((element, index) => {
    return (
      <div className="LogContainer">
        <p className="logContainer-header">Path:</p>
        <LoggingPoint 
          loggingPointData={element}
          key={index}
        />
      </div>
    )
  })
  return logElements;
}


export default logContainer;