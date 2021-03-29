import React from 'react';
import { observer } from 'mobx-react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import LogsStore from '../../stores/LogsStore';
import { Checkbox, Collapse } from '@material-ui/core';
import { Info as InfoIcon, ExpandLess, ExpandMore } from '@material-ui/icons';

@observer
class LogTypeFilter extends React.Component {
  constructor () {
    super();

    this.state = {
      open: false
    }

    this.toggleOpen = this.toggleOpen.bind(this);
  }

  toggleOpen () {
    this.setState((prevState) => {
      return {
        open: !prevState.open
      }
    })
  }

  handleListItemToggle(value) {
    if (!value) {
      return;
    }

    LogsStore.toggleLogTypeEnabled(value);
  }

  render () {
    let open = this.state.open,
      enabledLogType = LogsStore.enabledLogType;

    return (
      <List component="div" style={{paddingLeft: 16}}>
        <ListItem key='info' dense button onClick={this.handleListItemToggle.bind(this, 'info')}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={enabledLogType.info}
              tabIndex={-1}
              disableRipple
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
            />
          </ListItemIcon>
          <ListItemText primary='Error' />
        </ListItem>
      </List>
    );
  }
}

const componentDetails = {
  label: 'Log Type',
  icon: InfoIcon,
  content: LogTypeFilter
};

export default componentDetails;