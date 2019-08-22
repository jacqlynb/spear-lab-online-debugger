import React from 'react';
import { Switch, FormControlLabel, withStyles } from '@material-ui/core';
import ReactTooltip from 'react-tooltip';
import Callpath from '../components/CallPath.js';
import './ExceptionContainer.css';

const graphIcon = require('../images/graph-icon.svg');

// TODO: convert this to a function component
class ExceptionContainer extends React.PureComponent {
  render() {
    const {
      loggingPointClicked,
      exceptionData,
      currentFile,
      duplicatesClicked,
      allSelectedFiles,
      graphView, 
      rawLogData,
      graphViewClick,
      multiple
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

    const formControlLabelStyle = {
      size: '0.2em',
      fontWeight: 'bold',
      color: 'blue'
    };

    const StyledLabel = withStyles({
      label: {
        fontSize: '14px',
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        padding: '10px 0'
      }
    })(FormControlLabel);

    const graphViewIconMarkup = (
      <div>
        <img
          data-tip="View raw log data and callgraph"
          className={graphView ? 'graphIcon--selected' : 'graphIcon'}
          onClick={graphView ? null : graphViewClick}
          src={graphIcon}
          alt="Tab view"
        />
        <ReactTooltip />
      </div>
    );

    console.log("ExceptionContainer rawLogData", rawLogData);

    return (
      <div className="exceptionContainer">
        <div className="exceptionContainerHeader">
        <h4>{this.props.currentIssue}</h4>
        {rawLogData ? graphViewIconMarkup : null}
        </div>
        <div className="formControlLabel">
          <StyledLabel
            className="formControlLabel"
            labelPlacement="start"
            
            // style={formControlLabelStyle}
            control={
              <Switch
                size="small"
                className="duplicatesSwitch"
                onClick={() => duplicatesClicked()}
                color="primary"
                checked={multiple}
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
