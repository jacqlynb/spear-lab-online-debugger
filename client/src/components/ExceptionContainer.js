import React from 'react';
import Callpath from './Callpath';

class ExceptionContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
      const callPathElements = this.props.exceptionData.map((callPath, index) => {
        let callPathElement;
        if (callPath) {
          callPathElement = callPath;
        } else {
          callPathElement = null;
        }
    
        return (
          <Callpath 
            clicked={this.props.click}
            callPathElement={callPathElement}
            key={index}
            click={this.props.click}
          />
        )
      });
    
    return callPathElements;
  }
}

export default ExceptionContainer;