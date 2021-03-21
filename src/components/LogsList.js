import React from 'react';
import { observer } from 'mobx-react';
import { VariableSizeList as VirtualizedList } from 'react-window';
import { AutoSizer } from 'react-virtualized';
import LogsStore from '../stores/LogsStore';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';

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
  
  render () {
    let logItem = this.props.logItem;

    return (
      <div className="logs-list-item"
        style={this.props.style}
        data-index={this.props.index}
      >
        {`${logItem.appId}-${logItem.process}-${logItem.timestamp}-${logItem.message}`}
      </div>
    )
  }
}

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
    this.logs = LogsStore.mergedLogs;

    return (
      <div className='logs-list'>
        {/* <AutoSizer>
          {({ height, width }) => { */}
            <VirtualizedList
              height={720}
              width={1000}
              itemCount={this.logs.length}
              itemSize={this.getItemSize.bind(this)}
              ref={(ref) => { this.listRef = ref}}
              overscanCount={20}
            >
              {this.getListItem.bind(this)}
            </VirtualizedList>
         {/* }} */}
        {/* </AutoSizer> */}
      </div>
    );
  }
}

export default LogsList;