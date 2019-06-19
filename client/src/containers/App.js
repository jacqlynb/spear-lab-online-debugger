import React, { PureComponent } from 'react';
import ExceptionContainer from '../components/ExceptionContainer';
import LogContainer from '../components/LogContainer';
import SourceCodeContainer from '../components/SourceCodeContainer';
import Issues from '../components/Issues';
import './App.css';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.fetchDocument = this.fetchDocument.bind(this);
    this.handleFileChanged = this.handleFileChanged.bind(this);
  }

  state = {
    exceptionData: [],
    logData: [],
    sourceCode: [],
    linesToHighlight: [],
    issues: [],
    currentIssue: null,
    currentFile: '',
    currentCodeLine: null
  };

  componentDidMount() {
    this.fetchIssues()
      .then(issues => {
        this.setState({ issues });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { issues, exceptionData, logData, sourceCode, linesToHighlight, 
            currentCodeLine, currentFile } = this.state;

    console.log("App.js currentFile: ", currentFile);

    const issuesMarkup =
      issues.length === 0 ? null : (
        <div className="issues">
          <p className="issuesHeader">Issues:</p>
          <Issues
            clicked={this.handleTitleClicked.bind(this)}
            issues={this.state.issues}
            currentIssue={this.state.currentIssue}
          />
        </div>
      );

    const exceptionMarkup = 
      exceptionData.length === 0? null : (
        <div className="exception">
          <p className="exceptionHeader">Exception: </p>
          <ExceptionContainer 
            // sourceCode={sourceCode}
            exceptionData={exceptionData} 
            click={this.handleFileChanged}
          />
        </div>
      );
      

    const logMarkup = 
      logData.length === 0 ? null : (
        <div className="log">
          <p className="exceptionHeader">Log: </p>
          <LogContainer logData={logData} />
        </div>
      );

     const codelines = 
      sourceCode.length === 0 ? null : (
        <div className="sourceCode">
          <p className="sourceCodeHeader">Source Code: </p>
          <SourceCodeContainer 
            sourceCode={sourceCode}
            linesToHighlight={linesToHighlight}
            file={currentFile}
            codeLine={currentCodeLine}/>
        </div>
      );

    return (
      <div className="app">
        <div className="header">Working title</div>
        <div className="container">
          {issuesMarkup}
          <div className="callPath">
            {exceptionMarkup}
            {logMarkup}
          </div>
          <div className="sourceCode">{codelines}</div>
        </div>
      </div>
    );
  }

  showLoggingPoint(fileName, lineNumber) {
    console.log("show logging point App.js " + fileName + " " + lineNumber);
  }

  handleFileChanged(fileName, lineNumber) {
    console.log("App.js file name is: " + fileName.toString());
    console.log("App.js current file set?")
    this.setState({
      currentFile: fileName,
      currentCodeLine: lineNumber
    });
  }

  getLinesToHighlight() {
    const { exceptionData, logData } = this.state
    let exceptionLineNumbers = [];
    if (exceptionData.length !== 0) {
      exceptionData.forEach(exception => {
        exception.forEach(loggingPoint => {
          exceptionLineNumbers.push(loggingPoint.lineNumber)
        })
      })
    }
    let logLineNumbers = [];
    if (logData.length !== 0) {
      logData.forEach(log => {
        log.forEach(loggingPoint => {
          logLineNumbers.push(loggingPoint.lineNumber)
        })
      });
    }
    const lineNumbers = exceptionLineNumbers.concat(logLineNumbers);
    this.setState({ linesToHighlight: lineNumbers });
  }

  handleTitleClicked(title) {
    this.setState({ currentIssue: title }, this.fetchDocument);
  }

  fetchIssues = async () => {
    try {
      const data = await fetch("/hello");
      return data.json();
    } catch (error) {
      console.log("Error in callApi", error);
    }
  };

  fetchDocument = async () => {
    try {
      const data = await fetch("/callpath", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post: this.state.currentIssue })
      });
      const body = await data.text();
      const bodyParsed = JSON.parse(body);
      this.setState({
        exceptionData: bodyParsed.exception,
        logData: bodyParsed.log,
        sourceCode: bodyParsed.sourceCode
      });
      this.getLinesToHighlight();
    } catch (error) {
      console.log("error", error);
    }
  };
}

export default App;
