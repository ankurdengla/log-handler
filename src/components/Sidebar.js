import React from 'react';
import FileInput from './FileInput';
import FilesList from './FilesList';

export default class Sidebar extends React.Component {
  render () {
    return (
      <div className="sidebar">
        <FileInput/>
        <FilesList />
      </div>
    );
  }
}