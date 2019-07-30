import React from "react";
import Callpath from "../components/CallPath.js";

// TODO: convert this to a function component

class ExceptionContainer extends React.PureComponent {
  render() {
    const {
      loggingPointClicked,
      exceptionData,
      currentFile,
      duplicatesClicked,
    } = this.props;

    return exceptionData.map((callPathElement, index) => (
      <Callpath
        key={index}
        callPathElement={callPathElement}
        currentFile={currentFile}
        loggingPointClicked={loggingPointClicked}
        duplicatesClicked={duplicatesClicked}
      />
    ));
  }
}

export default ExceptionContainer;