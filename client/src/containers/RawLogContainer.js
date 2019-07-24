import React from 'react';
import RawLogLine from '../components/RawLogLine';

const rawLogContainer = props => {
  const { logData } = props;

  const rawLogs = logData.map(log => {
    return log.filter(logLine => {
      return logLine.log;
    });
  });

  console.log('[RawLogContainer.js] rawLogs: ', rawLogs);

  const rawLogMarkup = rawLogs.map(log => {
    return log.map((logLine, i) => {
      return (
          <RawLogLine 
            logLine={logLine.log}
          />
      );
    });
  });

  return <div className="rawLogContainer">{rawLogMarkup}</div>;
};

export default rawLogContainer;
