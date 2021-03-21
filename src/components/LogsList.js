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
      Icon = this.getIcon(logItem.type);

    return (
      <div className="logs-list-item"
        style={this.props.style}
        data-index={this.props.index}
      >
        <Icon color='inherit' style={{color: logColor, padding: 4}}/>
        <div className="log-text" style={{color: logColor}}>
          {`${logItem.appId}-${logItem.process}-${logItem.timestamp}-${logItem.message}`}
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
      />
    );
  };

  getItemSize (index) {
    return this.heightSet[index] || MIN_ROW_HEIGHT;
  }

	render () {
    this.logs = LogsStore.mergedLogs.filter((log) => {
      return LogsStore.filesData[log.filename].isEnabled;
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
              overscanCount={20}
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