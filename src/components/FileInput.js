import React from 'react';
import LogsStore from '../stores/LogsStore';
import Button from '@material-ui/core/Button';

export default class FileInput extends React.Component {
	componentDidMount () {
		this.addListeners();

	  let label = document.querySelector('.file-input-label');
		this.labelSpan = label.querySelector('span');
	}
	
	addListeners () {
		this.fileInput.addEventListener('change', (e) => {
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
					id='file'
					name='file'
					className='inputfile'
					ref={(input) => { this.fileInput = input; }}
					type='file' multiple 
				/>
			<Button
				className='file-input-button'
				color='secondary'
				variant='outlined'
			>
				<label className='file-input-label' htmlFor="file">
					<span>Upload log files</span>
				</label>
			</Button>
			</div>
		);
	}	
}