import React from 'react';
import { observer } from 'mobx-react';
import { Button } from '@material-ui/core';
import _ from 'lodash';

import FileInput from './FileInput';
import FilesList from './FilesList';
import LogsStore from '../stores/LogsStore';

export default class Sidebar extends React.Component {
  reset(){
    LogsStore.resetStore();
  }

  render () {
    return (
      <div className="sidebar">
        <FileInput/>
        <FilesList />
        <ResetButton />
      </div>
    );
  }
}

const ResetButton = observer(function () {
  return (
    !_.isEmpty(LogsStore.filesData) && 
      <div
        className='reset-button'
      >
        <Button
          onClick={resetStore}
          color='primary'
          variant='outlined'
          style={{ width: '100%' }}
        >
          Reset
        </Button>
      </div>
  );
}) 

const resetStore = function () {
  LogsStore.resetStore();
}