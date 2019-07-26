import React from 'react';
import ReactTooltip from 'react-tooltip';
import Navbar from '../components/Navbar';
import ExceptionContainer from '../containers/ExceptionContainer';
import RawLogContainer from '../containers/RawLogContainer';
import SourceCodeContainer from '../containers/SourceCodeContainer';
import GraphContainer from '../containers/GraphContainer';
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
    currentLoggingPoint: '',
    searchSuggestions: [],
    rawLogData: false,
    gridView: false,
    tabView: false,
    graphView: false
  };

  componentDidMount() {
    this.fetchIssues()
      .then(issues => {
        console.log('[App.js] componentDidMount', issues);
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
            onClick={this.handleFileChanged}
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
            onClick={this.handleFileChanged}
            exceptionData={logData}
            currentFile={currentFile}
          />
        </div>
      );

    const gridViewIconMarkup = (
      <div>
        <img
          data-tip="Grid view"
          className="gridIcon"
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
          className="tabIcon"
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
          className="graphIcon"
          onClick={graphView ? null : this.toggleGraphView}
          src={graphIcon}
          alt="Tab view"
        />
        <ReactTooltip />
      </div>
    );

    const sourceCodeMarkup =
      sourceCode.length === 0 ? null : (
        <div className="sourceCode">
          <div className="sourceCodeHeaderWrapper">
            {gridViewIconMarkup}
            {tabViewIconMarkup}
            {rawLogData ? graphViewIconMarkup : null}
          </div>
          <SourceCodeContainer
            onClick={this.handleChangeTab}
            onTabClick={this.handleFileChanged}
            onExitButtonClick={this.handleTabExitClicked}
            sourceCode={sourceCode}
            linesToHighlight={linesToHighlight}
            file={currentFile}
            allSelectedFiles={allSelectedFiles}
            tabIndex={sourceCodeTabIndex}
          />
        </div>
      );

    const rawLogMarkup = <RawLogContainer logData={logData} />;

    const graphMarkup = (
      <div className="graphContainer">
        <GraphContainer />
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
          newFile.lineNumber = lineNumber;
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
    console.log('[App.js] handleIssueClicked', issueTitle);
    const { exception, log, sourceCode } = await this.fetchDocument(issueTitle);
    const linesToHighlight = this.getLinesToHighlight(exception, log);
    const rawLogData = issueTitle === 'HADOOP-2486';
    console.log('[App.js] rawLogData', rawLogData);

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
    console.log('[App.js] grid view toggled');
    this.setState({
      gridView: true,
      tabView: false,
      graphView: false
    });
  }

  toggleTabView() {
    console.log('[App.js] tab view toggled');
    this.setState({
      gridView: false,
      tabView: true,
      graphView: false
    });
  }

  toggleGraphView() {
    console.log('[App.js] graph view toggled');
    this.setState({
      gridView: false,
      tabView: false,
      graphView: true
    });
  }

  handleClickOutsideSearchBox() {
    console.log('Called!!!');
    this.setState({ suggestions: [] });
  }
}

export default App;
