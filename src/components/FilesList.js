import React from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import LogsStore from '../stores/LogsStore';

@observer
class FilesList extends React.Component { 
  constructor () {
    super();

    this.handleListItemToggle = _.debounce(this.handleListItemToggle.bind(this), 500, { leading: true, trailing: false });
  }

  handleListItemToggle(value) {
    let fileData = LogsStore.filesData[value];

    if (!value || !fileData) {
      return;
    }

    fileData.isEnabled ? LogsStore.disableFile(value) : LogsStore.enableFile(value);
  }

  render () {
    let filesData = LogsStore.filesData,
      files = Object.keys(filesData);
   
    return (
      <List>
        {files.map((value) => {
          const labelId = `checkbox-list-label-${value}`;

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
      </List>
    );
  }
}

export default FilesList;