import { action, computed, makeObservable, observable, toJS } from 'mobx';
import _ from 'lodash';
import { v4 } from 'uuid';

// eslint-disable-next-line no-useless-escape
const logPattern = /(\[[A-Za-z0-9]*\])(\[[A-Za-z0-9]*\])(\[[A-Za-z0-9]*\])(\[[A-Za-z0-9]*\])(.*)/;

class Log {
  constructor (filename, logString) {
    this.id = v4();
    this.filename = filename;
    this.parseLog(logString);
  }

  parseLog (logString) {
    let matches = logString.match(logPattern)?.map((match) => {
      return match.slice(1,-1);
    });

    this.appId = matches[1];
    this.timestamp = Number(matches[2]);
    this.process = matches[3];
    this.type = matches[4];
    this.message = matches[5];
  }
}

class LogsStore {
  @observable filesData;
  @observable mergedLogs;
  @observable timestampRange;
  @observable enabledLogType;
  @observable logsFilterText;

  constructor() {
    makeObservable(this);

    this.resetStore();
  }

  @action 
  resetStore () {
    this.filesData = {};
    this.mergedLogs = [];
    this.timestampRange = {
      from: -1,
      to: -1
    };
    this.enabledLogType = {
      info: true,
      error: true,
      warn: true
    };
    this.logsFilterText = '';
  }

  @action
  addFileData(fileMeta, fileData) {
    if (!fileMeta || !fileMeta.name) {
      return;
    }

    this.filesData[fileMeta.name] = { 
      isEnabled: true,
      logs: this.parseFileData(fileMeta.name, fileData) 
    };

    this.mergedLogs = this.getMergedLogs();      
  }

  @action
  updateTimestamp (criteria, timestamp) {
    if (!['from', 'to'].includes(criteria) || !timestamp) {
      return;
    }

    this.timestampRange[criteria] = timestamp;
  }

  @action
  toggleFileEnabled (filename) {
    if (!this.filesData[filename]) {
      return;
    }

    this.filesData[filename].isEnabled = !this.filesData[filename].isEnabled;
  }

  @action
  toggleLogTypeEnabled (type) {
    if (!['error', 'warn', 'info'].includes(type)) {
      return;
    }

    this.enabledLogType[type] = !this.enabledLogType[type];
  }

  @action
  updateLogFilterText (filterText = '') {
    this.logsFilterText = filterText.toLowerCase();
  }

  parseFileData(filename, fileData) {
    if (!fileData) {
      return []
    };

    let logStrings = (fileData && fileData.split('\n')) || [],
      parsedLogs = _.compact(logStrings.map((logString) => {
        if (!logString) {
          // eslint-disable-next-line array-callback-return
          return;
        }

        return new Log(filename, logString);
      }));

    return parsedLogs;
  }

  getMergedLogs () {
    let logsLists = _.compact(Object.values(this.filesData).map((data) => {
        return data.isEnabled && data.logs;
      })),
      mergedLogs = [];

    for(let i = 0; i < logsLists.length; i++) {
      mergedLogs = this.mergeArrays(mergedLogs, toJS(logsLists[i]));
    }

    return mergedLogs;
  }

  @computed
  get filteredLogs () {
    return this.mergedLogs.filter((log) => {
      return this.shouldShowLog(log);
    })
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

  shouldShowLog (log) {
    if (!log) {
      return;
    }

    // File Filter
    let fileFilter = this.filesData[log.filename].isEnabled,

      // Time Filter
      timeFrom = this.timestampRange.from === -1 || this.timestampRange.from < log.timestamp,
      timeTo = this.timestampRange.to === -1 || this.timestampRange.to > log.timestamp,
      timeFilter = timeFrom && timeTo,

      // Log Type filter
      logTypeFilter = this.enabledLogType[log.type],

      // Log Text filter
      LogTextFilter = log.message && log.message.toLowerCase().includes(this.logsFilterText);

    return fileFilter && timeFilter && logTypeFilter && LogTextFilter;
  }
}

export default new LogsStore();