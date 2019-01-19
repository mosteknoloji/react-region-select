import React, { Component } from 'react';
import { PropTypes } from 'prop-types'; 
import objectAssign from 'object-assign';
import Region from './Region';
import style from './style';

class RegionSelect extends Component {
	
	constructor (props) {
		super(props);
		this.onDocMouseTouchMove = this.onDocMouseTouchMove.bind(this);
		this.onDocMouseTouchEnd = this.onDocMouseTouchEnd.bind(this);
		this.onRegionMoveStart = this.onRegionMoveStart.bind(this);
	}

	componentDidMount() {
		document.addEventListener('mousemove', this.onDocMouseTouchMove);
		document.addEventListener('touchmove', this.onDocMouseTouchMove);

		document.addEventListener('mouseup', this.onDocMouseTouchEnd);
		document.addEventListener('touchend', this.onDocMouseTouchEnd);
		document.addEventListener('touchcancel', this.onDocMouseTouchEnd);
	}

	componentWillUnmount() {
		document.removeEventListener('mousemove', this.onDocMouseTouchMove);
		document.removeEventListener('touchmove', this.onDocMouseTouchMove);

		document.removeEventListener('mouseup', this.onDocMouseTouchEnd);
		document.removeEventListener('touchend', this.onDocMouseTouchEnd);
		document.removeEventListener('touchcancel', this.onDocMouseTouchEnd);
	}

	getClientPos(e) {
		let pageX, pageY;

		if (e.touches) {
			pageX = e.touches[0].pageX;
			pageY = e.touches[0].pageY;
		} else {
			pageX = e.pageX;
			pageY = e.pageY;
		}

		return {
			x: pageX,
			y: pageY
		};
	}
	onDocMouseTouchMove (event) {
		if (!this.isChanging) {
			return;
		}
		const index = this.props.regions.findIndex(x => x.guid===this.regionChangeId);
		const updatingRegion = this.props.regions[index];
		const clientPos = this.getClientPos(event);
		const regionChangeData = this.regionChangeData;

		let x, y, width, height;
		if (!regionChangeData.isMove) {
			let x1Pc, y1Pc, x2Pc, y2Pc;
			x1Pc = (regionChangeData.clientPosXStart - regionChangeData.imageOffsetLeft) / regionChangeData.imageWidth * 100;
			y1Pc = (regionChangeData.clientPosYStart - regionChangeData.imageOffsetTop) / regionChangeData.imageHeight * 100;
			x2Pc = (clientPos.x - regionChangeData.imageOffsetLeft) / regionChangeData.imageWidth * 100;
			y2Pc = (clientPos.y - regionChangeData.imageOffsetTop) / regionChangeData.imageHeight * 100;
			x = Math.min(x1Pc, x2Pc);
			y = Math.min(y1Pc, y2Pc);
			width = Math.abs(x1Pc - x2Pc);
			height = Math.abs(y1Pc - y2Pc);
			if(this.props.constraint){
				if (x2Pc >= 100) { x = x1Pc; width = 100 - x1Pc; }
				if (y2Pc >= 100) { y = y1Pc; height = 100 - y1Pc; }
				if (x2Pc <= 0) { x = 0; width = x1Pc; }
				if (y2Pc <= 0) { y = 0; height = y1Pc; }
			}
		} else {
			x = (clientPos.x + regionChangeData.clientPosXOffset - regionChangeData.imageOffsetLeft) / regionChangeData.imageWidth * 100;
			y = (clientPos.y + regionChangeData.clientPosYOffset - regionChangeData.imageOffsetTop) / regionChangeData.imageHeight * 100;
			width = updatingRegion.width;
			height = updatingRegion.height;
			if(this.props.constraint){
				if (x + width >= 100) { x = Math.round(100 - width); }
				if (y + height >= 100) { y = Math.round(100 - height); }
				if (x <= 0) { x = 0; }
				if (y <= 0) { y = 0; }
			}
		}

		const rect = {
			x: x,
			y: y,
			width: width,
			height: height,
			isChanging: true
		};
		this.props.onChange([
			...this.props.regions.slice(0, index),
			objectAssign({}, updatingRegion, rect),
			...this.props.regions.slice(index + 1)
		]);
	}
	onDocMouseTouchEnd () {
		if (this.isChanging) {
			this.isChanging = false;
			const index = this.props.regions.findIndex(x => x.guid===this.regionChangeId);
			const updatingRegion = this.props.regions[index];
			const changes = {
				isChanging: false
			};
			this.regionChangeId = null;
			this.regionChangeData = null;
			this.props.onChange([
				...this.props.regions.slice(0, index),
				objectAssign({}, updatingRegion, changes),
				...this.props.regions.slice(index + 1)
			]);
		}
	}

	getElementOffset (el) {
		const rect = el.getBoundingClientRect();
		const docEl = document.documentElement;

		const rectTop = rect.top + window.pageYOffset - docEl.clientTop;
		const rectLeft = rect.left + window.pageXOffset - docEl.clientLeft;

		return {
			top: rectTop,
			left: rectLeft
		};
	}

	onRegionMoveStart (event, id) {
		if (!event.target.dataset.wrapper && !event.target.dataset.dir) {
			return;
		}
		event.preventDefault();
		const clientPos = this.getClientPos(event);
		const imageOffset = this.getElementOffset(this.refs.image);

		let clientPosXStart, clientPosYStart;
		const index = this.props.regions.findIndex(x => x.guid===id);
		const currentRegion = this.props.regions[index];
		const regionLeft = (currentRegion.x / 100 * this.refs.image.offsetWidth) + imageOffset.left;
		const regionTop = (currentRegion.y / 100 * this.refs.image.offsetHeight) + imageOffset.top;
		const regionWidth = (currentRegion.width / 100 * this.refs.image.offsetWidth);
		const regionHeight = (currentRegion.height / 100 * this.refs.image.offsetHeight);
		const clientPosDiffX = regionLeft - clientPos.x;
		const clientPosDiffY = regionTop - clientPos.y;

		const resizeDir = event.target.dataset.dir;

		if (resizeDir) {
			if (resizeDir === 'se') {
				clientPosXStart = regionLeft;
				clientPosYStart = regionTop;
			} else if (resizeDir === 'sw') {
				clientPosXStart = regionLeft + regionWidth;
				clientPosYStart = regionTop;
			} else if (resizeDir === 'nw') {
				clientPosXStart = regionLeft + regionWidth;
				clientPosYStart = regionTop + regionHeight;
			} else if (resizeDir === 'ne') {
				clientPosXStart = regionLeft;
				clientPosYStart = regionTop + regionHeight;
			}
		} else {
			clientPosXStart = clientPos.x;
			clientPosYStart = clientPos.y;
		}


		this.isChanging = true;
		this.regionChangeData = {
			imageOffsetLeft: imageOffset.left,
			imageOffsetTop: imageOffset.top,
			clientPosXStart: clientPosXStart,
			clientPosYStart: clientPosYStart,
			clientPosXOffset: clientPosDiffX,
			clientPosYOffset: clientPosDiffY,
			imageWidth: this.refs.image.offsetWidth,
			imageHeight: this.refs.image.offsetHeight,
			isMove: resizeDir ? false : true,
			resizeDir: resizeDir
		};

		this.regionChangeId = id;
	}

	onDelete(id) {
		const i = this.props.regions.findIndex(x => x.guid===id);
		this.props.regions.splice(i, 1);
		this.props.onChange(this.props.regions);

	}

	renderRect (rect, index) {
		return <Region
			x={rect.x}
			y={rect.y}
			width={rect.width}
			height={rect.height}
			data={rect.data}
			key={rect.guid}
			guid={rect.guid}
			customStyle={this.props.regionStyle}
			dataRenderer={this.props.regionRenderer}
			onDelete={(id) => this.onDelete(id)}
			onCropStart={(event) => this.onRegionMoveStart(event, rect.guid)}
			changing={rect.guid === this.regionChangeId}
		/>;
	}

	render () {
		const regions = this.props.regions;
		return (
			<div
				ref='image'
				style={objectAssign({}, style.RegionSelect, this.props.style)}
				className={this.props.className}
				>
				{regions.map(this.renderRect.bind(this))}
				{this.props.debug
					? <table style={{position:'absolute', right: 0, top: 0}}>
							<tbody>
								{regions.map((rect, index) => {
									return (
										<tr key={index}>
											<td>x: {Math.round(rect.x, 1)}</td>
											<td>y: {Math.round(rect.y, 1)}</td>
											<td>width: {Math.round(rect.width, 1)}</td>
											<td>height: {Math.round(rect.height, 1)}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					: null }
				{this.props.children}
			</div>
		);
	}
}
RegionSelect.propTypes = {
	constraint: PropTypes.bool,
	regions: PropTypes.array,
	children: PropTypes.any,
	onChange: PropTypes.func.isRequired,
	onDelete: PropTypes.func,
	regionRenderer: PropTypes.func,
	debug: PropTypes.bool,
	className: PropTypes.string,
	style: PropTypes.object,
	regionStyle: PropTypes.object
};
RegionSelect.defaultProps = {
	debug: false,
	regions: [],
	constraint: false
};

function isSubElement (el, check) {
	if (el === null) {
		return false;
	} else if (check(el)) {
		return true;
	} else {
		return isSubElement(el.parentNode, check);
	}
}

// support both es6 modules and common js
module.exports = RegionSelect;
module.exports.default = RegionSelect;
