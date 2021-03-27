import React from 'react';
import { List, ListSubheader } from '@material-ui/core';
import FilesFilter from './filters/FilesFilter'
import TimeFilter from './filters/TimeFilter';
import LogTypeFilter from './filters/LogTypeFilter';

class Filters extends React.Component {
  render () {
    return (
      <List className='filters-list'>
        <ListSubheader disableSticky component="div" style={{fontSize: 16}}>
          Filters
        </ListSubheader>
        <FilesFilter />
        <LogTypeFilter />
        <TimeFilter />
      </List>
    );
  }
}

export default Filters;