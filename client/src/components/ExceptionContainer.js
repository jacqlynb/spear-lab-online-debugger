import React from "react";
import Callpath from "./Callpath.js";

// TODO: convert this to a function component
class ExceptionContainer extends React.PureComponent {
  render() {
    const {
      onClick,
      exceptionData,
      currentCodeLine,
      currentFile,
      secondCodeLine,
      secondFile
    } = this.props;

    return exceptionData.map((callPathElement, index) => (
      <Callpath
        key={index}
        callPathElement={callPathElement}
        currentFile={currentFile}
        currentCodeLine={currentCodeLine}
        secondFile={secondFile}
        secondCodeLine={secondCodeLine}
        onClick={onClick}
      />
    ));
  }
}

export default ExceptionContainer;
