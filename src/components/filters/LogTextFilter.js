import React from 'react';
import _ from 'lodash';

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

  render () {
    let open = this.state.open;

    return  (
      <React.Fragment>
        <ListItem button onClick={this.toggleOpen}>
          <ListItemIcon>
            <SubjectIcon />
          </ListItemIcon>
          <ListItemText primary="Log Text" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List dense component="div" style={{paddingLeft: 16}}>
            <ListItem dense>
              <TextField 
                onChange={this.handleTextChange}
                placeholder='Enter text to search'
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
        </Collapse>
      </React.Fragment>
    );
  }
}

export default LogTextFilter;