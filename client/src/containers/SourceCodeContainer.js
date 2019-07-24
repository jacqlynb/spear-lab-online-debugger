import React from "react";
import { Element, Events, animateScroll, scroller } from "react-scroll";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import CodeLine from "../components/CodeLine";
import SourceCodeGridElement from "../components/SourceCodeGridElement";
import "./SourceCodeContainer.css";

const SCROLL_OFFSET_PX_TAB = -8;
const SCROLL_OFFSET_PX_GRID = -4;
const SCROLL_DURATION = 250;

class SourceCodeContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.scrollToCurrentLine = this.scrollToCurrentLine.bind(this);
  }

  componentDidMount() {
    Events.scrollEvent.register("begin", () => {
      // console.log("begin", arguments);
    });
    Events.scrollEvent.register("end", () => {
      // console.log("end", arguments);
    });
  }

  componentDidUpdate() {
    if (!this.props.gridView) {
      this.scrollToCurrentLine();
    }
  }

  componentWillUnmount() {
    Events.scrollEvent.remove("begin");
    Events.scrollEvent.remove("end");
  }

  scrollToCurrentLine() {
    const containerId = this.props.gridView
      ? "containerElement" + this.props.file.fileName
      : "containerElement";

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
    const codeLinesMarkup = (file && allSelectedFiles.length > 0)
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
          let currentFileName = elem.fileName;
          return (
            <Tab key={currentFileName}>
              {currentFileName}
              <button
                className="tabExitButton"
                onClick={() => onExitButtonClick(currentFileName)}
              >
                x
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
      ? allSelectedFiles.map(file => {
          const sourceCodeElement = sourceCode.find(elem => {
            return file.fileName === elem.fileName;
          });
          return (
            <SourceCodeGridElement
              onClick={onExitButtonClick}
              file={file}
              sourceCode={sourceCodeElement}
              linesToHighlight={linesToHighlight}
            />
          );
        })
      : null;

    const elementStyle = file
      ? {
          position: "relative",
          height: "500px",
          overflow: "auto",
          marginBottom: "100px"
        }
      : null;

    const elementClassName = file ? "element" : null;

    const blankSpace = [];
    for (let i = 1; i <= 30; i++) {
      blankSpace.push(<br />);
    }

    const sourceCodeMarkup = gridView ? (
      <div className="sourceCodeGrid">{gridMarkup}</div>
    ) : (
      <div>
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

