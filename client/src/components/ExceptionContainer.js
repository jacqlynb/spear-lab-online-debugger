import React from "react";
import Callpath from "./Callpath.js";

// TODO: convert this to a function component
class ExceptionContainer extends React.PureComponent {
  render() {
    const {
      onClick,
      exceptionData,
      // currentCodeLine,
      currentFile,
    } = this.props;

    return exceptionData.map((callPathElement, index) => (
      <Callpath
        key={index}
        callPathElement={callPathElement}
        currentFile={currentFile}
        // currentCodeLine={currentCodeLine}
        onClick={onClick}
      />
    ));
  }
}

export default ExceptionContainer;
