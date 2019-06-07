import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {
  state = {
    exceptionData: null,
    log: []
  }

  componentDidMount() {
    this.fetchData()
      .then(data => {
        console.log("first data loggin", data.exception)
        this.setState({
          exceptionData: data.exception,
          log: data.log
        });
        console.log("after setting state: ", this.state.exceptionData[0][1].lineNumber)
        console.log("after setting state", this.state.exceptionData[0][0].lineNumber)
      }).catch((err) => console.log(err));
  }
  
  render() {
    let exceptions;
    console.log(this.state.exceptionData)
    if (this.state.exceptionData) {
      exceptions = 
      <p>{this.state.exceptionData[0][2].lineNumber}</p>
    } 
    else {
      exceptions = null;
    }
    return (
      <div className="app">
        <div className="header">Working title</div>
        <div className="container">
          <div className="log-report">
            {exceptions}
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



