import { action, makeObservable, observable, toJS } from 'mobx';
import _ from 'lodash';
import { v4 } from 'uuid';

// eslint-disable-next-line no-useless-escape
const logPattern = /\[[^\[^\]]*\]/g;

class Log {
  constructor (props) {
    this.id = v4();
    this.parseLog(props);
  }

  parseLog (logString) {
    let matches = logString.match(logPattern)?.map((match) => {
      return match.slice(1,-1);
    });

    this.appId = matches[0];
    this.timestamp = Number(matches[1]);
    this.process = matches[2];
    this.type = matches[3];
    this.message = matches[4];
  }
}

class LogsStore {
  @observable filesData = {};
  @observable mergedLogs = [];

  constructor() {
    makeObservable(this);
  }

  @action
  addFileData(fileMeta, fileData) {
    if (!fileMeta || !fileMeta.name) {
      return;
    }

    this.filesData[fileMeta.name] = this.parseFileData(fileData)
    this.mergedLogs = this.getMergedLogs();      
  }

  parseFileData(fileData) {
    if (!fileData) {
      return []
    };

    let logStrings = (fileData && fileData.split('\n')) || [],
      parsedLogs = _.compact(logStrings.map((logString) => {
        if (!logString) {
          // eslint-disable-next-line array-callback-return
          return;
        }

        return new Log(logString);
      }));

    return parsedLogs;
  }

  getMergedLogs () {
    let logsLists = Object.values(this.filesData),
      mergedLogs = [];

    for(let i = 0; i < logsLists.length; i++) {
      mergedLogs = this.mergeArrays(mergedLogs, toJS(logsLists[i]));
    }

    return mergedLogs;
  }

  mergeArrays (arr1, arr2) {
    if (!arr1) {
      return arr2;
    }
    else if (!arr2) {
      return arr1;
    };
    
    let output = [],
      i = 0,
      j = 0;

    for (;i < arr1.length || j < arr2.length;) {
      if (j >= arr2.length || (i < arr1.length && arr1[i].timestamp < arr2[j].timestamp)) {
        output.push(arr1[i]);
        i = i+1;
      }

      else if (i >= arr1.length || j < arr2.length) {
        output.push(arr2[j]);
        j = j+1;
      }
    }

    return output;
  }
}

export default new LogsStore();