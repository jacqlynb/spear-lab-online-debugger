import React from 'react';
import RawLogLine from '../components/RawLogLine';
import '../components/RawLogLine.css';

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

    return this.state.logItems ? (
      <div className="rawLogContainer">
        <h4>Select two raw log lines to highlight path in between:</h4>
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

//   handleRawLogClicked(logIndex) {
//     console.log('handleRawLogClicked called');
//     const currentCheckBoxesClicked = [...this.state.checkBoxesClicked];

//     if (currentCheckBoxesClicked.includes(logIndex)) {
//       console.log('currentCheckBoxesClicked includes', logIndex);
//       currentCheckBoxesClicked.splice(
//         currentCheckBoxesClicked.indexOf(logIndex),
//         1
//       );
//     } else if (currentCheckBoxesClicked.length >= 2) {
//       currentCheckBoxesClicked.pop();
//       console.log('current checkboxes clicked', currentCheckBoxesClicked);
//       currentCheckBoxesClicked.push(logIndex);
//     } else {
//       currentCheckBoxesClicked.push(logIndex);
//     }
//     if (currentCheckBoxesClicked.length >= 2) {
//       this.setState({
//         checkBoxesFull: true
//       });
//     } else {
//       this.setState({
//         checkBoxesFull: false
//       });
//     }
//     this.setState({
//       checkBoxesClicked: currentCheckBoxesClicked
//     });
//   }

//   componentDidMount() {
//     console.log('[RawLogContainer.js] componentDidMount');
//     this.fetchLogData()
//       .then(data => {
//         this.setState({
//           logData: data.log
//         });
//       })
//       .catch(err => console.log(err));
//   }

//   render() {
//     const { logData } = this.state;

//     const rawLogs = logData.map(log => {
//       return log.filter(logLine => {
//         return logLine.log;
//       });
//     });

//     const rawLogArray = [];
//     rawLogs.map(log => {
//       log.map(line => {
//         rawLogArray.push(line.log);
//       });
//     });

//     const rawLogMarkup = rawLogArray.map((log, i) => {
//       return (
//         <RawLogLine
//           clicked={() => this.handleRawLogClicked(i)}
//           key={i}
//           logLine={log}
//           disabled={!this.state.checkBoxesClicked.includes(i)}
//           checked={this.state.checkBoxesClicked.includes(i)}
//         />
//       );
//     });

//     return (
//       <div className="rawLogContainer">
//         <h4>Select two raw log lines to view path in between:</h4>
//         {rawLogMarkup}
//       </div>
//     );
//   }

//   async fetchLogData() {
//     try {
//       const data = await fetch('/2486');
//       const body = await data.text();
//       return JSON.parse(body);
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

export default RawLogContainer;
