import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import CodeLine from './CodeLine'
import './SourceCodeContainer.css'

const sourceCodeContainer = (props) => {
  const { sourceCode, linesToHighlight, file, codeLine } = props;
  const codes = sourceCode.map((codeElement, index) => {
      if (codeElement.fileName === file) {
        console.log('sourcecodecontainer file: ', file);
        console.log('sourcecodecontainer call path filename', codeElement.fileName);
        return (
          <div className='sourceCodeBody'>
          <Tabs>
            <TabList>
              <Tab>{codeElement.fileName}</Tab>
            </TabList>
          </Tabs>
          <div className='sourceCodeBody'>
            <CodeLine
              code={codeElement.codeLines}
              linesToHighlight={linesToHighlight}
              fileName={file}
              targetLineNumber={codeLine}
              key={index}
            />
          </div> 
          </div>
        )
      }
      else {
        console.log("SourceCodeContainer.js file: ", file);
        return null;
      }
    });
  return codes;
}

export default sourceCodeContainer;