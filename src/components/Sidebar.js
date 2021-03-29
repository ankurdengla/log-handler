import React from 'react';
import { observer } from 'mobx-react';
import { Button } from '@material-ui/core';
import _ from 'lodash';

import FileInput from './FileInput';
import Filters from './FiltersList';
import LogsStore from '../stores/LogsStore';

@observer
class Sidebar extends React.Component {
  reset(){
    LogsStore.resetStore();
  }

  render () {
    return (
      <div className="sidebar">
        {
          !_.isEmpty(LogsStore.filesData) ? 
            <React.Fragment >
              <ResetButton /> 
              <Filters />
            </React.Fragment>
            :
            <FileInput/>
        }
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

export default Sidebar;