import React from 'react';
// import Autosuggest from 'react-autosuggest';
import ExceptionContainer from '../components/ExceptionContainer';
import LogContainer from '../components/LogContainer';
import SourceCodeContainer from '../components/SourceCodeContainer';
import Issues from '../components/Issues';
// import TestSearch from '../components/TestSearch'
import './App.css';

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleIssueClicked = this.handleIssueClicked.bind(this);
    this.handleFileChanged = this.handleFileChanged.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
  }

  // make a files array that contains file object: filename + targetline

  state = {
    exceptionData: [],
    logData: [],
    sourceCode: [],
    linesToHighlight: [],
    issues: [],
    currentIssue: null,
    currentFile: {
      lineNumber: null,
      fileName: null,
    },
    allSelectedFiles: [{
      lineNumber: null,
      fileName: null
    }],
    sourceCodeTabIndex: 0,
    currentLoggingPoint: ''
  };

  componentDidMount() {
    this.fetchIssues()
      .then(issues => {
        this.setState({ issues });
      })
      .catch(err => console.log(err));
  }

  render() {
    const {
      issues,
      currentIssue,
      exceptionData,
      logData,
      sourceCode,
      linesToHighlight,
      currentFile,
      allSelectedFiles,
      sourceCodeTabIndex
    } = this.state;

    const issuesMarkup =
      issues.length === 0 ? null : (
        <div className="issues">
          {/* Use h2 or h3 instead of p tag */}
          <p className="issuesHeader">Issues:</p>
          <Issues
            clicked={this.handleIssueClicked}
            issues={issues}
            currentIssue={currentIssue}
          />
        </div>
      );

    const exceptionMarkup = 
      exceptionData.length === 0 ? null : (
        <div className="exception">
          <p className="exceptionHeader">Exception: </p>
          <ExceptionContainer
            // sourceCode={sourceCode}
            exceptionData={exceptionData} 
            onClick={this.handleFileChanged}
            currentFile={currentFile}
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

     const sourceCodeMarkup = 
      sourceCode.length === 0 ? null : (
        <div className="sourceCode">
          <p className="sourceCodeHeader">Source Code: </p>
          <SourceCodeContainer
            onClick={this.handleChangeTab}
            sourceCode={sourceCode}
            linesToHighlight={linesToHighlight}
            file={currentFile}
            allSelectedFiles={allSelectedFiles}
            tabIndex={sourceCodeTabIndex}
          />
        </div>
      );

    return (
      <div className="app">
        <div className="header">Working title</div>
        <div className="container">
          <div className="issueContainer">{issuesMarkup}</div>
          <div className="callPath">
            {exceptionMarkup}
            {logMarkup}
          </div>
          <div className="sourceCode">{sourceCodeMarkup}</div>
        </div>
      </div>
    );
  }

  showLoggingPoint(fileName, lineNumber) {
    console.log("show logging point App.js " + fileName + " " + lineNumber);
  }

  handleFileChanged(fileName, lineNumber) {
    console.log('[App.js] handleFileChanged fileName', fileName);
    
    const files = [...this.state.allSelectedFiles];
    console.log('[App.js] handleFileChanged files', files);

    const duplicateFile = files.filter(file => {
      if (file.fileName === fileName) {
        return file;
      }
    })
    
    console.log('[App.js] handleFileChanged duplicateFile', duplicateFile);


    let tabIndex;

    // refactor later... a little confusing
    if (duplicateFile.length === 0) {
      files.push({ fileName, lineNumber });
      tabIndex = files.length - 1;
    } else {
      files.forEach((file, index) => {
        if (file.fileName === fileName) {
          tabIndex = index;
        }
      })
    }

    console.log('[App.js] handleFileChanged tabIndex: ', tabIndex);

    this.setState({
      currentFile: { fileName, lineNumber },
      allSelectedFiles: files,
      sourceCodeTabIndex: tabIndex
    });
  }

  handleChangeTab(tabIndex) {
    const files = [...this.state.allSelectedFiles];
    const fileToSet = files.find((_, index) => index === tabIndex);

    this.setState({ 
      sourceCodeTabIndex: tabIndex, 
      currentFile: fileToSet
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

    return [...exceptionLineNumbers, ...logLineNumbers];
  }

  async handleIssueClicked(issueTitle) {
    const {exception, log, sourceCode} = await this.fetchDocument(issueTitle);
    const linesToHighlight = this.getLinesToHighlight();

    this.setState({
      currentIssue: issueTitle,
      currentFile: '',
      allSelectedFiles: [],
      exceptionData: exception,
      logData: log,
      sourceCode,
      linesToHighlight,
    });
  }

  async fetchIssues() {
    try {
      const data = await fetch("/hello");
      return data.json();
    } catch (error) {
      console.log("Error in callApi", error);
    }
  };

  async fetchDocument(issueTitle) {
    try {
      const data = await fetch("/callpath", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post: issueTitle })
      });
      const body = await data.text();
      console.log('[App.js] body', JSON.parse(body));
      return JSON.parse(body);
    } catch (error) {
      console.log("error", error);
    }
  };
}

export default App;
