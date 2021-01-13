import OrbitDriverNode from '../../OrbitDriverNode';
import VerticalSlider from '../../../views/Nodes/NodeComponents/VerticalSlider';
import VisualHelperSettings from '../../OrbitDriverNode/visual-helper-settings';
import CenterPointSettings from '../../OrbitDriverNode/center-point-settings';
import InputComponent from '../../../views/Nodes/NodeComponents/InputComponent';

import './index.scss';

export default class SpaceOrbitNode extends OrbitDriverNode{
	constructor(renderer, backendData) {
		super(renderer, backendData);

		this.title = 'Space orbit modifier';
		this.onCameraChangedBound = this.onCameraChanged.bind(this);

		document.documentElement.addEventListener('camera-pos-changed', this.onCameraChangedBound);
	}

	onCameraChanged(e) {
		if (this.targetNode) {
			const keys = Object.keys(this.enabledAxes);
			keys.forEach(t => {
				if (t === 'x') {
					this.curve.xRadius = this.getOrbitVal(this.currentXInputVal);
				} else {
					this.curve.yRadius = this.getOrbitVal(this.currentYInputVal);
				}

			});

			const { speed } = this.getSpeedVal(this.speedInput.getValue());
			this.currentSpeed = speed + 0.005;
			// console.log(this.currentSpeed, speed);

			// this.updateMesh();
		}

		// if (!this.targetNode) {
		// 	this.updateMesh();
		// }
	}

	initCurve() {
		const xInitRadius = (this.initValues && this.initValues.orbitX) ? this.initValues.orbitX : 0;
        const yInitRadius = (this.initValues && this.initValues.orbitY) ? this.initValues.orbitY : 0;

		const xRadius = this.getOrbitVal(xInitRadius);
		const yRadius = this.getOrbitVal(yInitRadius);

		this.currentXInputVal = xInitRadius;
		this.currentYInputVal = yInitRadius;

		const speedInitVal = (this.initValues && this.initValues.speed) ? this.initValues.speed : 0;

		const { speed } = this.getSpeedVal(speedInitVal);

		this.currentSpeed = speed;
		
		this.curve = new THREE.EllipseCurve(
			0,  0,            // ax, aY
			xRadius, yRadius, // xRadius, yRadius
			0,  2 * Math.PI,  // aStartAngle, aEndAngle
			false,            // aClockwise
			0                 // aRotation
		);

		this.relativeCurve = new THREE.EllipseCurve(
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

		this.setDistanceToOrigin();
	}

	setDistanceToOrigin() {
		const point = this.curve.getPoint(0);
		// USE ENABLED AXES
		const pointVector = new THREE.Vector3(point.x, 0, point.y);
		const originPoint = new THREE.Vector3();
		const distance = pointVector.distanceToSquared(originPoint);

		this.currentDistanceToOrigin = distance;
	}

	getSettings() {
		if (!this.settingsContainer) {
			const settingsContainer = document.createElement('div');
			settingsContainer.className = 'node-settings space-orbit-node';

			const sliderContainer = document.createElement('div');
			sliderContainer.className = 'slider-row';

			const orbitSliderGroup = document.createElement('div');
			orbitSliderGroup.className = 'orbit-slider-group';

			sliderContainer.appendChild(orbitSliderGroup)

			const labelHTML = `
				<div class="orbit-slider-label-group">
					<h4>Orbit</h4>
					<h5>Miljoner km</h5>
				</div>
			`;

			orbitSliderGroup.insertAdjacentHTML('afterbegin', labelHTML);

			const orbitInnerSliderGroup = document.createElement('div');
			orbitInnerSliderGroup.className = 'orbit-inner-slider-group';

			orbitSliderGroup.appendChild(orbitInnerSliderGroup);

			const speedSliderRow = document.createElement('div');
			speedSliderRow.className = 'slider-row';
			
			const speedSliderGroup = document.createElement('div');
			speedSliderGroup.className = 'orbit-slider-group';

			speedSliderRow.appendChild(speedSliderGroup);

			const labelSpeedHTML = `
				<div class="orbit-slider-label-group">
					<h4>Hastighet</h4>
					<h5>1 = 24h</h5>
				</div>
			`;

			speedSliderGroup.insertAdjacentHTML('afterbegin', labelSpeedHTML);

			const speedInnerSliderGroup = document.createElement('div');
			speedInnerSliderGroup.className = 'orbit-inner-slider-group';

			speedSliderGroup.appendChild(speedInnerSliderGroup);

			const defaultSettings = {
				value: 0,
				step: 0.000001,
				min: 0,
				max: 4503,
			};

			const orbitXInput = new InputComponent(
				orbitInnerSliderGroup,
				'X',
				Object.assign({}, defaultSettings, { value: this.initValues ? this.initValues['orbitX'] : defaultSettings.value }),
				this.onOrbitXChangeBound,
				true,
			);
			

			const orbitYInput = new InputComponent(
				orbitInnerSliderGroup,
				'Y',
				Object.assign({}, defaultSettings, { value: this.initValues ? this.initValues['orbitY'] : defaultSettings.value }),
				this.onOrbitYChangeBound,
				true,
			);
			

			const orbitZInput = new InputComponent(
				orbitInnerSliderGroup,
				'Z',
				Object.assign({}, defaultSettings, { value: this.initValues ? this.initValues['orbitY'] : defaultSettings.value }),
				this.onOrbitZChangeBound,
				true,
			);

			
			if (this.initValues && this.initValues['orbitX']) {
				this.currentXInputVal = this.initValues['orbitX'];
			}

			if (this.initValues && this.initValues['orbitY']) {
				this.currentYInputVal = this.initValues['orbitY'];
			}

			this.speedDefaultSettings = {
				value: this.initValues ? this.initValues['speed'] : 0,
				step: 0.1,
				min: 0,
				max: 60230,
			};

			this.speedInput = new InputComponent(
				speedInnerSliderGroup,
				'Hastighet (mindre betyder fortare)',
				this.speedDefaultSettings,
				this.onSpeedChangeBound,
				false,
			);

			this.orbitSliders = {
				Position: {
					x: orbitXInput,
					y: orbitYInput,
					z: orbitZInput,
				},
				Form: {
					x: orbitXInput,
					y: orbitYInput,
					z: orbitZInput,
				},
			};

			const bottomContainer = document.createElement('div');
			bottomContainer.className = 'slider-row bottom-container';

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

			speedInnerSliderGroup.appendChild(this.toggleStartBtn);

			settingsContainer.appendChild(sliderContainer);
			settingsContainer.appendChild(speedSliderRow);
			settingsContainer.appendChild(bottomContainer);

			this.settingsContainer = settingsContainer;
		}

		// this.refreshSettings();
		
		return this.settingsContainer;
	}

	updateVisualSettings() {
		this.syncVisualSettings({
			orbitX: this.orbitSliders.Position.x.getValue(),
			orbitY: this.currentYInputVal,
			speed: this.speedInput.getValue(),
			isRunning: this.animateValues.isRunning,
            visualHelperEnabled: this.mesh.visible,
			targetNode: this.targetNode ? this.targetNode.ID : null,
		});

		this.updateMesh();
	}

	onCenterPointSelected(fromInit, node) {
		this.targetNode = node;
		window.NS.singletons.LessonManager.space.addPlanetToCheckDistance(node);
		if (!fromInit) {
			this.updateVisualSettings();
		}
	}

	onCenterPointListResetClick() {
		this.targetNode = null;

		window.NS.singletons.LessonManager.space.removePlanetToCheckDistance(node);

		this.updateVisualSettings();

		if (this.nodeConnectedID) {
			const inNode = window.NS.singletons.ConnectionsManager.nodes[this.nodeConnectedID];

			inNode.mesh.position.x = 0;
			inNode.mesh.position.y = 0;
			inNode.mesh.position.z = 0;
		}

		this.curve.aX = 0;
		this.curve.aY = 0;

		this.nodeConnectedID = null;

		this.refreshSettings(true);

		this.updateMesh();
	}

	getSpeedVal(value) {
		/* 
			EARTH EXAMPLE:
			TIME FOR ONE LAP AROUND CIRCLE: 365 days
			CIRCLE DISTANCE: 2 * 3.14 * 149.6(miljoner km) = 939.488
			AVG SPEED = DIST/TIME (939.488 / 365) = 2,573939726
			AVG SPEED (KM / H) = (939.488/(365*24)) * 1000000 = 107 247,488584475

			MOON:
			TIME FOR ONE LAP AROUND CIRCLE: 30.5 days
			CIRCLE DISTANCE: 2 * 3.14 * 0.389(miljoner km) = 2.41152
			AVG SPEED = DIST/TIME (2.41152 / 30.5) = 0.079
			AVG SPEED (KM / H) = (2.41152/(30.5*24)) * 1000000 = 3 294,4262295082

			Merkurius EXAMPLE:
			TIME FOR ONE LAP AROUND CIRCLE: 88 days
			CIRCLE DISTANCE: 2 * 3.14 * 58(miljoner km) = 364.24
			AVG SPEED = DIST/TIME (364.24 / 88) = 4,1390909091
			AVG SPEED (KM / H) = (364.24/(88*24)) * 1000000 = 172 462,121212121

			Neptunus EXAMPLE:
			TIME FOR ONE LAP AROUND CIRCLE: 60225 days
			CIRCLE DISTANCE: 2 * 3.14 * 4503(miljoner km) = 28 278,84
			AVG SPEED = DIST/TIME (28 278,84 / 60225) = 0,4695531756
			AVG SPEED (KM / H) = (28 278,84/(60225*24)) * 1000000 = 19 564,7156496472
		*/

		if (!this.currentXInputVal || value <= 0) {
			return { speed: 0, kmHSpeed: 0 };
		}
		const dist = 2 * Math.PI * this.currentXInputVal;
		const speed = dist / value;

		const kmHSpeed = (dist / (value * 24)) * 1000000;

		return { speed: speed / 3000, kmHSpeed };
	}

	getOrbitVal(value, isRelative) {
		const max = 4503;
		const min = 0;

		const maxScale = 800;

		const val = (value - min) / (max - min);

		if (isRelative) {
			return val * maxScale;
		}

		return val * maxScale + window.NS.singletons.lessons.space.distanceModifier * 3;
	}

	onOrbitXChange(val) {
		this.curve.xRadius = this.getOrbitVal(val, true);
		this.relativeCurve.xRadius = this.getOrbitVal(val, true);
		this.currentXInputVal = val;
		this.updateVisualSettings();

		this.setDistanceToOrigin();
	}

	onOrbitYChange(val) {
		this.curve.yRadius = this.getOrbitVal(val, true);
		this.relativeCurve.yRadius = this.getOrbitVal(val, true);
		this.currentYInputVal = val;
		this.updateVisualSettings();

		this.setDistanceToOrigin();
	}

	onOrbitZChange(val) {
		this.curve.yRadius = this.getOrbitVal(val, true);
		this.relativeCurve.yRadius = this.getOrbitVal(val, true);
		this.currentYInputVal = val;
		this.updateVisualSettings();

		this.setDistanceToOrigin();
	}

	onSpeedChange(val) {
		const { speed, kmHSpeed } = this.getSpeedVal(val);
		this.currentSpeed = speed;
		
		this.updateVisualSettings();
	}

	update() {
		super.update();

		// const point = this.relativeCurve.getPoint(this.currentT);
		// const vectorPoint = new THREE.Vector3(point.x, point.y, point.y);

		// for (let i = 0; i < this.currentOutConnectionsLength; i++) {
		// 	const connectionData = this.currentOutConnections[i];
		// 	const inNode = window.NS.singletons.ConnectionsManager.nodes[connectionData.inNodeID];
		// 	// const paramContainer = window.NS.singletons.ConnectionsManager.params[connectionData.connection.paramID];
			
		// 	inNode.distanceMeasurePosition = vectorPoint;
		// }
	}
}