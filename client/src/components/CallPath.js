import React from 'react';
import LoggingPoint from './LoggingPoint';
import './CallPath.css'

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