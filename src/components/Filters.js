import React from 'react';
import { List, ListSubheader } from '@material-ui/core';
import FilesFilter from './filters/FilesFilter'
import TimeFilter from './filters/TimeFilter';

class Filters extends React.Component {
  render () {
    return (
      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Filters
          </ListSubheader>
        }
      >
        <FilesFilter />
        <TimeFilter />
      </List>
    );
  }
}

export default Filters;