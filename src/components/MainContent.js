import React from 'react';
import { observer } from 'mobx-react';
import LogsList from './LogsList';
import LogsStore from '../stores/LogsStore';
import EmptyState from './EmptyState';

@observer
class MainContent extends React.Component {
  render () {
    let logs = LogsStore.mergedLogs;

    if (logs.length === 0) {
      return <EmptyState />
    }
    
    return (
      <div className="main-content">
        <LogsList/>
      </div>
    );
  }
}

export default MainContent;