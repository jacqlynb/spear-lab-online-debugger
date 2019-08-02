import * as d3 from 'd3';

async function fetchLogData() {
  try {
    const data = await fetch('/2486-with-levels');
    const body = await data.text();
    return JSON.parse(body);
    //return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
}

async function draw(props) {
  const { allSelectedFiles } = props;
  const data = await fetchLogData();
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
    //.text(d => d.children ? d.data.data.id : `${d.data.data.id.lineNumber}:${d.data.data.id.methodName}`)
    .attr('font-size', '0.8em');

  g.selectAll('text').each(function(d, i) {
    treeData[i].bb = this.getBBox();
  });

  rects
    .attr('x', d => {
      if (d.children && d.children.length != 1) {
        return d.y - d.bb.width / 2;
      } else {
        return d.y;
      }
    })
    .attr('y', d => d.x - 7)
    .attr('width', d => (d.bb.width + 2))
    .attr('height', d => (d.bb.height + 2))
    .attr('fill', d => {
      let fill = 'none';
      allSelectedFiles.forEach(file => {
        if (file.lineNumber === d.data.data.lineNumber && file.methodName === d.data.data.methodName) {
          fill = 'yellow';
        } 
      });
      return fill;
    });
}

async function renderRawLogNumberIcon(props) {
  const { rawLogNumber } = props;
  console.log('.rawLogNumber' + rawLogNumber)
  const svg = d3.select('.rawLogNumber' + rawLogNumber)
    .attr('width', 25)
    .attr('height', 25);

  svg.append('circle')
  .attr("r", 10)
  .attr("cx", 12.5)
  .attr("cy", 12.5)
  .attr("fill", "white")
  .attr("stroke", "black")
  .attr("stroke-width", 2)

  svg.append('text')
    .text(rawLogNumber)
    .attr('x', 12.5)
    .attr('y', 18)
    .attr('text-anchor', 'middle')
    .attr('font-size', '0.9em')
    .attr('font-weight', 'bold');
}

export {
  draw,
  renderRawLogNumberIcon
};
