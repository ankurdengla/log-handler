import React from 'react';
import LogsStore from '../stores/LogsStore';

export default class InputBar extends React.Component {
	componentDidMount () {
		this.addListeners();
	}
	
	addListeners () {
		this.fileInput.addEventListener('change', () => {
			let filesList = (this.fileInput && this.fileInput.files) || {};

			Object.keys(filesList).forEach((fileIndex) => {
				let file = filesList[fileIndex];

				if (!file) {
					return;
				}

				let fileReader = new FileReader();
				
				fileReader.addEventListener('load', (e) => {
					LogsStore.addFileData(file, e.target.result);
				});

				fileReader.readAsText(file);
			});
		});
	}

	render () {
		return (
			<div className='input-container'>
				<input 
					ref={(input) => { this.fileInput = input; }}
					type='file' multiple 
				/>
			</div>
		);
	}	
}