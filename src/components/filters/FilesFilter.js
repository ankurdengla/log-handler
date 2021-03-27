import React from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import LogsStore from '../../stores/LogsStore';
import { Collapse } from '@material-ui/core';
import { Description as DescriptionIcon, ExpandLess, ExpandMore } from '@material-ui/icons';

@observer
class FilesFilter extends React.Component {
  constructor () {
    super();

    this.state = {
      open: true
    }

    this.toggleOpen = this.toggleOpen.bind(this);
    this.getFilesList = this.getFilesList.bind(this);
    this.handleListItemToggle = _.debounce(this.handleListItemToggle.bind(this), 500, { leading: true, trailing: false });
  }

  toggleOpen() {
    this.setState((prevState) => {
      return {
        open: !prevState.open
      }
    })
  }

  handleListItemToggle(value) {
    let fileData = LogsStore.filesData[value];

    if (!value || !fileData) {
      return;
    }

    LogsStore.toggleFileEnabled(value);
  }

  getFilesList (filesData, files) {
    return (
      <React.Fragment>
        {files.map((value) => {
          let labelId = `checkbox-list-label-${value}`;

          return (
            <ListItem key={value} dense button onClick={this.handleListItemToggle.bind(this, value)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={filesData[value].isEnabled}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItem>
          );
        })}
      </React.Fragment>
    );
  }

  render () {
    let open = this.state.open,
      filesData = LogsStore.filesData,
      files = Object.keys(filesData);

    return  (
      <React.Fragment>
        <ListItem button onClick={this.toggleOpen}>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Files" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List dense component="div" style={{paddingLeft: 16}}>
            {this.getFilesList(filesData, files)}
          </List>
        </Collapse>
      </React.Fragment>
    );
  }
}

export default FilesFilter;