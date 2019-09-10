import React from 'react';
import ReactTooltip from 'react-tooltip';
import { Navbar } from '../components/Navbar';
import ExceptionContainer from './ExceptionContainer';
import RawLogContainer from '../containers/RawLogContainer';
import SourceCodeContainer from '../containers/SourceCodeContainer';
import GraphContainer from '../containers/GraphContainer';
import { constructLogHierarchy, constructLogHierarchyAllPaths } from '../helpers/helpers';
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
    this.handleRawLogChanged = this.handleRawLogChanged.bind(this);
  }

  state = {
    exceptionData: [],
    logData: [],
    logDataHierarchical: [],
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
    multipleFromSameFile: false,
    checkBoxItems: []
  };

  componentDidMount() {
    this.fetchIssues()
      .then(issues => {
        if (!this.state.currentIssue) {
        this.setState({ 
          issues,
          currentIssue: 'HADOOP-2486'
        });
        this.handleIssueClicked('HADOOP-2486');
      } else {
        this.setState({ issues });
      }
      })
      .catch(err => console.log(err));
  }

  render() {
    const {
      issues,
      currentIssue,
      exceptionData,
      logData,
      logDataHierarchical,
      logDataHierarchicalAllPaths,
      sourceCode,
      linesToHighlight,
      currentFile,
      allSelectedFiles,
      sourceCodeTabIndex,
      gridView,
      tabView,
      graphView,
      searchSuggestions,
      rawLogData,
      checkBoxItems,
      multipleFromSameFile
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
          <ExceptionContainer
            currentIssue={currentIssue}
            loggingPointClicked={this.handleFileChanged}
            duplicatesClicked={this.toggleDuplicates}
            exceptionData={exceptionData}
            currentFile={currentFile}
            allSelectedFiles={allSelectedFiles}
            graphView={graphView}
            rawLogData={rawLogData}
            multiple={multipleFromSameFile}
          />
        </div>
      );

    const logMarkup =
      logData.length === 0 ? null : (
        <div className="exception">
          <ExceptionContainer
            currentIssue={currentIssue}
            loggingPointClicked={this.handleFileChanged}
            duplicatesClicked={this.toggleDuplicates}
            exceptionData={logData}
            currentFile={currentFile}
            allSelectedFiles={allSelectedFiles}
            graphView={graphView}
            rawLogData={rawLogData}
            graphViewClick={this.toggleGraphView}
            multiple={multipleFromSameFile}
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

    const sourceCodeHeaderWrapper = (
      <div className="sourceCodeHeaderWrapper">
        {gridViewIconMarkup}
        {tabViewIconMarkup}
      </div>
    );

    console.log('[App.js] graphView', graphView);

    const landingPageMarkup = (
      <div className="landingPage">
        <h2>Getting started:</h2>
        <ul className="landingPageList">
        <li><p>On the left panel, click on a logging point to view the corresponding line in the source code file</p></li>
        <li><p>Toggle the switch to open multiple windows for the same source code file</p></li>
        <li><p>If there is raw log data, the {<img src={graphIcon} className="graphIcon--landingPage"/>}icon will appear. Click it to view a visualization of multiple raw log data points</p></li>
        <li><p>Use the search box to view other HADOOP issues</p></li>
        </ul>
      </div>
    )

    const sourceCodeMarkup =
      (sourceCode.length === 0 || allSelectedFiles.length === 0) ? landingPageMarkup : (
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

    const rawLogMarkup = (
      <RawLogContainer
        change={this.handleRawLogChanged}
        checkBoxItems={checkBoxItems}
        logData={logData}
        click={this.toggleGraphView}
      />
    );

    const graphMarkup = (
      <div className="graphContainer">
        {sourceCodeHeaderWrapper}
        <GraphContainer
          allSelectedFiles={allSelectedFiles}
          logData={logDataHierarchical}
          logDataAllPaths={logDataHierarchicalAllPaths}
          checkBoxItems={checkBoxItems}
        />
      </div>
    );

    const callPathMarkup = (
      <div className={graphView ? 'rawLogContainer' : 'exceptionContainer'}>
        {exceptionMarkup}
        {logMarkup}
      </div>
    );

    return (
      <div className="app">
        {navBarMarkup}
        <div className="callPathContainer">
          {graphView ? rawLogMarkup : callPathMarkup}
          <div className="sourceCodeContainer">
            {graphView ? graphMarkup : sourceCodeMarkup}
          </div>
        </div>
      </div>
    );
  }

  // Change to handleFileChange
  handleFileChanged(fileName, lineNumber, methodName) {
    const files = [...this.state.allSelectedFiles];

    let duplicateFile = [];
    if (!this.state.multipleFromSameFile) {
      duplicateFile = files.filter(file => {
        if (file.fileName === fileName) {
          return file;
        }
      });
    } else {
      duplicateFile = files.filter(file => {
        if (file.fileName === fileName && file.lineNumber === lineNumber && file.methodName === methodName) {
          return file;
        }
      })
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
    console.log('handleTabExitClicked called')
    console.log('allSelectedfiles: ', this.state.allSelectedFiles);
    const files = [...this.state.allSelectedFiles];

    const filesUpdated = files.filter(file => {
      if (file.fileName === fileToRemove.fileName && file.lineNumber === fileToRemove.lineNumber && file.methodName === fileToRemove.methodName) {
        return null;
      } else {
        return file;
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

    let logDataHierarchical = [];
    if (log.length !== 0) {
      logDataHierarchical = constructLogHierarchy(log);
    }

    let logDataHierarchicalAllPaths = [];
    if (log.length !== 0) {
      logDataHierarchicalAllPaths = constructLogHierarchyAllPaths(log)
    }

    this.setState({
      currentIssue: issueTitle,
      currentFile: '',
      allSelectedFiles: [],
      exceptionData: exception,
      logData: log,
      logDataHierarchical,
      logDataHierarchicalAllPaths,
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
    let graph = !this.state.graphView;
    this.setState({
      gridView: false,
      tabView: false,
      graphView: graph
    });
  }

  toggleDuplicates() {
    const duplicates = this.state.multipleFromSameFile;
    this.setState({ multipleFromSameFile: !duplicates });
  }

  handleClickOutsideSearchBox() {
    this.setState({ suggestions: [] });
  }

  handleRawLogChanged(item) {
    const currentCheckedItems = [...this.state.checkBoxItems];

    if (currentCheckedItems.includes(item)) {
      currentCheckedItems.splice(currentCheckedItems.indexOf(item), 1);
    } else if (currentCheckedItems.length >= 2) {
      currentCheckedItems.pop();
      currentCheckedItems.push(item);
    } else {
      currentCheckedItems.push(item);
    }

    this.setState({ checkBoxItems: currentCheckedItems });
  }
}

export default App;
