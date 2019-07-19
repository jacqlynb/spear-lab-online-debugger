import * as d3 from "d3";

const draw = props => { 
  const data = {
    "data": {
      "id": "log"
    },
      "children": [
        {
          "data": {
            "id": "callPath"
          },
          "children": [
            {
              "data": {
                "id": {
                  "lineNumber": 725,
                  "column": 0,
                  "methodName": "copyOutput",
                  "className": "ReduceTask",
                  "content": "/**\n * Copies a a map output from a remote host, via HTTP.\n * @param currentLocation the map output location to be copied\n * @return the path (fully qualified) of the copied file\n * @throws IOException if there is an error copying the file\n * @throws InterruptedException if the copier should give up\n */\nprivate long copyOutput(MapOutputLocation loc) throws IOException, InterruptedException {\n    // check if we still need to copy the output from this location\n    if (!neededOutputs.contains(loc.getMapId()) || obsoleteMapIds.contains(loc.getMapTaskId())) {\n        return CopyResult.OBSOLETE;\n    }\n    String reduceId = reduceTask.getTaskId();\n    LOG.info(reduceId + \" Copying \" + loc.getMapTaskId() + \" output from \" + loc.getHost() + \".\");\n    // a temp filename. If this file gets created in ramfs, we're fine,\n    // else, we will check the localFS to find a suitable final location\n    // for this path\n    Path filename = new Path(\"/\" + reduceId + \"/map_\" + loc.getMapId() + \".out\");\n    // a working filename that will be unique to this attempt\n    Path tmpFilename = new Path(filename + \"-\" + id);\n    // this copies the map output file\n    tmpFilename = loc.getFile(inMemFileSys, localFileSys, shuffleClientMetrics, tmpFilename, lDirAlloc, conf, reduceTask.getPartition(), STALLED_COPY_TIMEOUT, reporter);\n    if (!neededOutputs.contains(loc.getMapId())) {\n        if (tmpFilename != null) {\n            FileSystem fs = tmpFilename.getFileSystem(conf);\n            fs.delete(tmpFilename);\n        }\n        return CopyResult.OBSOLETE;\n    }\n    if (tmpFilename == null)\n        throw new IOException(\"File \" + filename + \"-\" + id + \" not created\");\n    long bytes = -1;\n    // lock the ReduceTask while we do the rename\n    synchronized (ReduceTask.this) {\n        // This file could have been created in the inmemory\n        // fs or the localfs. So need to get the filesystem owning the path.\n        FileSystem fs = tmpFilename.getFileSystem(conf);\n        if (!neededOutputs.contains(loc.getMapId())) {\n            fs.delete(tmpFilename);\n            return CopyResult.OBSOLETE;\n        }\n        bytes = fs.getLength(tmpFilename);\n        // resolve the final filename against the directory where the tmpFile\n        // got created\n        filename = new Path(tmpFilename.getParent(), filename.getName());\n        // will be thrown).\n        if (!fs.rename(tmpFilename, filename)) {\n            fs.delete(tmpFilename);\n            bytes = -1;\n            throw new IOException(\"failure to rename map output \" + tmpFilename);\n        }\n        LOG.info(reduceId + \" done copying \" + loc.getMapTaskId() + \" output from \" + loc.getHost() + \".\");\n        // mergeInProgress\n        if (!mergeInProgress && (inMemFileSys.getPercentUsed() >= MAX_INMEM_FILESYS_USE || (mergeThreshold > 0 && inMemFileSys.getNumFiles(MAP_OUTPUT_FILTER) >= mergeThreshold)) && mergeThrowable == null) {\n            LOG.info(reduceId + \" InMemoryFileSystem \" + inMemFileSys.getUri().toString() + \" is \" + inMemFileSys.getPercentUsed() + \" full. Triggering merge\");\n            InMemFSMergeThread m = new InMemFSMergeThread(inMemFileSys, (LocalFileSystem) localFileSys, sorter);\n            m.setName(\"Thread for merging in memory files\");\n            m.setDaemon(true);\n            mergeInProgress = true;\n            m.start();\n        }\n        neededOutputs.remove(loc.getMapId());\n    }\n    return bytes;\n}"   
                }
              }
            },
            {
              "data": {
                "id": {
                "lineNumber": 733,
                "column": 0,
                "methodName": "getTaskId"
                }
              }
            },
            {
              "data": {
                "id": {
                  "lineNumber": 744,
                  "column": 0,
                  "methodName": "getFile",
                  "className": "InMemoryFileSystem"
                }
              }
            },
            { 
              "data": {
                "id": {
                  "lineNumber": 746,
                  "column": 0,
                  "methodName": "getPartition"
                }
              }
            },
            {
              "data":{
                "id": {
                  "lineNumber": 763,
                  "column": 0,
                  "methodName": "getFileSystem"
                }
              }
            },
            {
              "data":{
                "id": {
                  "lineNumber": 764,
                  "column": 0,
                  "methodName": "contains",
                  "className": "MapOutputLocation"
                }
              }
            },
            {
              "data": { 
                "id": {
                  "lineNumber": 769,
                  "column": 0,
                  "methodName": "getLength",
                  "className": "Path"
                }
              }
            },
            {
              "data": { 
                "id":{
                  "lineNumber": 772,
                  "column": 0,
                  "methodName": "getParent",
                  "className": "Path"
                }
              }
            },
            {
              "data": { 
                "id":{
                  "lineNumber": 772,
                  "column": 0,
                  "methodName": "getName",
                  "className": "Path"
                }
              }
            },
            {
              "data": { 
                "id":{
                  "lineNumber": 775,
                  "column": 0,
                  "methodName": "rename",
                  "className": "Path"
                }
              }
            },
            {
              "data": { 
                "id":{
                  "lineNumber": 776,
                  "column": 0,
                  "methodName": "delete",
                  "className": "Path"
                }
              }
            }
          ]
        }
      ]
    }  
  
  const svg = d3.select("svg");
  const width = 500;
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
        .attr("text-anchor", d => d.children ? "middle" : "start")
        .attr("dy", "0.32em")
        .text(d => d.children ? d.data.data.id : `${d.data.data.id.lineNumber}:${d.data.data.id.methodName}`)
        .attr("font-size", d => d.children ? "1em" : "0.8em")

  console.log("called");
  console.log(svg)
};

export default draw;
