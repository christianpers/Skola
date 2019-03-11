import GraphicNode from './GraphicNode';
// import InputComponent from '../views/Nodes/NodeComponents/InputComponent';
import VerticalSlider from '../views/Nodes/NodeComponents/VerticalSlider';

export default class OrbitDriverNode extends GraphicNode{
	constructor() {
		super();

		this.needsUpdate = true;

		this.el.classList.add('no-height');
		this.el.classList.add('left-padding');
		this.el.classList.add('orbit-driver-node');

		this.isParam = true;

		this.animateValues = {
			isRunning: false,
			reqAnimFrame: -1,
			counter: 1552337385540,
		};

		this.currentOrbit = 10;
		this.currentSpeed = 0;
		this.currentRotationY = 0;
		this.currentRotationX = 0;

		this.outValues = {
			Position: {
				x: 0,
				y: 0,
				z: 0,
			},
			Rotation: {
				x: 0,
				y: 0,
			}
		};

		this.onSpeedChangeBound = this.onSpeedChange.bind(this);
		this.onOrbitChangeBound = this.onOrbitChange.bind(this);
		this.onRotationChangeYBound = this.onRotationChangeY.bind(this);
		this.onRotationChangeXBound = this.onRotationChangeX.bind(this);

		const settingsContainer = document.createElement('div');
		settingsContainer.className = 'settings-container-outer';

		this.topPartEl.appendChild(settingsContainer);

		this.speedSlider = new VerticalSlider(
			settingsContainer, 0, this.onSpeedChangeBound, 2, {min: -10, max: 10}, 'Orbit speed',
		);

		this.orbitSlider = new VerticalSlider(
			settingsContainer, 10, this.onOrbitChangeBound, 0, {min: 0, max: 20}, 'Orbit radie',
		);

		this.rotationXSlider = new VerticalSlider(
			settingsContainer, 0, this.onRotationChangeXBound, 3, {min: -1, max: 1}, 'Rotation X',
		);

		this.rotationYSlider = new VerticalSlider(
			settingsContainer, 0, this.onRotationChangeYBound, 3, {min: -1, max: 1}, 'Rotation Y',
		);




		// const speedSettings = {
		// 	step: 1,
		// 	value: this.currentSpeed,
		// 	min: 1,
		// 	max: 20,
		// };
		// this.speedContainer = new InputComponent(settingsContainer, 'speed', speedSettings, this.onSpeedChangeBound);

		// const orbitSettings = {
		// 	step: 1,
		// 	value: this.currentOrbit,
		// 	min: 1,
		// 	max: 100,
		// };
		// this.orbitContainer = new InputComponent(settingsContainer, 'radie', orbitSettings, this.onOrbitChangeBound);

		// const rotationSettings = {
		// 	step: .01,
		// 	value: this.currentRotationY,
		// 	min: -10,
		// 	max: 10,
		// };
		// this.rotationContainerY = new InputComponent(settingsContainer, 'rotation Y', rotationSettings, this.onRotationChangeYBound);
		// this.rotationContainerX = new InputComponent(settingsContainer, 'rotation X', rotationSettings, this.onRotationChangeXBound);

		this.topPartEl.appendChild(settingsContainer);

		this.onToggleStartClickBound = this.onToggleStartClick.bind(this);

		this.toggleStartBtn = document.createElement('div');
		this.toggleStartBtn.className = 'toggle-start';
		this.toggleStartBtn.addEventListener('click', this.onToggleStartClickBound);

		this.toggleBtnText = document.createElement('p');
		this.toggleBtnText.innerHTML = 'Start';

		this.toggleStartBtn.appendChild(this.toggleBtnText);

		// bottomContainer.appendChild(this.toggleStartBtn);
		this.topPartEl.appendChild(this.toggleStartBtn);

		this.modifier = {
		};

		this.paramVals = {};

		this.params = {
		};

		this.updateBound = this.update.bind(this);

		this.update();
	}

	onRotationChangeX(val) {
		
		this.currentRotationX = val;
	}

	onRotationChangeY(val) {
		
		this.currentRotationY = val;
	}

	onOrbitChange(val) {
		
		this.currentOrbit = val;
	}

	onSpeedChange(val) {

		this.currentSpeed = val;
	}

	reset() {
		this.animateValues.isRunning = false;
		this.toggleBtnText.innerHTML = 'Start';
	}

	onToggleStartClick() {
		if (this.animateValues.isRunning) {
			this.animateValues.isRunning = false;
			this.toggleBtnText.innerHTML = 'Start';
		} else {
			this.toggleBtnText.innerHTML = 'Stop';
			this.animateValues.isRunning = true;

		}
	}

	getValue(param) {
		return this.outValues[param.parent][param.param];
	}

	update() {
		if (!this.animateValues.isRunning) {
			return;
		}

		const timestamp = this.animateValues.counter * 0.01;
		const x = Math.cos(timestamp * this.currentSpeed) * this.currentOrbit;
    	const z = Math.sin(timestamp * this.currentSpeed) * this.currentOrbit;

    	this.outValues['Position'].x = x;
    	this.outValues['Position'].z = z;
    	this.outValues['Rotation'].y += this.currentRotationY;
    	this.outValues['Rotation'].x += this.currentRotationX;

    	for (let i = 0; i < this.currentOutConnectionsLength; i++) {
			const param = this.currentOutConnections[i].param;

			this.currentOutConnections[i].in.updateParam(param, this);
		}

		this.animateValues.counter++;
	}

	render() {

	}

	
	enableOutput(param, connection) {
		super.enableOutput();

		this.currentOutConnections.push(connection);
		this.currentOutConnectionsLength = this.currentOutConnections.length;

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
            this.onToggleStartClick();

        }		
	}

	removeFromDom() {

		this.reset();
		window.cancelAnimationFrame(this.animateValues.reqAnimFrame);

		this.speedSlider.remove();

		this.orbitSlider.remove();

		this.rotationXSlider.remove();

		this.rotationYSlider.remove();

		super.removeFromDom();

	}

}