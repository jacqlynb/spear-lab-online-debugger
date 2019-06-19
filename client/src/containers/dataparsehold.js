.then(data => {
        let issues = [];
        let exceptionData = [];
        let logs = [];
        let sourceCode = [];

        data.map(issue => {
          issues.push(issue.title);
          exceptionData.push(issue.exception);
          logs.push(issue.log);

          let sourceCodeChunk = []
          sourceCode.map(line => {
            sourceCodeChunk.push(line.lineNumber + ' ' + line.codeLine);
          });

          sourceCode.push(sourceCodeChunk);
        });

        let relevantLineNumbers = data[0][0].exception.map(exceptionElements => {
          return exceptionElements.map(callPath => {
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
          exceptionData,
          log: data[0][0].log,
          sourceCode: data[1],
          lineNumbers: relevantLineNumbersJoined,
          issues
        });

      }).catch(err => console.log(err));
  }