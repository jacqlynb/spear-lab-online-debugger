import React from "react";
import ExceptionContainer from "../components/ExceptionContainer";
import LogContainer from "../components/LogContainer";
import SourceCodeContainer from "../components/SourceCodeContainer";
import Issues from "../components/Issues";
import "./App.css";

const gridIcon = require("../grid-icon.png");

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleIssueClicked = this.handleIssueClicked.bind(this);
    this.handleFileChanged = this.handleFileChanged.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleTabExitButtonClicked = this.handleTabExitButtonClicked.bind(
      this
    );
    this.toggleGridView = this.toggleGridView.bind(this);
  }

  state = {
    exceptionData: [],
    logData: [],
    sourceCode: [],
    linesToHighlight: [],
    issues: [],
    currentIssue: null,
    currentFile: {
      lineNumber: null,
      fileName: null
    },
    allSelectedFiles: [
      {
        lineNumber: null,
        fileName: null
      }
    ],
    sourceCodeTabIndex: 0,
    currentLoggingPoint: "",
    gridView: false
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
      sourceCodeTabIndex,
      gridView
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
            onClick={this.handleFileChanged}
            exceptionData={exceptionData}
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
          <div className="sourceCodeHeaderWrapper">
            <p className="sourceCodeHeader">Source Code: </p>
            <img
              className="gridIcon"
              onClick={this.toggleGridView}
              src={gridIcon}
              alt="Grid view icon"
            />
          </div>
          <SourceCodeContainer
            onClick={this.handleChangeTab}
            onTabClick={this.handleFileChanged}
            onExitButtonClick={this.handleTabExitButtonClicked}
            sourceCode={sourceCode}
            linesToHighlight={linesToHighlight}
            file={currentFile}
            allSelectedFiles={allSelectedFiles}
            tabIndex={sourceCodeTabIndex}
            gridView={gridView}
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

  // Change to handleFileChange
  handleFileChanged(fileName, lineNumber) {
    const files = [...this.state.allSelectedFiles];

    const duplicateFile = files.filter(file => {
      if (file.fileName === fileName) {
        return file;
      } else {
        return null;
      }
    });

    let tabIndex;
    let filesUpdated;

    // refactor later... a little confusing
    if (duplicateFile.length === 0) {
      files.push({ fileName, lineNumber });
      filesUpdated = files;
      tabIndex = files.length - 1;
    } else {
      filesUpdated = files.map((file, index) => {
        let newFile = file;
        if (file.fileName === fileName) {
          tabIndex = index;
          newFile.lineNumber = lineNumber
        }
        return newFile;
      });
    }

    this.setState({
      currentFile: { fileName, lineNumber },
      allSelectedFiles: filesUpdated,
      sourceCodeTabIndex: tabIndex
    });
    return;
  }

  handleChangeTab(tabIndex) {
    const files = [...this.state.allSelectedFiles];
    console.log("[App.js] handleChangeTab", files);
    const fileToSet = files.find((_, index) => index === tabIndex);
    console.log("[App.js] handleChangeTab fileToSet", fileToSet);

    this.setState({
      sourceCodeTabIndex: tabIndex,
      currentFile: fileToSet
    });
  }

  getLinesToHighlight() {
    const { exceptionData, logData } = this.state;
    let exceptionLineNumbers = [];
    if (exceptionData.length !== 0) {
      exceptionData.forEach(exception => {
        exception.forEach(loggingPoint => {
          exceptionLineNumbers.push(loggingPoint.lineNumber);
        });
      });
    }

    let logLineNumbers = [];
    if (logData.length !== 0) {
      logData.forEach(log => {
        log.forEach(loggingPoint => {
          logLineNumbers.push(loggingPoint.lineNumber);
        });
      });
    }

    return [...exceptionLineNumbers, ...logLineNumbers];
  }

  handleTabExitButtonClicked(fileToRemove) {
    console.log("[App.js] handleTabExit fileToRemove: ", fileToRemove);
    const files = [...this.state.allSelectedFiles];

    const filesUpdated = files.filter(file => {
      console.log("[App.js] file.fileName", file.fileName);
      if (file.fileName !== fileToRemove) {
        return file;
      } else {
        return null;
      }
    });

    console.log(
      "[App.js] handleTabExitButtonClicked filesUpdated.length: ",
      filesUpdated.length
    );
    const tabIndex =
      this.state.sourceCodeTabIndex <= filesUpdated.length - 1
        ? this.state.sourceCodeTabIndex
        : filesUpdated.length - 1;

    console.log(this.state.sourceCodeTabIndex <= filesUpdated.length - 1);
    console.log(
      "[App.js] handleTabExitButtonClicked this.state.tabIndex: ",
      this.state.sourceCodeTabIndex
    );
    console.log("[App.js] handleTabExitButtonClicked tabIndex: ", tabIndex);

    this.setState({
      allSelectedFiles: filesUpdated,
      sourceCodeTabIndex: tabIndex
    });
  }

  async handleIssueClicked(issueTitle) {
    const { exception, log, sourceCode } = await this.fetchDocument(issueTitle);
    const linesToHighlight = this.getLinesToHighlight();

    this.setState({
      currentIssue: issueTitle,
      currentFile: "",
      allSelectedFiles: [],
      exceptionData: exception,
      logData: log,
      sourceCode,
      linesToHighlight
    });
  }

  async fetchIssues() {
    try {
      const data = await fetch("/hello");
      return data.json();
    } catch (error) {
      console.log("Error in callApi", error);
    }
  }

  async fetchDocument(issueTitle) {
    try {
      const data = await fetch("/issues/" + issueTitle);
      const body = await data.text();
      return JSON.parse(body);
    } catch (error) {
      console.log("error", error);
    }
  }

  toggleGridView() {
    console.log(this.state.gridView);
    const gridViewState = !this.state.gridView;
    this.setState({ gridView: gridViewState });
  }
}

export default App;
