import React from "react";
import "./CodeLine.css";

const codeline = props => {
  const { code, linesToHighlight, file } = props;
  let highlight;

  const line = code;

  if (line.lineNumber === file.lineNumber) {
    highlight = "targetLine";
  } else if (linesToHighlight.includes(line.lineNumber)) {
    highlight = "highlight";
  } else {
    highlight = null;
  }

  const codeLineMarkup = (
    <div className="CodeLine">
      <p className={highlight}>
        <span className="lineFormatting">{line.lineNumber}</span>
        <span className="codeFormatting">{line.codeLine}</span>
      </p>
    </div>
  );

  return codeLineMarkup;
};

export default codeline;
