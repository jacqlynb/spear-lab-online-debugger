import React from 'react';
import './LoggingPoint.css';

const log = (props) => {
  let logs = props.exceptionElement.map((e) => {
      return (
        <div className="LoggingPoint">
          <p>Line number: {e.lineNumber}</p>
          <p>Method name: {e.methodName}</p>
          <p>Class name: {e.className}</p>
          <p>Content: {e.content}</p>
        </div>
      );
    })
  return (logs);
}

export default log;