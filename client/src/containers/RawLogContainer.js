import React from 'react';
import RawLogLine from '../components/RawLogLine';
import ReactTooltip from 'react-tooltip';
import './RawLogContainer.css';
import '../components/RawLogLine.css';

const graphIcon = require('../images/graph-icon.svg');

class RawLogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.fetchLogData = this.fetchLogData.bind(this);

    this.state = {
      logData: [],
      checkBoxesFull: false,
      logItems: []
    };
  }

  componentDidMount() {
    this.fetchLogData()
      .then(data => {
        const logData = data.log;
        const rawLogs = logData.map(log => {
          return log.filter(logLine => {
            return logLine.log;
          });
        });

        const rawLogArray = [];
        rawLogs.forEach(log => {
          log.forEach(line => {
            rawLogArray.push(line.log);
          });
        });

        const logItems = rawLogArray.map((log, i) => {
          return {
            name: log,
            key: i,
            label: i
          };
        });

        this.setState({
          logItems
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { checkBoxItems } = this.props;
    console.log('[RawLogContainer] checkBoxItems', checkBoxItems);

    const rawLogMarkup = this.state.logItems.map((logItem, i) => {
      return (
        <RawLogLine
          key={logItem.key}
          name={logItem.name}
          checked={checkBoxItems.includes(i)}
          changed={() => this.props.change(i)}
          rawLogNumber={i + 1}
        />
      );
    });

    const graphViewIconMarkup = (
      <div>
        <img
          data-tip="View rog log data and callgraph"
          className="graphIcon--static"
          src={graphIcon}
          alt="View raw log data and callgraph"
        />
        <ReactTooltip />
      </div>
    );

    return this.state.logItems ? (
      <div className="rawLogContainer">
        <div className="rawLogHeader">
          <h4>Select two raw log lines to highlight path in between:</h4>
          {graphViewIconMarkup}
        </div>
        {rawLogMarkup}
      </div>
    ) : null;
  }

  async fetchLogData() {
    try {
      const data = await fetch('/2486');
      const body = await data.text();
      return JSON.parse(body);
    } catch (error) {
      console.log(error);
    }
  }
}

export default RawLogContainer;
