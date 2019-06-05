**Sample data set**

---
[HADOOP-984](https://issues.apache.org/jira/browse/HADOOP-984)

Execution paths: HADOOP-984.json

Commit: e0c9ec8e2c17c179883978fa003cd251d4f0498f

---

Note:

Some outer class are not resolved properly by `javaparser` (it was not needed for the project back then, so I didn't bother fixing it). I manually went through some of it, here is a list of the classe names. For now you can play with `FSDataInputStream.java` & `FSInputStream.java` and highlight the execution path in HADOOP-984.json

- Checker = FSDataInputStream.Checker
- PositionCache = FSDataInputStream.PositionCache
- Buffer = FSDataInputStream.Buffer

---

*todo*

- find a way to automatically collect the source code file from `classname` attribute in Execution paths
	- @AnRan maybe I will add a `path` attribute in execution_path .json, I will discuss this with Peter
- link to RESTFUL services (after visualization