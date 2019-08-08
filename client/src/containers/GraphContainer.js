import React from 'react';
import ReactDOM from 'react';
import * as d3 from 'd3';
import { draw } from '../helpers/helpers.js';

import './GraphContainer.css';

class GraphContainer extends React.Component {
  constructor(props) {
    super(props);
    this.graphRef = React.createRef();
  }

  state = {
    logData: [],
    toolTipX: null,
    toolTipY: null
  };

  componentDidMount() {
    this.fetchLogData()
      .then(data => {
        this.setState({ logData: data });
      })
      .catch(e => console.log(e));
  }

  async fetchLogData() {
    try {
      const data = await fetch('/2486-with-levels');
      const body = await data.text();
      return JSON.parse(body);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { allSelectedFiles } = this.props;
    const data = this.state.logData;
    const svg = d3.select('.graph');
    const width = 700;
    const height = 200;
    const margin = { top: 0, bottom: 0, right: 100, left: 10 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const treeLayout = d3.tree().size([innerHeight, innerWidth]);

    const zoomG = svg
      .attr('width', width)
      .attr('height', height)
      .append('g');

    const g = zoomG
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    svg.call(
      d3.zoom().on('zoom', () => {
        zoomG.attr('transform', d3.event.transform);
      })
    );

    const root = d3.hierarchy(data);
    const links = treeLayout(root).links();
    const linkPathGenerator = d3
      .linkHorizontal()
      .x(d => d.y)
      .y(d => d.x);
    const treeData = root.descendants();

    g.selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('d', linkPathGenerator);

    const rects = g
      .selectAll('rect')
      .data(treeData)
      .enter()
      .append('rect');

    g.selectAll('text')
      .data(treeData)
      .enter()
      .append('text')
      .attr('x', d => d.y)
      .attr('y', d => d.x)
      .attr('text-anchor', d =>
        d.children && d.children.length !== 1 ? 'middle' : 'start'
      )
      .attr('dy', '0.32em')
      .text(d => {
        if (d.data.data.lineNumber && d.data.data.methodName) {
          return d.data.data.lineNumber + ':' + d.data.data.methodName;
        } else {
          return d.data.data.id;
        }
      })
      .attr('font-size', '0.8em');

    g.selectAll('text').each(function(d, i) {
      treeData[i].bb = this.getBBox();
    });

    // const div = d3
    //   .select(this.graphRef.current)
    //   .attr('class', 'toolTip')
    // .style('opacity', 0);

    const div = d3.select('.toolTip');

    rects
      .attr('x', d => {
        if (d.children && d.children.length != 1) {
          return d.y - d.bb.width / 2;
        } else {
          return d.y;
        }
      })
      .attr('y', d => d.x - 7)
      .attr('width', d => d.bb.width + 2)
      .attr('height', d => d.bb.height + 2)
      .attr('fill', d => {
        let fill = 'white';
        allSelectedFiles.forEach(file => {
          if (
            file.lineNumber === d.data.data.lineNumber &&
            file.methodName === d.data.data.methodName
          ) {
            fill = 'yellow';
          }
        });
        return fill;
      })
      .on('mouseover', d => {
        div
          .transition()
          .duration(200)
          .style('opacity', 0.9);
        div
          .html(d.data.data.methodName)
          .style('left', d3.event.pageX - 15 + 'px')
          .style('top', d3.event.pageY - 28 + 'px');
      })
      .on('mouseout', function(d) {
        div
          .transition()
          .duration(500)
          .style('opacity', 0);
      });

    return (
      <div className="graphContainer">
        <svg className="graph" />
        <div className="toolTip" />
      </div>
    );
  }
}

export default GraphContainer;
