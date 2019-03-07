import GraphicNode from './GraphicNode';

export default class OrbitDriverNode extends GraphicNode{
	constructor() {
		super();

		this.el.classList.add('no-height');
		this.el.classList.add('left-padding');
		this.el.classList.add('orbit-driver-node');

		this.isParam = true;

		this.animateValues = {
			isRunning: false,
			reqAnimFrame: -1,
		};

		this.currentOrbit = 10;
		this.currentSpeed = 10;

		this.outValues = {
			x: 0,
			z: 0,
		},

		this.onSpeedChangeBound = this.onSpeedChange.bind(this);
		this.onOrbitChangeBound = this.onOrbitChange.bind(this);

		const settingsContainer = document.createElement('div');
		settingsContainer.className = 'settings-container-outer';

		this.topPartEl.appendChild(settingsContainer);

		const speedContainer = document.createElement('div');
		speedContainer.className = 'speed-container settings-container';

		const speedLabel = document.createElement('h4');
		speedLabel.className = 'speed-label settings-label';
		speedLabel.innerHTML = 'Speed';

		speedContainer.appendChild(speedLabel);

		this.speedEl = document.createElement('input');
		this.speedEl.type = 'number';
		this.speedEl.value = this.currentSpeed;
		this.speedEl.step = 1;
		this.speedEl.min = 1;
		this.speedEl.max = 20;
		this.speedEl.addEventListener('change', this.onSpeedChangeBound);

		speedContainer.appendChild(this.speedEl);

		settingsContainer.appendChild(speedContainer);

		const orbitContainer = document.createElement('div');
		orbitContainer.className = 'orbit-container settings-container';

		const orbitLabel = document.createElement('h4');
		orbitLabel.className = 'orbit-label settings-label';
		orbitLabel.innerHTML = 'Orbit';

		orbitContainer.appendChild(orbitLabel);

		this.orbitEl = document.createElement('input');
		this.orbitEl.type = 'number';
		this.orbitEl.value = this.currentOrbit;
		this.orbitEl.step = 1;
		this.orbitEl.min = 1;
		this.orbitEl.max = 100;
		this.orbitEl.addEventListener('change', this.onOrbitChangeBound);

		orbitContainer.appendChild(this.orbitEl);

		settingsContainer.appendChild(orbitContainer);

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

	onOrbitChange(e) {
		
		this.currentOrbit = this.orbitEl.value;
	}

	onSpeedChange(e) {

		console.log(this.speedEl.value);

		this.currentSpeed = this.speedEl.value;
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
		return this.outValues[param];
	}

	update() {

		this.animateValues.reqAnimFrame = requestAnimationFrame(this.updateBound);

		if (!this.animateValues.isRunning) {
			return;
		}

		const timestamp = Date.now() * 0.0001;
		const x = Math.cos(timestamp * this.currentSpeed) * this.currentOrbit;
    	const z = Math.sin(timestamp * this.currentSpeed) * this.currentOrbit;

    	this.outValues.x = x;
    	this.outValues.z = z;

    	for (let i = 0; i < this.currentOutConnectionsLength; i++) {
			const param = this.currentOutConnections[i].param;

			this.currentOutConnections[i].in.updateParam(param, this);
		}
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

		super.removeFromDom();

	}

}