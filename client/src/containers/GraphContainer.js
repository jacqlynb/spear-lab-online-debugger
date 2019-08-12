import React from 'react';
import ReactDOM from 'react';
import * as d3 from 'd3';
import { renderRawLogNumberIcon } from '../helpers/helpers.js';

import './GraphContainer.css';

class GraphContainer extends React.Component {
  constructor(props) {
    super(props);
  }

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

  render() {
    const { allSelectedFiles, logData, checkBoxItems } = this.props;

    let numCallPaths, startingCallPath;
    let allCallPaths = [];

    if (checkBoxItems.length === 2) {
      let checkBoxItemsSorted = checkBoxItems.sort((a, b) => a - b)
      numCallPaths = parseInt(checkBoxItemsSorted[1]) - parseInt(checkBoxItemsSorted[0]);
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
      .attr('width', "100%")
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

    const root = d3.hierarchy(logData);
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
          if (d.target.data.callPathIDs && d.target.data.callPathIDs.includes(callPath)) {
            stroke = 'blue';
          }
        });
        return stroke;
      })
      .style("stroke-dasharray", d => {
        let dashed = ("4, 4");
        allCallPaths.forEach(callPath => {
          if (d.target.data.callPathIDs && d.target.data.callPathIDs.includes(callPath)) {
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
        if (d.children && d.children.length != 1) {
          return (d.y - d.bb.width / 2) ;
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

// DATA PROTOTYPE
// const data = {
//       id: 'log',
//       children: [
//         {
//           id: 'callpath',
//           children: [
//             {
//               lineNumber: 725,
//               column: 0,
//               methodName: 'copyOutput',
//               className: 'ReduceTask',
//               content:
//                 '/**\n * Copies a a map output from a remote host, via HTTP.\n * @param currentLocation the map output location to be copied\n * @return the path (fully qualified) of the copied file\n * @throws IOException if there is an error copying the file\n * @throws InterruptedException if the copier should give up\n */\nprivate long copyOutput(MapOutputLocation loc) throws IOException, InterruptedException {\n    // check if we still need to copy the output from this location\n    if (!neededOutputs.contains(loc.getMapId()) || obsoleteMapIds.contains(loc.getMapTaskId())) {\n        return CopyResult.OBSOLETE;\n    }\n    String reduceId = reduceTask.getTaskId();\n    LOG.info(reduceId + " Copying " + loc.getMapTaskId() + " output from " + loc.getHost() + ".");\n    // a temp filename. If this file gets created in ramfs, we\'re fine,\n    // else, we will check the localFS to find a suitable final location\n    // for this path\n    Path filename = new Path("/" + reduceId + "/map_" + loc.getMapId() + ".out");\n    // a working filename that will be unique to this attempt\n    Path tmpFilename = new Path(filename + "-" + id);\n    // this copies the map output file\n    tmpFilename = loc.getFile(inMemFileSys, localFileSys, shuffleClientMetrics, tmpFilename, lDirAlloc, conf, reduceTask.getPartition(), STALLED_COPY_TIMEOUT, reporter);\n    if (!neededOutputs.contains(loc.getMapId())) {\n        if (tmpFilename != null) {\n            FileSystem fs = tmpFilename.getFileSystem(conf);\n            fs.delete(tmpFilename);\n        }\n        return CopyResult.OBSOLETE;\n    }\n    if (tmpFilename == null)\n        throw new IOException("File " + filename + "-" + id + " not created");\n    long bytes = -1;\n    // lock the ReduceTask while we do the rename\n    synchronized (ReduceTask.this) {\n        // This file could have been created in the inmemory\n        // fs or the localfs. So need to get the filesystem owning the path.\n        FileSystem fs = tmpFilename.getFileSystem(conf);\n        if (!neededOutputs.contains(loc.getMapId())) {\n            fs.delete(tmpFilename);\n            return CopyResult.OBSOLETE;\n        }\n        bytes = fs.getLength(tmpFilename);\n        // resolve the final filename against the directory where the tmpFile\n        // got created\n        filename = new Path(tmpFilename.getParent(), filename.getName());\n        // will be thrown).\n        if (!fs.rename(tmpFilename, filename)) {\n            fs.delete(tmpFilename);\n            bytes = -1;\n            throw new IOException("failure to rename map output " + tmpFilename);\n        }\n        LOG.info(reduceId + " done copying " + loc.getMapTaskId() + " output from " + loc.getHost() + ".");\n        // mergeInProgress\n        if (!mergeInProgress && (inMemFileSys.getPercentUsed() >= MAX_INMEM_FILESYS_USE || (mergeThreshold > 0 && inMemFileSys.getNumFiles(MAP_OUTPUT_FILTER) >= mergeThreshold)) && mergeThrowable == null) {\n            LOG.info(reduceId + " InMemoryFileSystem " + inMemFileSys.getUri().toString() + " is " + inMemFileSys.getPercentUsed() + " full. Triggering merge");\n            InMemFSMergeThread m = new InMemFSMergeThread(inMemFileSys, (LocalFileSystem) localFileSys, sorter);\n            m.setName("Thread for merging in memory files");\n            m.setDaemon(true);\n            mergeInProgress = true;\n            m.start();\n        }\n        neededOutputs.remove(loc.getMapId());\n    }\n    return bytes;\n}'
//               },
//               {
//                 lineNumber: 733,
//                 column: 0,
//                 methodName: 'getTaskId'
//               },
//               {
//                 lineNumber: 744,
//                 column: 0,
//                 methodName: 'getFile',
//                 className: 'InMemoryFileSystem'
//               },
//               {
//                 lineNumber: 746,
//                 column: 0,
//                 methodName: 'getPartition'
//               },
//               {
//                 lineNumber: 763,
//                 column: 0,
//                 methodName: 'getFileSystem'
//               },
//               {
//                 lineNumber: 764,
//                 column: 0,
//                 methodName: 'contains',
//                 className: 'MapOutputLocation'
//               },
//               {
//                 lineNumber: 769,
//                 column: 0,
//                 methodName: 'getLength',
//                 className: 'Path'
//               },
//               {
//                 lineNumber: 772,
//                 column: 0,
//                 methodName: 'getParent',
//                 className: 'Path'
//               },
//               {
//                 lineNumber: 772,
//                 column: 0,
//                 methodName: 'getName',
//                 className: 'Path'
//               },
//               {
//                 lineNumber: 775,
//                 column: 0,
//                 methodName: 'rename',
//                 className: 'Path'
//               },
//               {
//                 lineNumber: 776,
//                 column: 0,
//                 methodName: 'delete',
//                 className: 'Path'
//               }
//             ]
//           },
//           {
//             id: 'callpath',
//             children: [
//               {
//                 lineNumber: 744,
//                 column: 0,
//                 methodName: 'getFile',
//                 className: 'InMemoryFileSystem'
//               },
//               {
//                 lineNumber: 746,
//                 column: 0,
//                 methodName: 'getPartition'
//               },
//               {
//                 lineNumber: 763,
//                 column: 0,
//                 methodName: 'getFileSystem'
//               },
//               {
//                 lineNumber: 764,
//                 column: 0,
//                 methodName: 'contains',
//                 className: 'MapOutputLocation'
//               },
//               {
//                 lineNumber: 769,
//                 column: 0,
//                 methodName: 'getLength',
//                 className: 'Path'
//               },
//               {
//                 lineNumber: 772,
//                 column: 0,
//                 methodName: 'getParent',
//                 className: 'Path'
//               },
//               {
//                 lineNumber: 772,
//                 column: 0,
//                 methodName: 'getName',
//                 className: 'Path'
//               },
//               {
//                 lineNumber: 775,
//                 column: 0,
//                 methodName: 'rename',
//                 className: 'Path'
//               },
//               {
//                 lineNumber: 776,
//                 column: 0,
//                 methodName: 'delete',
//                 className: 'Path'
//               }
//             ]
//           }
//         ]
//       }; 