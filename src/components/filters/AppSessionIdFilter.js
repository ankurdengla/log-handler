import React from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import { IconButton, ListItemSecondaryAction, List, TextField, ListItem } from '@material-ui/core';
import LogsStore from '../../stores/LogsStore';
import { Search as SearchIcon } from '@material-ui/icons';

@observer
class AppSessionIdFilter extends React.Component {
  constructor () {
    super();

    this.filterText = '';
    this.handleTextChange = _.debounce(this.handleTextChange.bind(this), 300);
    this.handleSearch = _.debounce(this.handleSearch.bind(this), 500); 
  }

  componentDidMount () {
    this.attachListeners();
  }

  handleTextChange (event) {
    if (!event || !event.target) {
      return;
    }

    this.filterText = event.target.value;
  }

  handleSearch () {
    console.log('update - ', this.filterText)
    LogsStore.updateActiveAppSessionIds(this.filterText);
  }

  attachListeners () {
    this.searchFieldRef.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();

        this.handleSearch();
      }
    });
  }

  render () {
    return  (
      <List dense component="div">
        <ListItem dense>
          <TextField 
            onChange={this.handleTextChange}
            placeholder='Enter App IDs'
            ref={(textRef) => { this.searchFieldRef = textRef; }}
          />
          <ListItemSecondaryAction>
            <IconButton
              onClick={this.handleSearch}
            >
              <SearchIcon 
                fontSize='small'
              />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );
  }
}

function resetAppSessionIdFilter () {
  LogsStore.updateActiveAppSessionIds('');
}

const componentDetails = {
  label: 'App Session ID',
  content: AppSessionIdFilter,
  resetFunction: resetAppSessionIdFilter,
  isExpanded: false
};

export default componentDetails;