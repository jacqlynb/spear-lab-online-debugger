import React from "react";
import { Element, scroller } from "react-scroll";
import CodeLine from "./CodeLine";
import "./SourceCodeContainer.css";

const SCROLL_OFFSET_PX_GRID = -4;

class SourceCodeGridElement extends React.Component {
  componentDidMount() {
    this.scrollToTargetLine();
  }

  scrollToTargetLine() {
    const containerId = "containerElement" + this.props.file.fileName;

    scroller.scrollTo(
      (this.props.file.lineNumber + SCROLL_OFFSET_PX_GRID).toString(),
      {
        smooth: true,
        duration: 0,
        containerId: containerId,
        to: this.props.file.lineNumber
      }
    );
  }

  componentDidUpdate() {
    this.scrollToTargetLine();
  }

  render() {
    const {
      file,
      sourceCode,
      linesToHighlight,
      onClick
    } = this.props;

    const sourceCodeMarkup = sourceCode.codeLines.map(line => {
      return (
        <Element name={`${line.lineNumber}`} key={line.lineNumber}>
          <CodeLine
            code={line}
            linesToHighlight={linesToHighlight}
            file={file}
          />
        </Element>
      );
    });

    console.log("[SourceCodeGridElement.js] RENDERING...", file.fileName);

    return (
      <div className="gridElement" key={sourceCode.fileName}>
        <div className="gridElementHeader">
          <h4>{sourceCode.fileName}</h4>
          <button
            className="tabExitButton"
            onClick={() => onClick(sourceCode.fileName)}
          >
            {" "}
            x
          </button>
        </div>
        <Element
          className="gridContainer"
          id={"containerElement" + sourceCode.fileName}
          style={{
            position: "relative",
            height: "500px",
            overflow: "auto",
            marginBottom: "100px"
          }}
        >
          {sourceCodeMarkup}
        </Element>
      </div>
    );
  }
}

export default SourceCodeGridElement;

// class SourceCodeGridElement extends React.Component {
//   constructor(props) {
//     super(props);
//     this.scrollToTargetLine = this.scrollToTargetLine.bind(this);
//   }

//   componentDidMount() {
//     this.scrollToTargetLine();
//   }

//   scrollToTargetLine() {
//     console.log(
//       "[SourceCodeContainer.js] currentLine: ",
//       this.props.file.lineNumber
//     );
//     console.log("[SourceCodeContainer.js] scrollTo()");

//     const containerId = "containerElement" + this.props.file.fileName;

//     scroller.scrollTo(
//       (this.props.file.lineNumber + SCROLL_OFFSET_PX_GRID).toString(),
//       {
//         smooth: true,
//         duration: 0,
//         containerId: containerId,
//         to: this.props.file.lineNumber
//       }
//     );
//   }

//   render() {
//     const { file, sourceCode, linesToHighlight } = this.props;

//     console.log('[SourceCodeGridElement.js] file: ', file)
//     console.log('[SourceCodeGridElement.js] sourceCode: ', sourceCode)

//     const sourceCodeMarkup = sourceCode.codeLines.map(line => {
//       return (
//         <div>
//         <Element name={`${line.lineNumber}`} key={line.lineNumber}>
//           <CodeLine
//             code={line}
//             linesToHighlight={linesToHighlight}
//             file={file}
//           />
//         </Element>
//         </div>
//       );
//     });

//     console.log('[SourceCodeGridElement] sourceCodeMarkup' , sourceCodeMarkup);

//     const scrollContainer = (
//       <div>
//       <Element
//         className="gridContainer"
//         id={"containerElement" + file.fileName}
//         style={{
//           position: "relative",
//           height: "500px",
//           overflow: "auto",
//           marginBottom: "100px"
//         }}
//       >
//         {sourceCodeMarkup}
//       </Element>
//       </div>
//     );

//     return { scrollContainer };
//   }
// }

// export default SourceCodeGridElement;
