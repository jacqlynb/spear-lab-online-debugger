import React from "react";
import draw from "../helpers/helpers.js";


// import ReactDOM from "react-dom";
// import dagreD3 from "dagre-d3";
// import * as d3 from "d3";
import "./GraphContainer.css";

class GraphContainer extends React.Component {
  componentDidMount() {
    draw(this.props);
  }
  componentDidUpdate() {
    draw(this.props);
  }
  render() {
    return (
      <svg width={500} height={500}></svg>
    );
  }
}

export default GraphContainer;

// class GraphContainer extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   componentDidMount() {
//     const logData = [...this.props.logData];
//     const lineNumbers = logData.map(log => {
//       return log.filter(logItem => {
//         return logItem.lineNumber;
//       });
//     });

//     let g = new dagreD3.graphlib.Graph()
//       .setGraph({})
//       .setDefaultEdgeLabel(function() {
//         return {};
//       });

//     let nodeCount = 0;

//     for (let i = 0; i < lineNumbers[0].length; i++) {
//       if (lineNumbers[0][i].lineNumber && lineNumbers[0][i].methodName) {
//         g.setNode(nodeCount, {
//           label:
//             lineNumbers[0][i].lineNumber.toString() +
//             " " +
//             lineNumbers[0][i].methodName,
//           class: "type-NP"
//         });
//       }

//       if (nodeCount > 0) {
//         g.setEdge(nodeCount - 1, nodeCount);
//       }
//       nodeCount++;
//     }

//     let render = new dagreD3.render();

//     let svg = d3.select(ReactDOM.findDOMNode(this.refs.nodeTree));
//     let svgGroup = d3.select(ReactDOM.findDOMNode(this.refs.nodeTreeGroup));
//     render(d3.select(ReactDOM.findDOMNode(this.refs.nodeTreeGroup)), g);

//     svgGroup.attr("transform", "translate(100, 20)");
//     svg.attr("height", g.graph().height + 40);
//   }

//   render() {
//     const { logData } = this.props;
//     console.log("LOG DATA: ", logData);

//     const logsArray = logData.map(log => log);

//     const lineNumbers = logsArray.map(log => {
//       return log.filter(logItem => {
//         return logItem.lineNumber;
//       });
//     });

//     const allLineNumbers = [];
//     lineNumbers.forEach(log => {
//       log.forEach(line => {
//         allLineNumbers.push(line.lineNumber);
//       });
//     });

//     const allLineNumbersSorted = allLineNumbers.sort();

//     const lineNumbersRepeated = allLineNumbersSorted.filter((line, index) => {
//       return allLineNumbersSorted[index + 1] === line;
//     });

//     // refactor
//     const logMarkup = logData
//       ? logData.map(log => {
//           return log.map(line => {
//             console.log("line.log? ", line.log);
//             if (line.log) {
//               return (
//                 <div className="logLine">
//                   <p>{line.log}</p>
//                 </div>
//               );
//             } else {
//               return null;
//             }
//           });
//         })
//       : null;

//     console.log("logmarkup: ", logMarkup);

//     return (
//       <div className="graphContainer">
//         <div className="rawLog">{logMarkup}</div>
//         <svg
//           className="graph"
//           id="nodeTree"
//           ref="nodeTree"
//           width="960"
//           height="600"
//         >
//           something
//           <g ref="nodeTreeGroup" />
//         </svg>
//       </div>
//     );
//   }
// }

// export default GraphContainer;
