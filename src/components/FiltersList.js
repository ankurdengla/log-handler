import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import filters from './filters';

class FilterListItem extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: props.isOpen
    };

    this.toggleOpen = this.toggleOpen.bind(this);
  }


  toggleOpen () {
    this.setState((prevState) => {
      return {
        isOpen: !prevState.isOpen
      };
    })
  }

  render () {
    let FilterIcon = this.props.icon,
      FilterContent = this.props.content,
      label = this.props.label,
      isOpen = this.state.isOpen;

    return (
      <React.Fragment>
        <ListItem button onClick={this.toggleOpen}>
          <ListItemIcon>
            <FilterIcon />
          </ListItemIcon>
          <ListItemText primary={label} />
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpen} timeout="auto"> 
          <FilterContent />
        </Collapse>
      </React.Fragment>
    );
  }
}

class FiltersList extends React.Component {
  getFiltersList () {
    return Object.values(filters).map((filter) => {
      return <FilterListItem
        label={filter.label}
        icon={filter.icon}
        content={filter.content}  
        isOpen={filter.isExpanded}
      />
    })
  }
  
  render () {    
    return (
      <List className='filters-list'>
        <ListSubheader disableSticky component="div" style={{fontSize: 16}}>
          Filters
        </ListSubheader>
        {this.getFiltersList()}
      </List>
    );
  }
}

export default FiltersList;