import React from 'react';
import CodeLine from './CodeLine'
import './SourceCodeContainer.css'

const sourceCodeContainer = (props) => {
  const { sourceCode, linesToHighlight, file, codeLine } = props;
  const codes = sourceCode.map((codeElement, index) => {
      if (codeElement.fileName === file) {
        return (
          <CodeLine
            code={codeElement.codeLines}
            linesToHighlight={linesToHighlight}
            fileName={file}
            targetLineNumber={codeLine}
            key={index}
          />
        )
      }
      else {
        console.log("SourceCodeContainer.js file: ", file);
        return null;
      }
    });
  return codes;
}

export default sourceCodeContainer;