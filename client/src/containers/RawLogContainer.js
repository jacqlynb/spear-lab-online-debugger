import React from 'react';
import RawLogLine from '../components/RawLogLine';

class RawLogContainer extends React.Component {
  constructor(props) {
    super(props)
    this.fetchLogData = this.fetchLogData.bind(this);
  }
  state = {
    logData: []
  }

  componentDidMount() {
    this.fetchLogData()
      .then(data => {
        this.setState({
          logData: data.log
        })
      }).catch(err => console.log(err))
  }

  render() {
    const { logData } = this.state;

    const rawLogs = logData.map(log => {
      return log.filter(logLine => {
        return logLine.log;
      });
    });

    const rawLogMarkup = rawLogs.map(log => {
      return log.map((logLine, i) => {
        return <RawLogLine key={i} logLine={logLine.log} />;
      });
    });

    return <div className="rawLogContainer">{rawLogMarkup}</div>;
  }

  async fetchLogData() {
    try {
      const data = await fetch("/2486");
      const body = await data.text()
      return JSON.parse(body);
    } catch (error) {
      console.log(error);
    }
  }
  
}

export default RawLogContainer;
