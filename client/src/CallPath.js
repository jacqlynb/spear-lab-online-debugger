import React from 'react';
import './CallPath.css'
import LoggingPoint from './LoggingPoint';

const callpath = (props) => {
  return (
    <div className="CallPath">
    <p className="callpath-header">Call path: </p>
      <LoggingPoint
      exceptionElement = {props.callPathElement}/>
    </div>
  )
}

export default callpath;