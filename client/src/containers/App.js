import React from 'react';
import ReactTooltip from 'react-tooltip';
import { Navbar } from '../components/Navbar';
import ExceptionContainer from './ExceptionContainer';
import RawLogContainer from '../containers/RawLogContainer';
import SourceCodeContainer from '../containers/SourceCodeContainer';
import GraphContainer from '../containers/GraphContainer';
import TestGraph from '../components/TestGraph';
import './App.css';

const gridIcon = require('../images/view-grid.svg');
const tabIcon = require('../images/folder-text.svg');
const graphIcon = require('../images/graph-icon.svg');

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleIssueClicked = this.handleIssueClicked.bind(this);
    this.handleFileChanged = this.handleFileChanged.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleTabExitClicked = this.handleTabExitClicked.bind(this);
    this.toggleGridView = this.toggleGridView.bind(this);
    this.toggleTabView = this.toggleTabView.bind(this);
    this.toggleGraphView = this.toggleGraphView.bind(this);
    this.handleClickOutsideSearchBox = this.handleClickOutsideSearchBox.bind(
      this
    );
    this.toggleDuplicates = this.toggleDuplicates.bind(this);
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
      fileName: null,
      methodName: null
    },
    allSelectedFiles: [
      {
        lineNumber: null,
        fileName: null,
        methodName: null
      }
    ],
    sourceCodeTabIndex: 0,
    currentLoggingPoint: '',
    searchSuggestions: [],
    rawLogData: false,
    gridView: false,
    tabView: false,
    graphView: false,
    multipleFromSameFile: false
  };

  componentDidMount() {
    this.fetchIssues()
      .then(issues => {
        this.setState({ issues, graphView: false });
      })
      .catch(err => console.log(err));
  }

  render() {
    const {
      issues,
      exceptionData,
      logData,
      sourceCode,
      linesToHighlight,
      currentFile,
      allSelectedFiles,
      sourceCodeTabIndex,
      gridView,
      tabView,
      graphView,
      searchSuggestions,
      rawLogData
    } = this.state;

    const navBarMarkup = (
      <Navbar
        issues={issues}
        suggestions={searchSuggestions}
        onClickOutsideSearchBox={this.handleClickOutsideSearchBox}
        onIssueClick={this.handleIssueClicked}
      />
    );

    const exceptionMarkup =
      exceptionData.length === 0 ? null : (
        <div className="exception">
          <p className="exceptionHeader">Exception: </p>
          <ExceptionContainer
            loggingPointClicked={this.handleFileChanged}
            duplicatesClicked={this.toggleDuplicates}
            exceptionData={exceptionData}
            currentFile={currentFile}
          />
        </div>
      );

    const logMarkup =
      logData.length === 0 ? null : (
        <div className="exception">
          <p className="exceptionHeader">Log: </p>
          <ExceptionContainer
            loggingPointClicked={this.handleFileChanged}
            duplicatesClicked={this.toggleDuplicates}
            exceptionData={logData}
            currentFile={currentFile}
          />
        </div>
      );

    const gridViewIconMarkup = (
      <div>
        <img
          data-tip="Grid view"
          className={gridView ? 'gridIcon--selected' : 'gridIcon'}
          onClick={gridView ? null : this.toggleGridView}
          src={gridIcon}
          alt="Grid view"
        />
        <ReactTooltip />
      </div>
    );

    const tabViewIconMarkup = (
      <div>
        <img
          data-tip="Tab view"
          className={tabView ? 'tabIcon--selected' : 'tabIcon'}
          onClick={tabView ? null : this.toggleTabView}
          src={tabIcon}
          alt="Tab view"
        />
        <ReactTooltip />
      </div>
    );

    const graphViewIconMarkup = (
      <div>
        <img
          data-tip="Graph view"
          className={graphView ? 'graphIcon--selected' : 'graphIcon'}
          onClick={graphView ? null : this.toggleGraphView}
          src={graphIcon}
          alt="Tab view"
        />
        <ReactTooltip />
      </div>
    );

    const sourceCodeHeaderWrapper = (
      <div className="sourceCodeHeaderWrapper">
        {gridViewIconMarkup}
        {tabViewIconMarkup}
        {rawLogData ? graphViewIconMarkup : null}
      </div>
    );

    const sourceCodeMarkup =
      sourceCode.length === 0 ? null : (
        <div className="sourceCode">
          {sourceCodeHeaderWrapper}
          <SourceCodeContainer
            onClick={this.handleChangeTab}
            onTabClick={this.handleFileChanged}
            onExitButtonClick={this.handleTabExitClicked}
            sourceCode={sourceCode}
            linesToHighlight={linesToHighlight}
            file={currentFile}
            allSelectedFiles={allSelectedFiles}
            tabIndex={sourceCodeTabIndex}
            gridView={gridView}
          />
        </div>
      );

    const rawLogMarkup = <RawLogContainer logData={logData} />;

    const graphMarkup = (
      <div className="graphContainer">
        {sourceCodeHeaderWrapper}
        <GraphContainer allSelectedFiles={allSelectedFiles} />
        <TestGraph />
      </div>
    );

    const callPathMarkup = (
      <div className={graphView ? 'rawLogContainer' : 'exceptionContainer'}>
        {exceptionMarkup}
        {logMarkup}
      </div>
    );

    // change to callPathContainer, sourceCodeContainer, etc?
    return (
      <div className="app">
        {navBarMarkup}
        <div className="container">
          {graphView ? rawLogMarkup : callPathMarkup}
          <div className="sourceCode">
            {graphView ? graphMarkup : sourceCodeMarkup}
          </div>
        </div>
      </div>
    );
  }

  showLoggingPoint(fileName, lineNumber) {
    console.log('show logging point App.js ' + fileName + ' ' + lineNumber);
  }

  // Change to handleFileChange
  handleFileChanged(fileName, lineNumber, methodName) {
    const files = [...this.state.allSelectedFiles];

    let duplicateFile = [];
    if (!this.state.multipleFromSameFile) {
      duplicateFile = files.filter(file => {
        if (file.fileName === fileName) {
          return file;
        } else {
          return null;
        }
      });
    }

    let tabIndex;
    let filesUpdated;

    // refactor later... a little confusing
    if (duplicateFile.length === 0) {
      files.push({ fileName, lineNumber, methodName });
      filesUpdated = files;
      tabIndex = files.length - 1;
    } else {
      filesUpdated = files.map((file, index) => {
        let newFile = file;
        if (file.fileName === fileName) {
          tabIndex = index;
          newFile.lineNumber = lineNumber;
          newFile.methodName = methodName;
        }
        return newFile;
      });
    }

    this.setState({
      currentFile: { fileName, lineNumber, methodName },
      allSelectedFiles: filesUpdated,
      sourceCodeTabIndex: tabIndex
    });
    return;
  }

  handleChangeTab(tabIndex) {
    const files = [...this.state.allSelectedFiles];
    const fileToSet = files.find((_, index) => index === tabIndex);

    this.setState({
      sourceCodeTabIndex: tabIndex,
      currentFile: fileToSet
    });
  }

  getLinesToHighlight(exceptionData, logData) {
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

  handleTabExitClicked(fileToRemove) {
    const files = [...this.state.allSelectedFiles];

    const filesUpdated = files.filter(file => {
      if (file.fileName !== fileToRemove) {
        return file;
      } else {
        return null;
      }
    });

    const tabIndex =
      this.state.sourceCodeTabIndex <= filesUpdated.length - 1
        ? this.state.sourceCodeTabIndex
        : filesUpdated.length - 1;

    this.setState({
      allSelectedFiles: filesUpdated,
      sourceCodeTabIndex: tabIndex
    });
  }

  async handleIssueClicked(issueTitle) {
    const { exception, log, sourceCode } = await this.fetchDocument(issueTitle);
    const linesToHighlight = this.getLinesToHighlight(exception, log);
    const rawLogData = issueTitle === 'HADOOP-2486';

    this.setState({
      currentIssue: issueTitle,
      currentFile: '',
      allSelectedFiles: [],
      exceptionData: exception,
      logData: log,
      sourceCode,
      linesToHighlight,
      rawLogData,
      gridView: false,
      tabView: false,
      graphView: false
    });
  }

  async fetchIssues() {
    try {
      const data = await fetch('/hello');
      return data.json();
    } catch (error) {
      console.log('Error in callApi', error);
    }
  }

  async fetchDocument(issueTitle) {
    try {
      const data = await fetch('/issues/' + issueTitle);
      const body = await data.text();
      return JSON.parse(body);
    } catch (error) {
      console.log('error', error);
    }
  }

  toggleGridView() {
    this.setState({
      gridView: true,
      tabView: false,
      graphView: false
    });
  }

  toggleTabView() {
    this.setState({
      gridView: false,
      tabView: true,
      graphView: false
    });
  }

  toggleGraphView() {
    this.setState({
      gridView: false,
      tabView: false,
      graphView: true
    });
  }

  toggleDuplicates() {
    const duplicates = this.state.multipleFromSameFile;
    this.setState({ multipleFromSameFile: !duplicates });
  }

  handleClickOutsideSearchBox() {
    this.setState({ suggestions: [] });
  }
}

export default App;
