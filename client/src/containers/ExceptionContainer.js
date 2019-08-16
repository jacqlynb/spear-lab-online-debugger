import React from 'react';
import { Switch, FormControlLabel } from '@material-ui/core';
import Callpath from '../components/CallPath.js';
import './ExceptionContainer.css';

// TODO: convert this to a function component

class ExceptionContainer extends React.PureComponent {
  render() {
    const {
      loggingPointClicked,
      exceptionData,
      currentFile,
      duplicatesClicked,
      allSelectedFiles
    } = this.props;

    const callPathMarkup = exceptionData.map((callPathElement, index) => {
      return (
        <Callpath
          key={index}
          callPathElement={callPathElement}
          currentFile={currentFile}
          loggingPointClicked={loggingPointClicked}
          duplicatesClicked={duplicatesClicked}
          allSelectedFiles={allSelectedFiles}
        />
      );
    });

    return (
      <div className="exceptionContainer">
        <h4>{this.props.currentIssue}</h4>
        <div className="formControlLabel">
          <FormControlLabel
            className="formControlLabel"
            labelPlacement="start"
            control={
              <Switch
                className="duplicatesSwitch"
                onClick={() => duplicatesClicked()}
                color="primary"
              />
            }
            label="Enable multiple selections from same file"
          />
        </div>
        {callPathMarkup}
      </div>
    );
  }
}

export default ExceptionContainer;
