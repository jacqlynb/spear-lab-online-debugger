import React from 'react';
import './CodeLine.css';

const codeline = (props) => {
  const { code, linesToHighlight, targetLineNumber } = props;
  console.log('[CodeLine.js] code: ', code);
  console.log('[CodeLine.js] filename ', code.fileName)
  const lines = code.map((line, index) => {
    let highlight;
    if (line.lineNumber === targetLineNumber) {
      highlight = 'targetLine'
    } else if (linesToHighlight.includes(line.lineNumber)) {
      highlight = 'highlight'
    } else {
      highlight = null;
    }
    if (line.lineNumber > (targetLineNumber - 10) && 
        line.lineNumber < (targetLineNumber + 30)) {
          console.log("target line number: ", targetLineNumber);
      return (
        <div className="CodeLine" key={index}>
          <p className={highlight}>
            <span className="lineFormatting">{line.lineNumber}</span>
            <span className="codeFormatting">{line.codeLine}</span>
          </p>
        </div>
      )
      } else {
        return null;
      }
  });
  return lines;
}

export default codeline;