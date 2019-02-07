import GraphicNode from './GraphicNode';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';
import { Vector3 } from 'three';
import HorizontalRangeSlider from '../views/Nodes/NodeComponents/HorizontalRangeSlider';
import Easing from './Helpers/Easing';

export default class ParamDriverNode extends GraphicNode{
	constructor() {
		super();

		this.el.classList.add('no-height');
		this.el.classList.add('left-padding');
		this.el.classList.add('param-driver-node');

		this.isParam = true;

		this.animateValues = {
			isRunning: false,
			timestamp: 0,
			duration: 0,
			reqAnimFrame: -1,
			firstRunOffset: 0,
		};

		this.onRangeValChangeBound = this.onRangeValChange.bind(this);

		this.onInputChangeBound = this.onInputChange.bind(this);

		this.horizontalRangeSlider = new HorizontalRangeSlider(
			this.topPartEl, 0, this.onRangeValChangeBound, 2, this.onInputChangeBound
		);

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

		bottomContainer.appendChild(this.toggleStartBtn);
		this.topPartEl.appendChild(bottomContainer);

		this.modifier = {
		};

		this.paramVals = {};

		this.params = {
		};

		this.updateBound = this.update.bind(this);

		this.update();
	}

	onInputChange(e) {
		
		this.reset();
	}

	reset() {
		// this.horizontalRangeSlider.setValue(0);
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

			this.animateValues.firstRunOffset = Math.floor(this.horizontalRangeSlider.value * this.animateValues.duration);
			this.animateValues.isReverse = false;
			this.animateValues.easing = Easing.linear;
			this.animateValues.isRunning = true;

		}
	}

	getValue() {
		return this.horizontalRangeSlider.getReadyValue();
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

		this.horizontalRangeSlider.setValue(normalizedVal);

	}

	onRangeValChange(value) {

		// loop through connections
		for (let i = 0; i < this.currentOutConnectionsLength; i++) {
			const param = this.currentOutConnections[i].param;

			this.currentOutConnections[i].in.updateParam(param, this);
		}

	}

	
	enableOutput(param, connection) {
		super.enableOutput();

		this.currentOutConnections.push(connection);
		this.currentOutConnectionsLength = this.currentOutConnections.length;

		if (this.currentOutConnectionsLength === 1) {
			this.horizontalRangeSlider.setDefaultValues(param);
		}
		
	}

	enableInput(outputNode) {
		super.enableInput();		
	}

	disableOutput(node, param) {
		const tempOutConnections = this.currentOutConnections.map(t => t);

        let paramConnections = tempOutConnections.filter(t => t.param);
        let nodeConnections = tempOutConnections.filter(t => !t.param);

        if (param) {
            paramConnections = paramConnections.filter(t => t.param && (t.param.title !== param.title));
        } else {
            nodeConnections = nodeConnections.filter(t => t.in.ID !== nodeIn.ID);
        }
        
        const finalConnections = paramConnections.concat(nodeConnections);
        this.currentOutConnections = finalConnections;
        this.currentOutConnectionsLength = this.currentOutConnections.length;

        if (this.currentOutConnectionsLength <= 0) {
            super.disableOutput();

        }
		
		
	}

	removeFromDom() {

		this.reset();
		window.cancelAnimationFrame(this.animateValues.reqAnimFrame);

		super.removeFromDom();

	}

}