import React from 'react';
import _ from 'lodash';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import LogsStore from '../../stores/LogsStore';
import { IconButton, ListItemSecondaryAction, TextField } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';

class LogTextFilter extends React.Component {
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
    LogsStore.updateLogFilterText(this.filterText);
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
            placeholder='Enter text to search'
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

function resetLogTextFilter () {
  LogsStore.updateLogFilterText('');
}

const componentDetails = {
  label: 'Log Text',
  content: LogTextFilter,
  resetFunction: resetLogTextFilter
};

export default componentDetails;