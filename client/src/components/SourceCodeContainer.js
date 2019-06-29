import React from "react";
import { Element, Events } from "react-scroll";
import { Tab, Tabs, TabList } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CodeLine from "./CodeLine";
import "./SourceCodeContainer.css";

class SourceCodeContainer extends React.PureComponent {
  componentDidMount() {
    Events.scrollEvent.register("begin", () => {
      console.log("begin", arguments);
    });
    Events.scrollEvent.register("end", () => {
      console.log("end", arguments);
    });
  }

  componentWillUnmount() {
    Events.scrollEvent.remove("begin");
    Events.scrollEvent.remove("end");
  }

  render() {
    console.log('RENDERED SourceCodeContainer')

    const { sourceCode, linesToHighlight, file, targetLineNumber } = this.props;
    const sourceCodeToRender = sourceCode.filter(elem => {
      if (elem.fileName === file) {
        console.log("[SourceCodeContainer.js] sourceCode elem", elem);
        return elem;
      }
    });

    console.log(
      "[SourceCodeContainer.js] sourceCodeToRender",
      sourceCodeToRender
    );

    // if call path element selected
    const codeLinesMarkup = file
      ? sourceCodeToRender.map(elem => {
          return elem.codeLines.map(line => (
            <Element name={`${line.lineNumber}`}>
              <CodeLine
                code={line}
                linesToHighlight={linesToHighlight}
                targetLineNumber={targetLineNumber}
              />
            </Element>
          ));
        })
      : null;

    //console.log('[SourceCodeContainer.js] sourceCode: ', sourceCode);
    const tabsMarkup = file ? (
      <div className="tabHeader">
        <Tabs>
          <TabList>
            <Tab>{file}</Tab>
          </TabList>
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
