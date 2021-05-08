import React from 'react';
import { observer } from 'mobx-react';
import { transaction, action } from 'mobx';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import LogsStore from '../../stores/LogsStore';
import { Checkbox } from '@material-ui/core';

@observer
class LogTypeFilter extends React.Component {
  constructor () {
    super();

    this.state = {
      open: false
    }
  }

  handleListItemToggle(value) {
    if (!value) {
      return;
    }

    LogsStore.toggleLogTypeEnabled(value);
  }

  render () {
    let enabledLogType = LogsStore.enabledLogType;

    return (
      <List component="div">
        <ListItem key='info' dense button onClick={this.handleListItemToggle.bind(this, 'info')}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={enabledLogType.info}
              tabIndex={-1}
              disableRipple
              color='default'
              size='small'
            />
          </ListItemIcon>
          <ListItemText primary='Info' />
        </ListItem>
        <ListItem key='warn' dense button onClick={this.handleListItemToggle.bind(this, 'warn')}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={enabledLogType.warn}
              tabIndex={-1}
              disableRipple
              color='default'
              size='small'
            />
          </ListItemIcon>
          <ListItemText primary='Warn' />
        </ListItem>
        <ListItem key='error' dense button onClick={this.handleListItemToggle.bind(this, 'error')}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={enabledLogType.error}
              tabIndex={-1}
              disableRipple
              color='default'
              size='small'
            />
          </ListItemIcon>
          <ListItemText primary='Error' />
        </ListItem>
      </List>
    );
  }
}

function resetLogTypeFilter () {
  transaction(action(() => {
    for (let logType in LogsStore.enabledLogType) {
      LogsStore.enabledLogType[logType] = true;
    };
  }))
}

const componentDetails = {
  label: 'Log Type',
  content: LogTypeFilter,
  resetFunction: resetLogTypeFilter
};

export default componentDetails;