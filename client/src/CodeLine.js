import React from 'react';
import './CodeLine.css';

const codeline = (props) => {
  let highlight;
  if (props.linesToHighlight.includes(props.line)) {
    highlight = 'highlight'
  } else {
    
    highlight = null;
  }
    return (
      <div className="CodeLine">
        <p className={highlight}>
          <span className="lineFormatting">{props.line}</span>
          <span className="codeFormatting">{props.code}</span>
        </p>
      </div>
    );
}

export default codeline;