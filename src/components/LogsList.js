import React from 'react';
import { observer } from 'mobx-react';

import { VariableSizeList as VirtualizedList } from 'react-window';
import { AutoSizer } from 'react-virtualized';
import LogsStore from '../stores/LogsStore';
import { findDOMNode } from 'react-dom';
import { withTheme } from '@material-ui/core/styles';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import Chip from '@material-ui/core/Chip';
import HighlightedText from './utils/HighlightedText';

const  MIN_ROW_HEIGHT = 42;
class LogsListItem extends React.Component {
  componentDidMount () {
    this.selfNode = findDOMNode(this);

    // Starts observing element
    this.props.observeSizeChange && this.props.observeSizeChange(this.selfNode);
  }

  componentWillUnmount () {
    this.props.unobserveSizeChange && this.props.unobserveSizeChange(this.selfNode);
  }

  getLogColor (type) {
    let palette = this.props.theme.palette, 
      fontColor;

    switch(type) {
      case 'error': 
        fontColor = palette.error.light;
        break;
      case 'warn':
        fontColor = palette.warning.light;
        break;
      default:
        fontColor = palette.text.primary;
    }

    return fontColor
  }

  getIcon (type) {
    switch(type) {
      case 'error': 
        return ErrorIcon;
      case 'warn':
        return WarningIcon;
      default:
        return InfoIcon;
    }
  }

  render () {
    let logItem = this.props.logItem;

    if (!logItem) {
      return null;
    }

    let logColor = this.getLogColor(logItem.type),
      Icon = this.getIcon(logItem.type),

      dateObj = new Date(logItem.timestamp),
      dateTime = dateObj.toString().split(' GMT')[0],
      timeWithMilliseconds = `${dateTime}.${dateObj.getMilliseconds().toString().padStart(3, '0')}`;

    return (
      <div className="logs-list-item"
        style={this.props.style}
        data-index={this.props.index}
      >
        <div className="log-list-item-section" style={{width: 60}}>
          {logItem.appId}
        </div>
        <div className="log-list-item-section">
          <Chip label={logItem.process} variant='outlined' size='small' style={{ fontSize: 12, width: 84 }}/>
        </div>
        <div className="log-list-item-section">
          <Icon style={{color: logColor }}/>
        </div>
        <div className="log-list-item-section" style={{color: logColor}}>
          {timeWithMilliseconds}
        </div>
        <div className="log-list-item-section" style={{color: logColor, 'flexShrink': 1 }}>
          <HighlightedText 
            text={logItem.message}
            searchTerm={LogsStore.logsFilterText}
          />
        </div>
      </div>
    )
  }
}

LogsListItem = withTheme(LogsListItem);

@observer
class LogsList extends React.Component {
  constructor () {
    super();

    // Height for list items currently mounted
    this.heightSet = {};

    this.resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (!(entry && entry.target && entry.target.dataset)) {
          return;
        }

        let index = entry.target.dataset.index;

        this.heightSet[index] = entry.target.scrollHeight;

        this.listRef.resetAfterIndex(index);
      }
    });

    this.observeSizeChange = this.observeSizeChange.bind(this);
    this.unobserveSizeChange = this.unobserveSizeChange.bind(this);
  }

  observeSizeChange (node) {
    this.resizeObserver && this.resizeObserver.observe(node);
  }

  unobserveSizeChange (node) {
    this.resizeObserver && this.resizeObserver.unobserve(node);
  }

  getListItem (data) {
    let currentItem = this.logs[data.index];

    return (
      <LogsListItem 
        index={data.index}
        key={currentItem.id}
        style={data.style}
        logItem={currentItem}
        observeSizeChange={this.observeSizeChange}
        unobserveSizeChange={this.unobserveSizeChange}
      />);
  };

  getItemSize (index) {
    return this.heightSet[index] || MIN_ROW_HEIGHT;
  }

  shouldShowLog (log) {
    if (!log) {
      return;
    }

    // File Filter
    let fileFilter = LogsStore.filesData[log.filename].isEnabled,

      // Time Filter
      timeFrom = LogsStore.timestampRange.from === -1 || LogsStore.timestampRange.from < log.timestamp,
      timeTo = LogsStore.timestampRange.to === -1 || LogsStore.timestampRange.to > log.timestamp,
      timeFilter = timeFrom && timeTo,

      // Log Type filter
      logTypeFilter = LogsStore.enabledLogType[log.type],

      // Log Text filter
      LogTextFilter = log.message.includes(LogsStore.logsFilterText);

    return fileFilter && timeFilter && logTypeFilter && LogTextFilter;
  }

	render () {
    this.logs = LogsStore.mergedLogs.filter((log) => {
      return this.shouldShowLog(log);
    });

    return (
      <div className='logs-list'>
        <AutoSizer
          defaultHeight={720}
          defaultWidth={100}
        >
          {({ height, width }) => {
            return (
            <VirtualizedList
              height={height}
              width={width}
              itemCount={this.logs.length}
              itemSize={this.getItemSize.bind(this)}
              ref={(ref) => { this.listRef = ref}}
              overscanCount={10}
            >
              {this.getListItem.bind(this)}
            </VirtualizedList>
            );
         }}
        </AutoSizer>
      </div>
    );
  }
}

export default LogsList;