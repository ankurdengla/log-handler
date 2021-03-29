import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Collapse, ListItemSecondaryAction, Button } from '@material-ui/core';
import { KeyboardArrowRight, KeyboardArrowDown } from '@material-ui/icons';
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
      resetFunction = this.props.resetFunction,
      isOpen = this.state.isOpen;

    return (
      <React.Fragment>
        <ListItem button onClick={this.toggleOpen}>
          <ListItemIcon>
            {isOpen ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
            <FilterIcon fontSize='small'/>
          </ListItemIcon>
          <ListItemText primary={label} />
          <ListItemSecondaryAction>
          <Button disableElevation color='primary' size='primary' onClick={resetFunction}>
            Reset
          </Button>
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={isOpen} timeout='auto' style={{paddingLeft: 16}}> 
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
        resetFunction={filter.resetFunction}
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