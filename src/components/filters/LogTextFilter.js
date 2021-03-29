import React from 'react';
import _ from 'lodash';
import { action } from 'mobx';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import LogsStore from '../../stores/LogsStore';
import { Collapse, IconButton, ListItemSecondaryAction, TextField } from '@material-ui/core';
import { Subject as SubjectIcon, Search as SearchIcon, ExpandLess, ExpandMore } from '@material-ui/icons';

class LogTextFilter extends React.Component {
  constructor () {
    super();

    this.state = {
      open: false
    }

    this.filterText = '';
    this.toggleOpen = this.toggleOpen.bind(this);
    this.handleTextChange = _.debounce(this.handleTextChange.bind(this), 300);
    this.handleSearch = _.debounce(this.handleSearch.bind(this), 500); 
  }

  componentDidMount () {
    this.attachListeners();
  }

  toggleOpen () {
    this.setState((prevState) => {
      return {
        open: !prevState.open
      }
    })
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
    let open = this.state.open;

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
  icon: SubjectIcon,
  content: LogTextFilter,
  resetFunction: resetLogTextFilter
};

export default componentDetails;