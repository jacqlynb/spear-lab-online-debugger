import React from "react";
import Autosuggest from "react-autosuggest";
import "./Issues.css";

// TODO: convert to function component?
class Issues extends React.PureComponent {
  render() {
    const { issues, clicked, currentIssue } = this.props;

    return issues.map((issue, index) => {
      const issueClassName =
        issue === currentIssue ? "currentIssueText" : "issueText";

      return (
        <div className="Issue" onClick={() => clicked(issue)} key={index}>
          <p className={issueClassName}>{issue}</p>
        </div>
      );
    });
  }
}

export default Issues;
