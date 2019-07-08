import React from "react";
import Callpath from "./CallPath.js";

// TODO: convert this to a function component
class ExceptionContainer extends React.PureComponent {
  render() {
    const {
      onClick,
      exceptionData,
      currentFile,
    } = this.props;

    return exceptionData.map((callPathElement, index) => (
      <Callpath
        key={index}
        callPathElement={callPathElement}
        currentFile={currentFile}
        onClick={onClick}
      />
    ));
  }
}

export default ExceptionContainer;
