import React from 'react';
import ReactDOM from 'react-dom';
import CallPath from './CallPath';
import './index.css';


class App extends React.Component {
  state = {
    exceptionData: null,
    log: []
  }

  componentDidMount() {
    this.fetchData()
      .then(data => {
        this.setState({
          exceptionData: data.exception,
          log: data.log
        });
      }).catch((err) => console.log(err));
  }
  
  render() {
    let callPathElements;
    let logs;
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

    
    return (
      <div className="app">
        <div className="header">Working title</div>
        <div className="container">
          <div className="log-report">
            {callPathElements}
          </div>
          <div className="other">
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

ReactDOM.render(<App />, document.getElementById('root'))



