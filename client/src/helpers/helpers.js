import * as d3 from "d3";

async function fetchLogData() {
  try {
    const data = await fetch("/2486-with-levels");
    const body = await data.text()
    return JSON.parse(body);
    //return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
}

async function draw(props) { 
  const data = await fetchLogData()
      const svg = d3.select(".graph");
      const width = 700;
      const height = 200;
      const margin = { top: 0, bottom: 0, right: 100, left: 10};
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const treeLayout = d3.tree().size([innerHeight, innerWidth]);

      const zoomG = svg
          .attr("width", width)
          .attr("height", height)
        .append("g")

      const g = zoomG.append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`)

      svg.call(d3.zoom().on("zoom", () => {
        zoomG.attr("transform", d3.event.transform);
      }));

      const root = d3.hierarchy(data);
      const links = treeLayout(root).links(); 
      const linkPathGenerator = d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x)
      
        g.selectAll("path")
        .data(links)
        .enter()
        .append("path")
        .attr("d", linkPathGenerator);
      
      g.selectAll("text")
          .data(root.descendants())
          .enter()
        .append("text")
          .attr("x", d => d.y)
          .attr("y", d => d.x)
          .attr("text-anchor", d => (d.children && d.children.length !== 1) ? "middle" : "start")
          .attr("dy", "0.32em")
          .text(d => {
            if (d.data.data.lineNumber && d.data.data.methodName) {
              return (d.data.data.lineNumber + ":" + d.data.data.methodName)
            } else {
              return d.data.data.id
            }
          })
          //.text(d => d.children ? d.data.data.id : `${d.data.data.id.lineNumber}:${d.data.data.id.methodName}`)
          .attr("font-size", "0.8em")
        
      
  

    // const svg1 = d3.select("svg");
    // const treeLayout1 = d3.tree().size([innerHeight, innerWidth]);

    // const zoomG1 = svg1
    //   .attr("width", width)
    //   .attr("height", height)
    // .append("g")

    // const g1 = zoomG1.append("g")
    //   .attr("transform", `translate(${margin.left}, ${margin.top})`)

    //   svg1.call(d3.zoom().on("zoom", () => {
    //     zoomG1.attr("transform", d3.event.transform);
    //   }));

    // const root1 = d3.hierarchy(data);
    // const links1 = treeLayout1(root1).links(); 
    // const linkPathGenerator1 = d3.linkHorizontal()
    //   .x(d => d.y)
    //   .y(d => d.x + 500)
  
    // g1.selectAll("path")
    //   .data(links1)
    //   .enter()
    //   .append("path")
    //   .attr("d", linkPathGenerator1);

    // g1.selectAll("text")
    //   .data(root1.descendants())
    //   .enter()
    // .append("text")
    //   .attr("x", d => d.y)
    //   .attr("y", d => d.x + 500)
    //   .attr("text-anchor", d => d.children ? "middle" : "start")
    //   .attr("dy", "0.32em")
    //   .text(d => d.children ? d.data.data.id : `${d.data.data.id.lineNumber}:${d.data.data.id.methodName}`)
    //   .attr("font-size", d => d.children ? "1em" : "0.8em")
};

export default draw;
