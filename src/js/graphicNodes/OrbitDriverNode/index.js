import GraphicNode from '../GraphicNode';
import VerticalSlider from '../../views/Nodes/NodeComponents/VerticalSlider';
import VisualHelperSettings from './visual-helper-settings';
import CenterPointSettings from './center-point-settings';

import './index.scss';

export default class OrbitDriverNode extends GraphicNode{
	constructor(renderer, backendData) {
		super();

		this.initValues = backendData ? backendData.data.visualSettings : null;

		this.needsUpdate = true;
		this.title = 'Orbit modifier';
		this.hasMesh = true;
		this.isForegroundNode = true;

		// USED IN CANVAS SETTINGS TO TOGGLE ON/OFF VISIBILITY
		this.hasHelperMeshToHide = true;

		this.isParam = true;

		this.animateValues = {
			isRunning: this.initValues ? this.initValues['isRunning'] : false,
			reqAnimFrame: -1,
			counter: 1552337385540,
		};

		this.currentT = 0;
		this.currentSpeed = (this.initValues && this.initValues.speed) ? this.initValues.speed * 0.001 : 0;

		this.onNodeAddedFromConnectionsManagerEventBound = this.onNodeAddedFromConnectionsManagerEvent.bind(this);
		this.onNodeRemovedFromConnectionsManagerEventBound = this.onNodeRemovedFromConnectionsManagerEvent.bind(this);

		document.documentElement.addEventListener('node-added-event', this.onNodeAddedFromConnectionsManagerEventBound);
		document.documentElement.addEventListener('node-remove-event', this.onNodeRemovedFromConnectionsManagerEventBound);

		this.outValues = {
			Position: {
				x: 0,
				y: 0,
				z: 0,
			},
		};

		this.targetNode = null;

		this.onSpeedChangeBound = this.onSpeedChange.bind(this);
		this.onOrbitXChangeBound = this.onOrbitXChange.bind(this);
		this.onOrbitYChangeBound = this.onOrbitYChange.bind(this);
		this.onOrbitZChangeBound = this.onOrbitZChange.bind(this);

        this.initCurve();

		this.onToggleStartClickBound = this.onToggleStartClick.bind(this);

        this.onToggleVisualHelperVisibilityBound = this.onToggleVisualHelperVisibility.bind(this);
		this.onCenterPointSelectedBound = this.onCenterPointSelected.bind(this);

		this.onConnectionUpdateBound = this.onConnectionUpdate.bind(this);
		document.documentElement.addEventListener('node-connections-update', this.onConnectionUpdateBound);

		this.nodeConnectedID;

		this.onCenterPointListResetClickBound = this.onCenterPointListResetClick.bind(this);

		this.updateAxes();
		// this.getSettings();
	}

	initCurve() {
		const xRadius = (this.initValues && this.initValues.orbitX) ? this.initValues.orbitX : 0;
        const yRadius = (this.initValues && this.initValues.orbitY) ? this.initValues.orbitY : 0;
		
		this.curve = new THREE.EllipseCurve(
			0,  0,            // ax, aY
			xRadius, yRadius, // xRadius, yRadius
			0,  2 * Math.PI,  // aStartAngle, aEndAngle
			false,            // aClockwise
			0                 // aRotation
		);

		const points = this.curve.getPoints( 50 );
		const arrLength = 51;
		const positions = new Float32Array( 51 * 3 );
		let index = 0;

		for (let i = 0; i < arrLength; i++) {
			positions[index++] = points[i].x;
			positions[index++] = 0;
			positions[index++] = points[i].y;
		}
		const geometry = new THREE.BufferGeometry();
		this.bufferAttr = new THREE.BufferAttribute( positions, 3 );
		this.bufferAttr.setDynamic(true);
		geometry.addAttribute( 'position', this.bufferAttr );

		const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

		this.mesh = new THREE.Line( geometry, material );
		this.mesh.visible = (this.initValues && this.initValues.visualHelperEnabled) ? this.initValues.visualHelperEnabled : false;
	}

	onCenterPointListResetClick() {
		
		this.targetNode = null;

		this.updateVisualSettings();

		if (this.nodeConnectedID) {
			const inNode = window.NS.singletons.ConnectionsManager.nodes[this.nodeConnectedID];

			inNode.mesh.position.x = 0;
			inNode.mesh.position.y = 0;
			inNode.mesh.position.z = 0;
		}

		this.curve.aX = 0;
		this.curve.aY = 0;

		this.refreshSettings(true);

		this.updateMesh();
	}

	onConnectionUpdate(e) {
		const hasConnection = (connections) => {
			const keys = Object.keys(connections);
			let foundConnection = false;
			for (let i = 0; i < keys.length; i++) {
				const inNodeConnections = connections[keys[i]];
				const hasConnection = inNodeConnections.some(t => t.outNodeID === this.ID);
				if (hasConnection) {
					return keys[i];
				}
			}

			return;
		}

		this.nodeConnectedID = hasConnection(e.detail);
	}

	onNodeAddedFromConnectionsManagerEvent() {
		this.refreshSettings();
	}

	onNodeRemovedFromConnectionsManagerEvent() {
		this.refreshSettings();
	}

	hideSettings() {
		
	}

	getSettings() {
		if (!this.settingsContainer) {
			const settingsContainer = document.createElement('div');
			settingsContainer.className = 'node-settings orbit-driver-node';

			const orbitSliderContainer = document.createElement('div');
			orbitSliderContainer.className = 'slider-row';

			const bottomContainer = document.createElement('div');
			bottomContainer.className = 'slider-row bottom-container';
			
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
				orbitSliderContainer,
				this.initValues ? this.initValues['speed'] : 0,
				this.onSpeedChangeBound,
				4,
				{min: 0, max: 10},
				'Orbit speed',
			);

			this.orbitSliders = {
				Position: {
					x: orbitXSlider,
					y: orbitYSlider,
					z: orbitZSlider,
				},
				Form: {
					x: orbitXSlider,
					y: orbitYSlider,
					z: orbitZSlider,
				},
			};

            this.visualHelperSettings = new VisualHelperSettings(
                bottomContainer,
                this.onToggleVisualHelperVisibilityBound,
                (this.initValues && this.initValues.visualHelperEnabled) ? this.initValues.visualHelperEnabled : undefined,
            );

			const centerPointInitValue = (
				this.initValues &&
				this.initValues.targetNode &&
				window.NS.singletons.ConnectionsManager.nodes[this.initValues.targetNode]
			) ? window.NS.singletons.ConnectionsManager.nodes[this.initValues.targetNode].title : null;

			this.centerPointSettings = new CenterPointSettings(
				bottomContainer, this.onCenterPointSelectedBound, centerPointInitValue, this.onCenterPointListResetClickBound,
			);

			this.toggleStartBtn = document.createElement('div');
			this.toggleStartBtn.className = 'toggle-start';
			this.toggleStartBtn.addEventListener('click', this.onToggleStartClickBound);

			this.toggleBtnText = document.createElement('h4');
			this.toggleBtnText.innerHTML = (this.initValues && this.initValues.isRunning) ? 'Stop' : 'Start';

			this.toggleStartBtn.appendChild(this.toggleBtnText);

			settingsContainer.appendChild(orbitSliderContainer);
			settingsContainer.appendChild(bottomContainer);
			settingsContainer.appendChild(this.toggleStartBtn);

			this.settingsContainer = settingsContainer;
		}

		this.refreshSettings();
		
		return this.settingsContainer;
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

    onToggleVisualHelperVisibility(enabled, syncBackend = true) {
        this.mesh.visible = enabled;
		if (syncBackend) {
			this.updateVisualSettings();
		}
        
    }

	onCenterPointSelected(fromInit, node) {
		this.targetNode = node;
		if (!fromInit) {
			this.updateVisualSettings();
		}
	}

	updateVisualSettings() {
		this.syncVisualSettings({
			orbitX: this.curve.xRadius,
			orbitY: this.curve.yRadius,
			speed: this.currentSpeed * 1000.0,
			isRunning: this.animateValues.isRunning,
            visualHelperEnabled: this.mesh.visible,
			targetNode: this.targetNode ? this.targetNode.ID : null,
		});

		this.updateMesh();
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
		if (this.targetNode && this.nodeConnectedID) {
			const { position } = this.targetNode.mesh;
			const finalAxesToSet = {x: position.x, y: position.y, z: position.z};
			
			const enabledParams = this.targetNode.nodeType.getEnabledParamsForType('Position', {x: {enabled: false}, y: {enabled: false}, z: {enabled: false}});
			let yVal = 0;

			
			
			const targetPoint = this.curve.getPoint(this.currentT);
			if (this.enabledAxes['x']) {
				this.curve.aX = this.targetNode.mesh.position.x;
				finalAxesToSet.x = targetPoint.x;
			} else {
				this.curve.aX = 0;
			}

			if (this.enabledAxes['y']) {
				yVal = this.targetNode.mesh.position.y;
				finalAxesToSet.y = targetPoint.y;
			}

			if (this.enabledAxes['z']) {
				yVal = this.targetNode.mesh.position.z;
				finalAxesToSet.z = targetPoint.y;
			}
			this.curve.aY = yVal;

			

			const finalHelperMesh = {};

			// CIRCLE HELPER POSITION
			if (!this.enabledAxes['x'] && enabledParams['x'].enabled) {
				finalHelperMesh.x = this.targetNode.mesh.position.x;
			}

			if (!this.enabledAxes['y'] && enabledParams['y'].enabled) {
				finalHelperMesh.y = this.targetNode.mesh.position.y;
			}

			if (!this.enabledAxes['z'] && enabledParams['z'].enabled) {
				finalHelperMesh.z = this.targetNode.mesh.position.z;
			}

			const inNode = window.NS.singletons.ConnectionsManager.nodes[this.nodeConnectedID];

			inNode.mesh.position.x = finalAxesToSet.x;
			inNode.mesh.position.y = finalAxesToSet.y;
			inNode.mesh.position.z = finalAxesToSet.z;

			this.updateMesh(finalHelperMesh);
		} else {
			this.curve.aX = 0;
			this.curve.aY = 0;

			const point = this.curve.getPoint(this.currentT);

			this.outValues['Position'].x = point.x;
			this.outValues['Position'].y = point.y;
			this.outValues['Position'].z = point.y;

			
			/* LOOKAT has to be done before setting position ---- WHY DO WE DO THIS ???  FUCKED UP THE ROTATION */
			// for (let i = 0; i < this.currentOutConnectionsLength; i++) {
			// 	const connectionData = this.currentOutConnections[i];
			// 	const inNode = window.NS.singletons.ConnectionsManager.nodes[connectionData.inNodeID];
			// 	inNode.mesh.lookAt(new THREE.Vector3(point.x, 0, point.y));
			// }

			for (let i = 0; i < this.currentOutConnectionsLength; i++) {
				const connectionData = this.currentOutConnections[i];
				const inNode = window.NS.singletons.ConnectionsManager.nodes[connectionData.inNodeID];
				const paramContainer = window.NS.singletons.ConnectionsManager.params[connectionData.connection.paramID];
				
				
				inNode.updateParam(paramContainer, this);
			}
		}
		
		if (!this.animateValues.isRunning) {
			return;
		}

		this.currentT = this._calcCurrentT();
		
	}

	updateAxes() {
		this.enabledAxes = {x: false, y: false, z: false};
		for (let i = 0; i < this.currentOutConnectionsLength; i++) {
			const connectionData = this.currentOutConnections[i];
			const paramContainer = window.NS.singletons.ConnectionsManager.params[connectionData.connection.paramID];
			this.enabledAxes[paramContainer.param.param] = true;	
		}
	}

	updateMesh(curvePointsForHelperMesh = {}) {
		const points = this.curve.getPoints( 50 );
		const arrLength = 51;
		const positions = new Float32Array( 51 * 3 );
		let index = 0;

		for (let i = 0; i < arrLength; i++) {
			positions[index++] = this.enabledAxes['x'] ? points[i].x : curvePointsForHelperMesh['x'] || 0;
			positions[index++] = this.enabledAxes['y'] ? points[i].y : curvePointsForHelperMesh['y'] || 0;
			positions[index++] = this.enabledAxes['z'] ? points[i].y : curvePointsForHelperMesh['z'] || 0;
		}
		this.bufferAttr.set(positions);
		this.mesh.geometry.attributes.position.needsUpdate = true;
	}

	render() {

	}

	refreshSettings(resetSelected) {
		if (this.centerPointSettings) {
			this.centerPointSettings.refresh(this.nodeConnectedID, resetSelected);
		}
		

		this.currentOutConnections.forEach(t => {
			const conn = t.connection;
			const paramContainer = window.NS.singletons.ConnectionsManager.params[conn.paramID];
			if (paramContainer && this.orbitSliders) {
				this.orbitSliders[paramContainer.param.parent][paramContainer.param.param].show();
			}
			
		})
	}

	onConnectionAdd(e) {
		if (e.detail.connection.outNodeID === this.ID) {
			const connection = e.detail.connection;
			const paramContainer = window.NS.singletons.ConnectionsManager.params[connection.paramID];
			
			// this.orbitSliders[paramContainer.param.parent][paramContainer.param.param].show();
			this.currentOutConnections.push(e.detail);
			this.currentOutConnectionsLength = this.currentOutConnections.length;

			if (this.currentOutConnectionsLength > 0) {
				this.mesh.visible = true;
				if (this.visualHelperSettings) {
					this.visualHelperSettings.enableVisibility();
				}
				

				this.updateAxes();
				this.updateMesh();
				this.refreshSettings();
			}
		}
	}

	onConnectionRemove(e) {
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
				this.mesh.visible = false;
				this.visualHelperSettings.disableVisibility();
			}

			this.updateAxes();
			this.updateMesh();
			this.refreshSettings();
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

	updateAllowedInputParams(inputParams) {
		const ret = [];
		const keys = Object.keys(inputParams);
		
		const connectedInputParamKeys = keys.filter(t => inputParams[t].isConnected);
		const notConnectedInputParamKeys = keys.filter(t => !inputParams[t].isConnected);
		if (connectedInputParamKeys.length >= 2) {
			for (let i = 0; i < notConnectedInputParamKeys.length; i++) {
				const key = notConnectedInputParamKeys[i];
				inputParams[key].setConnectionAllowed(false);
			}
		} else {
			for (let i = 0; i < keys.length; i++) {
				inputParams[keys[i]].setConnectionAllowed(true);
			}
		}

		// CHECK THAT BOTH Y AND Z ARENT SELECTED
		const yParamKey = keys.filter(t => inputParams[t].param.param === 'y');
		const zParamKey = keys.filter(t => inputParams[t].param.param === 'z');

		// CHECK IF INPUT HAS BOTH Y AND Z... OTHERWISE THIS ISNT NEEDED
		if (inputParams[yParamKey] && inputParams[zParamKey]) {
			if (inputParams[yParamKey].isConnected) {
				inputParams[zParamKey].setConnectionAllowed(false);
			}

			if (inputParams[zParamKey].isConnected) {
				inputParams[yParamKey].setConnectionAllowed(false);
			}
		}
	}

	_calcCurrentT() {
		return this.currentT + this.currentSpeed * window.NS.settings.speedModifier;
	}

	get currentT() {
		return this._currentT;
	}

	set currentT(value) {
		this._currentT = value;

		if (this._currentT > 1) {
			this._currentT = 0;
		}
	}
}