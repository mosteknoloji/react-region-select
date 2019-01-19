import React, { Component } from 'react';
import { PropTypes } from 'prop-types'; 
import objectAssign from 'object-assign';
import style from './style';

class Region extends Component {
	constructor (props) {
		super(props);
	}

	delete = () => {
		this.props.onDelete ? this.props.onDelete(this.props.guid) : null;
	}

	renderHandles () {
		return (
			<div>
				<div data-dir='se' style={style.RegionHandleSE} />
				<div data-dir='sw' style={style.RegionHandleSW} />
				<div data-dir='nw' style={style.RegionHandleNW} />
				<div data-dir='ne' style={style.RegionHandleNE} />
				<div style={style.RegionClose} onClick={this.delete}>X</div>
			</div>
		);
	}


	render () {
		const localStyle = {
			width: this.props.width + '%',
			height: this.props.height + '%',
			left: `${this.props.x}%`,
			top: `${this.props.y}%`
		};
		const dataRenderArgs = {
			data: this.props.data,
			isChanging: this.props.changing,
			guid: this.props.guid
		};

		return (
			<div
				style={objectAssign({}, style.Region, localStyle, this.props.customStyle, this.props.data.regionStyle)}
				onMouseDown={this.props.onCropStart}
				onTouchStart={this.props.onCropStart}
				data-wrapper="wrapper"
				>
				{this.renderHandles()}
				{this.props.dataRenderer ? this.props.dataRenderer(dataRenderArgs) : null}
			</div>
		);
	}
}
Region.propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	guid: PropTypes.string.isRequired,
	onCropStart: PropTypes.func.isRequired,
	changing: PropTypes.bool,
	dataRenderer: PropTypes.func,
	data: PropTypes.object,
	customStyle: PropTypes.object
};

module.exports = Region;
