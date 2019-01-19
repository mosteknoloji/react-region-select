import React, { Component } from 'react';
import objectAssign from 'object-assign';
import RegionSelect from '../RegionSelect';

require('./style.css');

class App extends Component {
	constructor (props) {
		super(props);
		this.regionRenderer = this.regionRenderer.bind(this);
		this.onChange = this.onChange.bind(this);
		this.addRegion = this.addRegion.bind(this);
		this.addAnchor = this.addAnchor.bind(this);
		this.addCapture = this.addCapture.bind(this);
		this.state = {
			current: 'anchor',
			anchorName: '',
			captureName: '',
			regions: []
		};
	}
	onChange (regions) {
		this.setState({
			regions: regions
		});
	}

	addAnchor() {
		this.addRegion(57.31, 8.72, 20, 10, 'rgba(0, 255, 0, 0.5)', this.state.anchorName, null);
	}

	addCapture() {

	}

	addRegion(x, y, width, height, color, label, parent) {

		const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});

		const regions = this.state.regions;
		const region = {
			x: x,
			y: y,
			width: width,
			height: height,
			data: {
				parent: parent,
				label: label,
				regionStyle: {
					background: color
				}
			},
			guid: guid,
			isChanging: false
		};
		regions.push(region);
		this.setState({regions: regions});
	}
	
	regionRenderer (regionProps) {
		if (!regionProps.isChanging) {
			return (
				<div style={{ position: 'absolute', right: 0, bottom: '-1.5em' }}>
				<label>{regionProps.data.label}</label>
				</div>
			);
		}
	}

	render() {

		const regionStyle = {
			background: 'rgba(255, 0, 0, 0.5)'
		};

		return (
			<div style={{ display: 'flex' }}>
				<div style={{ flexGrow: 1, flexShrink: 1, width: '50%' }}>
					<RegionSelect
						maxRegions={0}
						regions={this.state.regions}
            			regionStyle={regionStyle}
						constraint
						onChange={this.onChange}
						regionRenderer={this.regionRenderer}
						style={{ border: '1px solid black' }}
					>
						<img src='/static/example-doc.jpg' width='100%'/>
					</RegionSelect>
				</div>
				<div style={{ flexGrow: 1, flexShrink: 1, width: '50%', padding: 15 }}>
					Select something with your mouse on the left side
					<br />
					<input onChange={(event) => this.setState({anchorName: event.target.value})}></input>
					<button onClick={this.addAnchor}>Add Anchor</button>
					<br />
					<input onChange={(event) => this.setState({captureName: event.target.value})}></input>
					<button onClick={this.addCapture}>Add Capture</button>
					<br />
				</div>

			</div>
		);
	}
}

module.exports = App;
