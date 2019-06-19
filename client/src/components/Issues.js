import React, {PureComponent} from "react";
import "./Issues.css";

class Issues extends PureComponent {
  render() {
    const { issues, clicked } = this.props;

    return issues.map((issue, index) => {
      let issueText = (issue === this.props.currentIssue) ? 'currentIssueText' : 'issueText';
      return (
        <div className="Issue" onClick={() => clicked(issue)} key={index}>
          <p className={issueText}>{issue}</p>
        </div>
      );
    });
  }
}

export default Issues;
