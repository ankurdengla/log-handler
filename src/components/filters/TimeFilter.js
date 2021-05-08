import React from 'react';
import { observer } from 'mobx-react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import LogsStore from '../../stores/LogsStore';
import { TextField } from '@material-ui/core';

@observer
class TimeFilter extends React.Component {
  handleDateChange (criteria, event) {
    LogsStore.updateTimestamp(criteria, (new Date(event.target.value).getTime()));
  }

  render () {
    return  (
      <List component="div">
        <ListItem dense>
          <TextField
            label="From"
            type="datetime-local"
            defaultValue="2017-05-24T10:30:00"
            style={{
              paddingTop: 4,
              paddingBottom: 4
            }}
            inputProps={{
              step: 1,
              style: {
                fontSize: 12
              }
            }}
            onBlur={this.handleDateChange.bind(this, 'from')}
          />
        </ListItem>
        <ListItem>
          <TextField
            label="To"
            type="datetime-local"
            defaultValue="2017-05-24T10:30:00"
            style={{
              paddingTop: 4,
              paddingBottom: 4
            }}
            inputProps={{
              step: 1,
              style: {
                fontSize: 12
              }
            }}
            onBlur={this.handleDateChange.bind(this, 'to')}
          />
        </ListItem>
      </List>
    );
  }
}

function resetTimeFilter () {
  LogsStore.updateTimestamp('to', -1);
  LogsStore.updateTimestamp('from', -1);
}

const componentDetails = {
  label: 'Time',
  content: TimeFilter,
  resetFunction: resetTimeFilter
};

export default componentDetails;