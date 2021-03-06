import React from 'react';
import { Element, Events, scroller } from 'react-scroll';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import CodeLine from '../components/CodeLine';
import SourceCodeGridElement from '../components/SourceCodeGridElement';
import './SourceCodeContainer.css';

const SCROLL_OFFSET_PX_TAB = -8;
const SCROLL_OFFSET_PX_GRID = -4;
// const SCROLL_DURATION = 250;
const tabExitButton = require('../images/close-circle.png');

class SourceCodeContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.scrollToCurrentLine = this.scrollToCurrentLine.bind(this);
  }

  componentDidMount() {
    Events.scrollEvent.register('begin', () => {
    });
    Events.scrollEvent.register('end', () => {
    });
  }

  componentDidUpdate() {
    if (!this.props.gridView) {
      this.scrollToCurrentLine();
    }
  }

  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }

  scrollToCurrentLine() {
    const containerId = this.props.gridView
      ? 'containerElement' +
        this.props.file.fileName +
        this.props.file.lineNumber
      : 'containerElement';

    const scrollOffset = this.props.gridView
      ? SCROLL_OFFSET_PX_GRID
      : SCROLL_OFFSET_PX_TAB;

    scroller.scrollTo((this.props.file.lineNumber + scrollOffset).toString(), {
      smooth: true,
      duration: 0,
      containerId: containerId,
      to: this.props.file.lineNumber
    });
  }

  render() {
    const {
      onClick,
      onExitButtonClick,
      sourceCode,
      linesToHighlight,
      file,
      allSelectedFiles,
      tabIndex,
      gridView
    } = this.props;

    const sourceCodeToRender = sourceCode.filter(elem => {
      if (elem.fileName === file.fileName) {
        return elem;
      } else {
        return null;
      }
    });

    // if call path element selected
    const codeLinesMarkup =
      file && allSelectedFiles.length > 0
        ? sourceCodeToRender.map(elem => {
            return elem.codeLines.map(line => (
              <Element name={`${line.lineNumber}`} key={line.lineNumber}>
                <CodeLine
                  code={line}
                  linesToHighlight={linesToHighlight}
                  file={file}
                />
              </Element>
            ));
          })
        : null;

    const tabsList = allSelectedFiles
      ? allSelectedFiles.map((elem, index) => {
          let currentFileName = elem;
          let tabStyle = null;
          if (!currentFileName === file.fileName) {
            tabStyle = { background: 'black' };
          }
          return (
            <Tab
              style={tabStyle}
              key={currentFileName.fileName + currentFileName.lineNumber}
            >
              {currentFileName.fileName}
              <button
                onClick={() => onExitButtonClick(currentFileName)}
                className="tabExitButton"
              >
                <img src={tabExitButton} alt="exit button" className="tabExitIcon" />
              </button>
            </Tab>
          );
        })
      : null;

    const tabPanelsList = allSelectedFiles
      ? allSelectedFiles.map(elem => {
          return <TabPanel key={elem.fileName} />;
        })
      : null;

    const tabsMarkup = file ? (
      <div className="tabHeader">
        <Tabs selectedIndex={tabIndex} onSelect={tabIndex => onClick(tabIndex)}>
          <TabList>{tabsList}</TabList>
          {tabPanelsList}
        </Tabs>
      </div>
    ) : null;

    const gridMarkup = file
      ? allSelectedFiles.map((file, i) => {
          const sourceCodeElement = sourceCode.find(elem => {
            return file.fileName === elem.fileName;
          });
          return (
            <SourceCodeGridElement
              key={i}
              onExitButtonClick={onExitButtonClick}
              file={file}
              sourceCode={sourceCodeElement}
              linesToHighlight={linesToHighlight}
            />
          );
        })
      : null;

    const elementStyle = file
      ? {
          position: 'relative',
          height: '500px',
          overflow: 'auto',
          marginBottom: '100px'
        }
      : null;

    const elementClassName = file ? 'element' : null;

    const blankSpace = [];
    for (let i = 1; i <= 30; i++) {
      blankSpace.push(<br key={i} />);
    }

    let gridClass = null;
    if (allSelectedFiles.length === 1) {
      gridClass = 'sourceCodeGrid-1';
    } else if (allSelectedFiles.length === 2) {
      gridClass = 'sourceCodeGrid-2';
    } else {
      gridClass = 'sourceCodeGrid';
    }

    const sourceCodeMarkup = gridView ? (
      <div className={gridClass}>{gridMarkup}</div>
    ) : (
      <div className="sourceCodeContainer">
        {tabsMarkup}
        <Element
          className={elementClassName}
          id="containerElement"
          style={elementStyle}
        >
          {codeLinesMarkup}
          {blankSpace}
        </Element>
      </div>
    );

    return <div>{sourceCodeMarkup}</div>;
  }
}

export default SourceCodeContainer;
