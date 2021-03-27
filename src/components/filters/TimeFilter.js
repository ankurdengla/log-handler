import React from 'react';
import { observer } from 'mobx-react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import LogsStore from '../../stores/LogsStore';
import { Collapse, TextField } from '@material-ui/core';
import { Alarm as AlarmIcon, ExpandLess, ExpandMore } from '@material-ui/icons';

@observer
class TimeFilter extends React.Component {
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

  handleDateChange (criteria, event) {
    LogsStore.updateTimestamp(criteria, (new Date(event.target.value).getTime()));
  }

  render () {
    let open = this.state.open;

    return  (
      <React.Fragment>
        <ListItem button onClick={this.toggleOpen}>
          <ListItemIcon>
            <AlarmIcon />
          </ListItemIcon>
          <ListItemText primary="Time" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List dense component="div" style={{paddingLeft: 16}}>
            <ListItem dense>
              <TextField
                label="From"
                type="datetime-local"
                defaultValue="2017-05-24T10:30:00"
                inputProps={{
                  step: 1
                }}
                onBlur={this.handleDateChange.bind(this, 'from')}
              />
            </ListItem>
            <ListItem dense>
              <TextField
                label="To"
                type="datetime-local"
                defaultValue="2017-05-24T10:30:00"
                inputProps={{
                  step: 1
                }}
                onBlur={this.handleDateChange.bind(this, 'to')}
              />
            </ListItem>
          </List>
        </Collapse>
      </React.Fragment>
    );
  }
}

export default TimeFilter;