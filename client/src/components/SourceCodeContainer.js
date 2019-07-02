import React from "react";
import { Element, Events, animateScroll, scroller } from "react-scroll";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
// import { Link } from "react-scroll";

import CodeLine from "./CodeLine";
import "./SourceCodeContainer.css";

// const SCROLL_OFFSET_PX = -80;
const SCROLL_DURATION = 250;

class SourceCodeContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.scrollToCurrentLine = this.scrollToCurrentLine.bind(this);
  }

  componentDidMount() {
    Events.scrollEvent.register("begin", () => {
      console.log("begin", arguments);
    });
    Events.scrollEvent.register("end", () => {
      console.log("end", arguments);
    });
  }

  componentDidUpdate() {
    console.log('[SourceCodeContainer.js] componentDidUpdate')
    this.scrollToCurrentLine();
  }

  componentWillUnmount() {
    Events.scrollEvent.remove("begin");
    Events.scrollEvent.remove("end");
  }

  scrollToCurrentLine() {
    console.log('[SourceCodeContainer.js] currentLine: ', this.props.file.lineNumber);
    console.log('[SourceCodeContainer.js] scrollTo()');

    scroller.scrollTo((this.props.file.lineNumber -8).toString(), {
      smooth: true,
      duration:  SCROLL_DURATION,
      containerId: "containerElement",
      to: this.props.file.lineNumber
    });
  }

  render() {
    console.log('RENDERED SourceCodeContainer');

    const { 
      onClick,
      onExitButtonClick,
      sourceCode, 
      linesToHighlight, 
      file, 
      allSelectedFiles,
      tabIndex
    } = this.props;

    const sourceCodeToRender = sourceCode.filter(elem => {
      if (elem.fileName === file.fileName) {
        console.log("[SourceCodeContainer.js] sourceCode elem", elem);
        return elem;
      } else {
        return null;
      }
    });

    // if call path element selected
    const codeLinesMarkup = file
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

    // console.log('[SourceCodeContainer.js] tabIndex: ', tabIndex);

    const tabsList = allSelectedFiles 
      ? allSelectedFiles.map((elem, index) => {
        let currentFileName = elem.fileName;
        // console.log('[SourceCodeContainer.js] currentFileName for onExitButtonClick', currentFileName)
          return (
            <Tab key={elem.fileName}>
              {elem.fileName}
              <button className="tabExitButton" onClick={() => onExitButtonClick(currentFileName)}>x</button>
            </Tab>
          )
        })
      : null;

    const tabPanelsList = allSelectedFiles 
      ? allSelectedFiles.map(elem => {
          return (
            <TabPanel key={elem}></TabPanel>
          )
        })
      : null;
      
    //console.log('[SourceCodeContainer.js] sourceCode: ', sourceCode);
    const tabsMarkup = file ? (
      <div className="tabHeader">
        <Tabs selectedIndex={tabIndex} onSelect={tabIndex => onClick(tabIndex)}>
          <TabList>
            {tabsList}
          </TabList>
          {tabPanelsList}
        </Tabs>
      </div>
    ) : null;

    const elementStyle = file
      ? {
          position: "relative",
          height: "500px",
          overflow: "auto",
          marginBottom: "100px"
        }
      : null;

    const elementClassName = file ? "element" : null;

    return (
      <div>
        {tabsMarkup}
        <Element
          // name="test7"
          className={elementClassName}
          id="containerElement"
          style={elementStyle}
        >
          {codeLinesMarkup}
        </Element>
      </div>
    );
  }
}

export default SourceCodeContainer;
