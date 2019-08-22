import React from 'react';
import * as d3 from 'd3';
import './GraphContainer.css';

class GraphContainer extends React.Component {
  state = {
    logPointA: null,
    logPointB: null,
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

  toggleDuplicatePaths() {
    const duplicatePaths = !this.state.duplicatePaths;
    this.setState({ duplicatePaths });
  }

  render() {
    const {
      allSelectedFiles,
      logData,
      checkBoxItems
    } = this.props;

    let numCallPaths, startingCallPath;
    let allCallPaths = [];

    if (checkBoxItems.length === 2) {
      let checkBoxItemsSorted = checkBoxItems.sort((a, b) => a - b);
      numCallPaths =
        parseInt(checkBoxItemsSorted[1]) - parseInt(checkBoxItemsSorted[0]);
      startingCallPath = checkBoxItemsSorted[0];
      for (let i = startingCallPath; i < startingCallPath + numCallPaths; i++) {
        allCallPaths.push(i);
      }
    }

    // target svg element
    const svg = d3.select('.graph');

    // remove svg elements for component re-render
    svg.selectAll('*').remove();

    const width = 700;
    const height = 500;
    const margin = { top: 0, bottom: 0, right: 100, left: 10 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const treeLayout = d3.tree().size([innerHeight, innerWidth]);

    const zoomG = svg
      .attr('width', '100%')
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

    const data = logData;
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
      .attr('d', linkPathGenerator)
      .style('stroke', d => {
        let stroke = 'rgb(175, 174, 174)';
        allCallPaths.forEach(callPath => {
          if (
            d.target.data.callPathIDs &&
            d.target.data.callPathIDs.includes(callPath)
          ) {
            stroke = '#13cefd';
          }
        });
        return stroke;
      })
      .style('stroke-dasharray', d => {
        if (allCallPaths.length === 0) {
          return null;
        }
        let dashed = '4, 4';
        allCallPaths.forEach(callPath => {
          if (
            d.target.data.callPathIDs &&
            d.target.data.callPathIDs.includes(callPath)
          ) {
            dashed = 'null';
          }
        });
        return dashed;
      });

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
      .attr('font-weight', d => {
        if (d.data.id === 1 || d.data.id === 2) {
          return 'bold';
        }
      })
      .text(d => {
        if (d.data.lineNumber && d.data.methodName) {
          return d.data.lineNumber + ':' + d.data.methodName;
        } else if (d.data.id) {
          return d.data.id;
        } else {
          return;
        }
      })
      .attr('font-size', '0.8em');

    g.selectAll('text').each(function(d, i) {
      treeData[i].bb = this.getBBox();
    });

    const div = d3.select('.toolTip');

    rects
      .attr('x', d => {
        if (d.children && d.children.length !== 1) {
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
            file.lineNumber === d.data.lineNumber &&
            file.methodName === d.data.methodName
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
          .html('filename: ' + d.data.fileName)
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
