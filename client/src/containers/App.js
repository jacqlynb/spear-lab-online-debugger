import React, { Component } from 'react';
import CallPath from '../components/CallPath';
import CodeLine from '../components/CodeLine';
import './App.css';

class App extends Component {
  state = {
    exceptionData: null,
    log: [], 
    sourceCode: null, 
    lineNumbers: null,
  }

  componentDidMount() {
    this.fetchData()
      .then(data => {
        let relevantLineNumbers = data[0][0].exception.map(exceptionElements => {
          return exceptionElements.map((callPath) => {
           return callPath.lineNumber;
          })
        })

        let relevantLineNumbersJoined = [];
        relevantLineNumbers.map(lineNumberArray => {
          return lineNumberArray.map(lineNumber => {
            relevantLineNumbersJoined.push(lineNumber);
            return lineNumber;
          })
        })

        console.log(relevantLineNumbersJoined)

        this.setState({
          exceptionData: data[0][0].exception,
          log: data[0][0].log,
          sourceCode: data[1],
          lineNumbers: relevantLineNumbersJoined
        });
      }).catch((err) => console.log(err));
  }
  
  render() {

    let callPathElements;
    if (this.state.exceptionData) {
      callPathElements = this.state.exceptionData.map((callPathElement, index) => {
        return (
          <CallPath 
          callPathElement={this.state.exceptionData[index]}/>
        )
      });
    } 
    else {
      callPathElements = null;
    }

    let codelines;
    if (this.state.sourceCode) {
      codelines = this.state.sourceCode.map((codeline, index) => {
        return (
          <CodeLine 
            line={this.state.sourceCode[index].lineNumber}
            code={this.state.sourceCode[index].codeLine} 
            linesToHighlight={this.state.lineNumbers}
          />
        )
      });
    }
    else {
      codelines = null;
    }

    return (
      <div className="app">
        <div className="header">Working title</div>
        <div className="container">
          <div className="fileTree">
          </div>
          <div className="callPath">
            <p className="exception-header">Exception: </p>
            {callPathElements}
            <p className="exception-header">Log: {this.state.log}</p>
          </div>
          <div className="sourceCode"> 
            {codelines}
          </div>
        </div>
      </div>
    );
  }

  fetchData = async () => {
    try {
      const data = await fetch('/hello');
      return data.json();
    } catch(error) {
      console.log('Error in callApi', error);
    }
  };
}

export default App;