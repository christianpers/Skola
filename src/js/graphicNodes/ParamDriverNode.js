import GraphicNode from './GraphicNode';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';
import HorizontalRangeSlider from '../views/Nodes/NodeComponents/HorizontalRangeSlider';
import VerticalRangeSlider from '../views/Nodes/NodeComponents/VerticalRangeSlider';
import Easing from './Helpers/Easing';

export default class ParamDriverNode extends GraphicNode{
	constructor(renderer, backendData) {
		super();

		console.log('1', backendData);

		this.initValues = backendData ? backendData.data.visualSettings : null;

		// this.el.classList.add('no-height');
		// this.el.classList.add('left-padding');
		// this.el.classList.add('param-driver-node');

		this.isParam = true;
		this.returnsSingleNumber = true;
		this.needsUpdate = true;
		this.title = 'Param modifier';

		this.animateValues = {
			isRunning: false,
			timestamp: 0,
			duration: 0,
			reqAnimFrame: -1,
			firstRunOffset: 0,
		};

		this.onRangeValChangeBound = this.onRangeValChange.bind(this);

		this.onInputChangeBound = this.onInputChange.bind(this);

		// bottomContainer.appendChild(this.toggleStartBtn);
		// this.topPartEl.appendChild(bottomContainer);

		this.modifier = {
		};

		this.paramVals = {};

		this.params = {
		};

		this.updateBound = this.update.bind(this);

		this.update();
	}

	onInputChange(e) {
		this.updateVisualSettings();
		this.reset();
	}

	updateVisualSettings() {
		const minMaxVal = this.verticalRangeSlider.getMinMaxValue();
		const knobValue = this.verticalRangeSlider.value;

		this.syncVisualSettings({
			min: minMaxVal.min,
			max: minMaxVal.max,
			value: knobValue,
		});
	}

	getSettings() {
		if (!this.settingsContainer) {
			console.log('create new settings container');
			const settingsContainer = document.createElement('div');
			settingsContainer.className = 'node-settings param-driver-node';

			const sliderContainer = document.createElement('div');
			sliderContainer.className = 'slider-row';
			
			this.verticalRangeSlider = new VerticalRangeSlider(
				sliderContainer, 0, this.onRangeValChangeBound, 2, this.onInputChangeBound
			);
			if (this.initValues) {
				const obj = {
					minMax: {
						min: this.initValues.min,
						max: this.initValues.max,
					},
					defaultVal: this.initValues.value,
				};
				this.verticalRangeSlider.setDefaultValues(obj);
			}
	
			this.durationEl = document.createElement('input');
			this.durationEl.type = 'number';
			this.durationEl.value = 2000;
			this.durationEl.step = 1;
			this.durationEl.min = 400;
			this.durationEl.max = 10000;
			this.durationEl.addEventListener('change', this.onInputChangeBound);
	
			const durationContainer = document.createElement('div');
			durationContainer.className = 'duration-container (ms)';
	
			const durationLabel = document.createElement('p');
			durationLabel.innerHTML = 'Duration';
	
			durationContainer.appendChild(durationLabel);
			durationContainer.appendChild(this.durationEl);
	
			const bottomContainer = document.createElement('div');
			bottomContainer.className = 'top-bottom-container';
	
			bottomContainer.appendChild(durationContainer);
	
			this.onToggleStartClickBound = this.onToggleStartClick.bind(this);
	
			this.toggleStartBtn = document.createElement('div');
			this.toggleStartBtn.className = 'toggle-start';
			this.toggleStartBtn.addEventListener('click', this.onToggleStartClickBound);
	
			this.toggleBtnText = document.createElement('p');
			this.toggleBtnText.innerHTML = 'Start';
	
			this.toggleStartBtn.appendChild(this.toggleBtnText);

			settingsContainer.appendChild(sliderContainer);
			settingsContainer.appendChild(bottomContainer);
			// settingsContainer.appendChild(rotationSliderContainer);
			bottomContainer.appendChild(this.toggleStartBtn);

			this.settingsContainer = settingsContainer;
		}

		return this.settingsContainer;
	}

	reset() {
		// this.verticalRangeSlider.setValue(0);
		this.animateValues.isRunning = false;
		this.toggleBtnText.innerHTML = 'Start';
	}

	onToggleStartClick() {
		if (this.animateValues.isRunning) {
			this.animateValues.isRunning = false;
			this.toggleBtnText.innerHTML = 'Start';
		} else {
			this.toggleBtnText.innerHTML = 'Stop';
			this.animateValues.timestamp = Date.now();
			this.animateValues.duration = parseInt(this.durationEl.value);

			this.animateValues.firstRunOffset = Math.floor(this.verticalRangeSlider.value * this.animateValues.duration);
			this.animateValues.isReverse = false;
			this.animateValues.easing = Easing.linear;
			this.animateValues.isRunning = true;
		}
	}

	getValue() {
		return this.verticalRangeSlider ? this.verticalRangeSlider.getReadyValue() : 0;
	}

	update() {

		this.animateValues.reqAnimFrame = requestAnimationFrame(this.updateBound);

		if (!this.animateValues.isRunning) {
			return;
		}

		const now = Date.now();
		const diff = now - this.animateValues.timestamp + this.animateValues.firstRunOffset;
		const normalizedDiff = this.animateValues.easing(Math.min(diff / this.animateValues.duration, 1.0));
		// const normalizedDiff = Math.min(diff / this.animateValues.duration, 1.0);

		const normalizedVal = this.animateValues.isReverse ? 1 - normalizedDiff : normalizedDiff;
		if (normalizedVal >= 1.0) {
			this.animateValues.timestamp = now;
			this.animateValues.isReverse = true;
			this.animateValues.firstRunOffset = 0.0;
			// this.animateValues.easing = Ease.easeInOutCubic;
		} else if (normalizedVal <= 0.0) {
			this.animateValues.timestamp = now;
			this.animateValues.isReverse = false;
		}

		this.verticalRangeSlider.setValue(normalizedVal);

	}

	render() {

	}

	onRangeValChange(value) {

		this.updateVisualSettings();

		// loop through connections
		for (let i = 0; i < this.currentOutConnectionsLength; i++) {
			const param = window.NS.singletons.ConnectionsManager.params[this.currentOutConnections[i].connection.paramID];
			// const param = this.currentOutConnections[i].param;
			const inNode = window.NS.singletons.ConnectionsManager.nodes[this.currentOutConnections[i].inNodeID];

			inNode.updateParam(param, this);
		}

	}

	onConnectionAdd(e) {
		console.log('graphic node on connection add param: ', e.detail, e.type, this.ID);

		if (e.detail.connection.outNodeID === this.ID) {
			// const connection = e.detail.connection;
			// const paramContainer = window.NS.singletons.ConnectionsManager.params[connection.paramID];
			
			// this.orbitSliders[paramContainer.param.parent][paramContainer.param.param].show();
			this.currentOutConnections.push(e.detail);
			this.currentOutConnectionsLength = this.currentOutConnections.length;
			
		}
	}

	onConnectionRemove(e) {
		console.log('graphic node on connection remove: ', e.detail, e.type, this.ID);

		if (e.detail.connection.outNodeID === this.ID) {
			const connection = e.detail.connection;
			const paramIDToRemove = connection.paramID;
			const outIDToRemove = connection.outNodeID;
			const inIDToRemove = e.detail.inNodeID;
			// const paramContainer = window.NS.singletons.ConnectionsManager.params[connection.paramID];
			
			const tempOutConnections = this.currentOutConnections.map(t => t);

			const paramConnections = tempOutConnections.filter(t => (t.inNodeID === inIDToRemove && t.connection.paramID !== paramIDToRemove));
			const nodeConnections = tempOutConnections.filter(t => (t.inNodeID === inIDToRemove && t.connection.outNodeID !== outIDToRemove));
			
			const finalConnections = paramConnections.concat(nodeConnections);
			this.currentOutConnections = finalConnections;
			this.currentOutConnectionsLength = this.currentOutConnections.length;

			// if (this.currentOutConnectionsLength <= 0) {
			// 	this.reset();
			// }
		}
	}

	
	// enableOutput(param, connection) {
	// 	super.enableOutput();

	// 	this.currentOutConnections.push(connection);
	// 	this.currentOutConnectionsLength = this.currentOutConnections.length;

	// 	if (this.currentOutConnectionsLength === 1) {
	// 		this.verticalRangeSlider.setDefaultValues(param);
	// 	}
		
	// }

	enableInput(outputNode) {
		super.enableInput();		
	}

	// disableOutput(node, param) {
	// 	const tempOutConnections = this.currentOutConnections.map(t => t);

    //     let paramConnections = tempOutConnections.filter(t => t.param);
    //     let nodeConnections = tempOutConnections.filter(t => !t.param);

    //     if (param) {
    //         paramConnections = paramConnections.filter(t => t.param && (t.param.title !== param.title));
    //     } else {
    //         nodeConnections = nodeConnections.filter(t => t.in.ID !== nodeIn.ID);
    //     }
        
    //     const finalConnections = paramConnections.concat(nodeConnections);
    //     this.currentOutConnections = finalConnections;
    //     this.currentOutConnectionsLength = this.currentOutConnections.length;

    //     if (this.currentOutConnectionsLength <= 0) {
    //         super.disableOutput();

    //     }
		
		
	// }

	removeFromDom() {

		this.reset();
		window.cancelAnimationFrame(this.animateValues.reqAnimFrame);

		super.removeFromDom();

	}

}