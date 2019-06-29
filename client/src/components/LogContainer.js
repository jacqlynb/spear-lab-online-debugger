import React from 'react';
import LoggingPoints from './LoggingPoints';
import './LogContainer.css';

// TODO: use regular named function
const logContainer = (props) => {
  const logElements = props.logData.map((element, index) => {
    return (
      <div className="LogContainer">
        <p className="logContainer-header">Path:</p>
        <LoggingPoints 
          loggingPointData={element}
          key={index}
        />
      </div>
    )
  })
  return logElements;
}


export default logContainer;