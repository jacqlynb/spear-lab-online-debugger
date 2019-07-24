import React from 'react';
import draw from '../helpers/helpers.js';

import './GraphContainer.css';

class GraphContainer extends React.Component {
  componentDidMount() {
    draw(this.props);
  }
  componentDidUpdate() {
    draw(this.props);
  }
  render() {
    return (
      <div className="graphContainer">
        <svg className="graph"></svg>
      </div>
    );
  }
}

export default GraphContainer;
