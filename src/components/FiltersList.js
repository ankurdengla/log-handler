import React from 'react';
import { observer } from 'mobx-react';

import { List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListSubheader, 
  ListItemSecondaryAction,
  Divider,
  Collapse,
  Button 
} from '@material-ui/core';
import { KeyboardArrowRight, KeyboardArrowDown } from '@material-ui/icons';
import filters from './filters';
import LogsStore from '../stores/LogsStore';

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
        <ListItem button onClick={this.toggleOpen} style={{paddingLeft: 0}}>
          <ListItemIcon>
            {isOpen ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
            <FilterIcon fontSize='small' style={{marginRight: 8, marginLeft: 12}} />
          </ListItemIcon>
          <ListItemText primary={label} />
          <ListItemSecondaryAction>
          <Button disableElevation color='primary' size='small' onClick={resetFunction}>
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

@observer
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
      <List className='filters-list' style={{paddingTop: 16}}>
        <ListSubheader disableSticky component="div" style={{fontSize: 16, display: 'flex'}}>
          Filters
          <span  style={{fontSize: 12,  marginLeft: 'auto' }}>{LogsStore.filteredLogs.length} logs</span>
        </ListSubheader>
        <Divider />
        {this.getFiltersList()}
      </List>
    );
  }
}

export default FiltersList;