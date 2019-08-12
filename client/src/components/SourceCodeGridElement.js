import React from 'react';
import { Element, scroller } from 'react-scroll';
import CodeLine from './CodeLine';
import '../containers/SourceCodeContainer.css';
import './SourceCodeGridElement.css';

const SCROLL_OFFSET_PX_GRID = -4;

class SourceCodeGridElement extends React.Component {
  constructor(props) {
    super(props);
    this.scrollToTargetLine = this.scrollToTargetLine.bind(this);
  }

  componentDidMount() {
    this.scrollToTargetLine();
  }

  scrollToTargetLine() {
    const containerId =
      'containerElement' +
      this.props.file.fileName +
      this.props.file.lineNumber;

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
    const { file, sourceCode, linesToHighlight, onClick } = this.props;

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

    return (
      <div className="gridElement" key={sourceCode.fileName}>
        <div className="gridElementHeader">
          <h4>{sourceCode.fileName}</h4>
          <button
            className="tabExitButton"
            onClick={() => onClick(sourceCode.fileName)}
          >
            {' '}
            x
          </button>
        </div>
        <Element
          className="gridContainer"
          id={'containerElement' + file.fileName + file.lineNumber}
          style={{
            position: 'relative',
            height: '500px',
            overflow: 'auto',
            marginBottom: '100px'
          }}
        >
          {sourceCodeMarkup}
        </Element>
      </div>
    );
  }
}

export default SourceCodeGridElement;
