import React from 'react';
import { observer } from 'mobx-react';
import { transaction, action } from 'mobx';
import _ from 'lodash';

import { List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import LogsStore from '../../stores/LogsStore';
import { Description as DescriptionIcon } from '@material-ui/icons';

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
      <List component="div" style={{paddingLeft: 16}}>
        {this.getFilesList(filesData, files)}
      </List>
    );
  }
}

function resetFilesFilter () {
  transaction(action(() => {
    for (let filename in LogsStore.filesData) {
      LogsStore.filesData[filename].isEnabled = true;
    };
  }))
}

const componentDetails = {
  label: 'Files',
  icon: DescriptionIcon,
  content: FilesFilter,
  resetFunction: resetFilesFilter,
  isExpanded: true
};

export default componentDetails;