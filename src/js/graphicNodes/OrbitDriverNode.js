import GraphicNode from './GraphicNode';
import VerticalSlider from '../views/Nodes/NodeComponents/VerticalSlider';

export default class OrbitDriverNode extends GraphicNode{
	constructor(renderer, backendData) {
		super();

		this.initValues = backendData ? backendData.data.visualSettings : null;

		this.needsUpdate = true;
		this.title = 'Orbit modifier';
		this.isVisualHelper = true;
		this.isForegroundNode = true;

		this.isParam = true;

		this.animateValues = {
			isRunning: this.initValues ? this.initValues['isRunning'] : false,
			reqAnimFrame: -1,
			counter: 1552337385540,
		};

		this.currentT = 0;
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

		const targetParam = {
			title: 'Center Point',
			param: 'center',
			useAsInput: true,
			defaultVal: new THREE.Vector3(),
			paramHelpersType: 'target',
			needsFrameUpdate: false,
		};

		this.targetPosition = new THREE.Vector3();

		this.params = {
			targetParam,
		};

		this.paramVals = {};

		this.onSpeedChangeBound = this.onSpeedChange.bind(this);
		this.onOrbitXChangeBound = this.onOrbitXChange.bind(this);
		this.onOrbitYChangeBound = this.onOrbitYChange.bind(this);
		this.onOrbitZChangeBound = this.onOrbitZChange.bind(this);
		this.onRotationChangeYBound = this.onRotationChangeY.bind(this);
		this.onRotationChangeXBound = this.onRotationChangeX.bind(this);
		
		this.curve = new THREE.EllipseCurve(
			0,  0,            // ax, aY
			10, 10,           // xRadius, yRadius
			0,  2 * Math.PI,  // aStartAngle, aEndAngle
			false,            // aClockwise
			0                 // aRotation
		);

		const points = this.curve.getPoints( 50 );
		const geometry = new THREE.BufferGeometry().setFromPoints( points );

		const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

		// Create the final object to add to the scene
		this.mesh = new THREE.Line( geometry, material );

		this.onToggleStartClickBound = this.onToggleStartClick.bind(this);

		this.getSettings();
	}

	hideSettings() {
		
	}

	getSettings() {
		if (!this.settingsContainer) {
			const settingsContainer = document.createElement('div');
			settingsContainer.className = 'node-settings orbit-driver-node';

			const orbitSliderContainer = document.createElement('div');
			orbitSliderContainer.className = 'slider-row';

			const rotationSliderContainer = document.createElement('div');
			rotationSliderContainer.className = 'slider-row';
			
			const orbitXSlider = new VerticalSlider(
				orbitSliderContainer,
				this.initValues ? this.initValues['orbitX'] : 10,
				this.onOrbitXChangeBound,
				0,
				{min: 0, max: 40},
				'Radie X',
				60,
				true,
			);

			const orbitYSlider = new VerticalSlider(
				orbitSliderContainer,
				this.initValues ? this.initValues['orbitY'] : 10,
				this.onOrbitYChangeBound,
				0,
				{min: 0, max: 40},
				'Radie Y',
				60,
				true,
			);

			const orbitZSlider = new VerticalSlider(
				orbitSliderContainer,
				this.initValues ? this.initValues['orbitY'] : 10,
				this.onOrbitZChangeBound,
				0,
				{min: 0, max: 40},
				'Radie Z',
				60,
				true,
			);

			const speedSlider = new VerticalSlider(
				rotationSliderContainer,
				this.initValues ? this.initValues['speed'] : 0,
				this.onSpeedChangeBound,
				4,
				{min: 0, max: 10},
				'Orbit speed',
			);

			const rotationXSlider = new VerticalSlider(
				rotationSliderContainer,
				this.initValues ? this.initValues['rotationX'] : 0,
				this.onRotationChangeXBound, 
				3,
				{min: -.1, max: .1},
				'Rotation X',
				60,
				true,
			);

			const rotationYSlider = new VerticalSlider(
				rotationSliderContainer,
				this.initValues ? this.initValues['rotationY'] : 0,
				this.onRotationChangeYBound,
				3,
				{min: -.1, max: .1},
				'Rotation Y',
				60,
				true,
			);

			this.orbitSliders = {
				Position: {
					x: orbitXSlider,
					y: orbitYSlider,
					z: orbitZSlider,
				},
				Rotation: {
					x: rotationXSlider,
					y: rotationYSlider,
				},
				Form: {
					x: orbitXSlider,
					y: orbitYSlider,
					z: orbitZSlider,
				},
			};

			this.toggleStartBtn = document.createElement('div');
			this.toggleStartBtn.className = 'toggle-start';
			this.toggleStartBtn.addEventListener('click', this.onToggleStartClickBound);

			this.toggleBtnText = document.createElement('h4');
			this.toggleBtnText.innerHTML = this.initValues ? this.initValues['isRunning'] : 'Start';

			this.toggleStartBtn.appendChild(this.toggleBtnText);

			settingsContainer.appendChild(orbitSliderContainer);
			settingsContainer.appendChild(rotationSliderContainer);
			settingsContainer.appendChild(this.toggleStartBtn);

			this.settingsContainer = settingsContainer;
		}

		return this.settingsContainer;
	}

	onRotationChangeX(val) {
		this.currentRotationX = val;
		this.updateVisualSettings();
	}

	onRotationChangeY(val) {
		this.currentRotationY = val;
		this.updateVisualSettings();
	}

	onOrbitXChange(val) {
		this.curve.xRadius = val;
		this.updateVisualSettings();
	}

	onOrbitYChange(val) {
		this.curve.yRadius = val;
		this.updateVisualSettings();
	}

	onOrbitZChange(val) {
		this.curve.yRadius = val;
		this.updateVisualSettings();
	}

	onSpeedChange(val) {
		this.currentSpeed = val * 0.001;
		this.updateVisualSettings();
	}

	updateVisualSettings() {
		this.syncVisualSettings({
			rotationX: this.currentRotationX,
			rotationY: this.currentRotationY,
			orbitX: this.curve.xRadius,
			orbitY: this.curve.yRadius,
			speed: this.currentSpeed * 1000.0,
			isRunning: this.animateValues.isRunning,
		});
	}

	reset() {
		this.animateValues.isRunning = false;
		this.toggleBtnText.innerHTML = 'Start';
	}

	onToggleStartClick(e) {
		if (this.animateValues.isRunning) {
			this.animateValues.isRunning = false;
			this.toggleBtnText.innerHTML = 'Start';
		} else {
			this.toggleBtnText.innerHTML = 'Stop';
			this.animateValues.isRunning = true;
		}

		this.updateVisualSettings();
	}

	getValue(param) {
		return this.outValues[param.parent][param.param];
	}

	update() {
		const point = this.curve.getPoint(this.currentT);

		this.curve.aX = this.targetPosition.x;
		this.curve.aY = this.targetPosition.z;

		this.outValues['Position'].x = point.x;
		this.outValues['Position'].y = point.y;
    	this.outValues['Position'].z = point.y;
    	this.outValues['Rotation'].y += this.currentRotationY;
		this.outValues['Rotation'].x += this.currentRotationX;
		
		// console.log(this.currentOutConnectionsLength);

    	for (let i = 0; i < this.currentOutConnectionsLength; i++) {
			const connectionData = this.currentOutConnections[i];
			const inNode = window.NS.singletons.ConnectionsManager.nodes[connectionData.inNodeID];
			const paramContainer = window.NS.singletons.ConnectionsManager.params[connectionData.connection.paramID];
			
			inNode.updateParam(paramContainer, this);
		}

		if (!this.animateValues.isRunning) {
			return;
		}

		this.currentT += this.currentSpeed;
		if (this.currentT > 1) {
			this.currentT = 0;
		}
	}

	render() {

	}

	onConnectionAdd(e) {
		console.log('graphic node on connection add orbit: ', e.detail, e.type, this.ID);

		if (e.detail.connection.outNodeID === this.ID) {
			const connection = e.detail.connection;
			const paramContainer = window.NS.singletons.ConnectionsManager.params[connection.paramID];
			
			this.orbitSliders[paramContainer.param.parent][paramContainer.param.param].show();
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
			const paramContainer = window.NS.singletons.ConnectionsManager.params[connection.paramID];
			
			this.orbitSliders[paramContainer.param.parent][paramContainer.param.param].hide();

			const tempOutConnections = this.currentOutConnections.map(t => t);

			const paramConnections = tempOutConnections.filter(t => (t.inNodeID === inIDToRemove && t.connection.paramID !== paramIDToRemove));
			const nodeConnections = tempOutConnections.filter(t => (t.inNodeID === inIDToRemove && t.connection.outNodeID !== outIDToRemove));
			
			const finalConnections = paramConnections.concat(nodeConnections);
			this.currentOutConnections = finalConnections;
			this.currentOutConnectionsLength = this.currentOutConnections.length;

			if (this.currentOutConnectionsLength <= 0) {
				this.reset();
			}
		}
	}

	enableInput(outputNode) {
		super.enableInput();		
	}

	removeFromDom() {

		this.reset();
		window.cancelAnimationFrame(this.animateValues.reqAnimFrame);

		// this.speedSlider.remove();

		// this.orbitXSlider.remove();
		// this.orbitYSlider.remove();
		// this.orbitZSlider.remove();

		// this.rotationXSlider.remove();

		// this.rotationYSlider.remove();

		super.removeFromDom();

	}

}