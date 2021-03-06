import React from 'react';
import { observer } from 'mobx-react';
import { transaction, action } from 'mobx';
import _ from 'lodash';

import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import LogsStore from '../../stores/LogsStore';

@observer
class FilesFilter extends React.Component {
  constructor () {
    super();

    this.getFilesList = this.getFilesList.bind(this);
    this.handleListItemToggle = _.debounce(this.handleListItemToggle.bind(this), 500, { leading: true, trailing: false });
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
                  color='default'
                  size='small'
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
    let filesData = LogsStore.filesData,
      files = Object.keys(filesData);

    return  (
      <List component="div">
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
  content: FilesFilter,
  resetFunction: resetFilesFilter,
  isExpanded: true
};

export default componentDetails;