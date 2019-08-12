import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import '../containers/GraphContainer.css';

async function fetchLogData() {
  try {
    const data = await fetch('/2486-with-levels');
    const body = await data.text();
    return JSON.parse(body);
  } catch (error) {
    console.log(error);
  }
}

// refactor
function constructLogHierarchy(data) {

  const callPathElements = [];

  data.forEach((callPath, i) => {
    callPath.forEach(element => {
      let currentElement;
      let duplicateItem = false;

      // search for element already in callPathElements array
      callPathElements.forEach(item => {
        // if the item is a duplicate, callPathIDs array is already created, so just push element index
        if (item.lineNumber === element.lineNumber && item.methodName === element.methodName) {
          currentElement = callPathElements[callPathElements.indexOf(item)];
          currentElement.callPathIDs.push(i);
          duplicateItem = true;
        } 
      });

      // if the item was not a duplicate, create callPathIDs attribute (array) and push element index
      if (!duplicateItem) {
        callPathElements.push(element);
        currentElement = callPathElements[callPathElements.indexOf(element)];
        currentElement.callPathIDs = [];
        currentElement.callPathIDs.push(i);
      }
    });
  });

  console.log('[helpers.js] allCallPathElements', callPathElements);

  // contruct log hierarchy
  let log = {};
  log.id = 'log';
  log.children = [];
  console.log('log', log);
  callPathElements.map((element, i) => {
    log.children.push(element)
  });
  console.log('log', log);

  return log;
}

async function renderRawLogNumberIcon(num) {
  const svg = d3
    .select('.rawLogNumber' + num)
    .attr('width', 25)
    .attr('height', 25);

  svg
    .append('circle')
    .attr('r', 10)
    .attr('cx', 12.5)
    .attr('cy', 12.5)
    .attr('fill', 'white')
    .attr('stroke', 'black')
    .attr('stroke-width', 2);

  svg
    .append('text')
    .text(num)
    .attr('x', 12.5)
    .attr('y', 18)
    .attr('text-anchor', 'middle')
    .attr('font-size', '0.9em')
    .attr('font-weight', 'bold');
}

export { constructLogHierarchy, renderRawLogNumberIcon };
