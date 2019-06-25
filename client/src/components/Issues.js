import React, { PureComponent } from 'react';
import Autosuggest from 'react-autosuggest';
import "./Issues.css";

class Issues extends PureComponent {
  render() {
    const { issues, clicked } = this.props;

    return issues.map((issue, index) => {
      console.log("issues.js currentissue: ", this.props.currentIssue)
      let issueText = (issue === this.props.currentIssues) ? 'currentIssueText' : 'issueText';
      return (
        <div className="Issue" onClick={() => clicked(issue)} key={index}>
          <p className={issueText}>{issue}</p>
        </div>
      );
    });
  }
}

export default Issues;
