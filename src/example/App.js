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
		this.addTarget = this.addTarget.bind(this);
		this.state = {
			current: 'anchor',
			anchorName: '',
			captureName: '',
			targetName: '',
			regions: []
		};
	}
	onChange (regions) {
		this.setState({
			regions: regions
		});
	}

	addAnchor() {
		this.addRegion(57.31, 8.72, 20, 10, 'rgba(255, 255, 0, 0.5)', this.state.anchorName, null, 'anchor');
	}

	addCapture() {
		// anchor
		const index = this.state.regions.findIndex(x => x.data.parent === null);
		const anchor = this.state.regions[index];
		// anchor ex

		this.addRegion(57.31, 8.72, 20, 10, 'rgba(0, 255, 0, 0.5)', this.state.captureName, anchor.guid, 'capture');
	}

	addTarget() {

		// anchor
		const index = this.state.regions.findIndex(x => x.data.parent === null);
		const anchor = this.state.regions[index];
		// anchor ex

		this.addRegion(16, 16, 24, 24, 'rgba(0, 0, 0, 0)', this.state.targetName, anchor.guid, 'target');
	}

	addRegion(x, y, width, height, color, label, parent, regionType) {

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
					background: color,
					type: regionType
				}
			},
			guid: guid,
			isChanging: false
		};
		regions.push(region);
		this.setState({regions: regions});
	}

	onDelete(id) {
		const regions = this.state.regions;
		var removed = regions.filter((x) => x.guid != id && x.data.parent != id);
		this.onChange(removed);
	}
	
	regionRenderer (regionProps) {
		if (!regionProps.isChanging) { 
			return (
				<div>
					<div style={{ position: 'absolute', left: 0, top: '-1.5em' }}>
						<label>{regionProps.data.label}</label>
					</div>
					<div onClick={() => this.onDelete(regionProps.guid)} style={{ position: 'absolute', right: '-1.5em', top: '-1.5em' }}>
						<label>X</label>
					</div>
				</div>
			);
		}
	}

	render() {

		return (
			<div style={{ display: 'flex' }}>
				<div style={{ flexGrow: 1, flexShrink: 1, width: '50%' }}>
					<RegionSelect
						constraint
						regions={this.state.regions}
						regionRenderer={this.regionRenderer}
						onChange={this.onChange}
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
					<input onChange={(event) => this.setState({targetName: event.target.value})}></input>
					<button onClick={this.addTarget}>Add Target</button>
					<br />
				</div>

			</div>
		);
	}
}

module.exports = App;
