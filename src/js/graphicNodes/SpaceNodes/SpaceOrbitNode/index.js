import OrbitDriverNode from '../../OrbitDriverNode';
import VerticalSlider from '../../../views/Nodes/NodeComponents/VerticalSlider';
import VisualHelperSettings from '../../OrbitDriverNode/visual-helper-settings';
import CenterPointSettings from '../../OrbitDriverNode/center-point-settings';
import InputComponent from '../../../views/Nodes/NodeComponents/InputComponent';

import './index.scss';

export default class SpaceOrbitNode extends OrbitDriverNode{
	constructor(renderer, backendData) {
		super(renderer, backendData);

		this.currentYInputVal = 0;
	}

	initCurve() {
		const xInitRadius = (this.initValues && this.initValues.orbitX) ? this.initValues.orbitX : 0;
        const yInitRadius = (this.initValues && this.initValues.orbitY) ? this.initValues.orbitY : 0;

		const xRadius = this.getOrbitVal(xInitRadius);
		const yRadius = this.getOrbitVal(yInitRadius);
		
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
			
			const speedSliderGroup = document.createElement('div');
			speedSliderGroup.className = 'orbit-slider-group';

			sliderContainer.appendChild(speedSliderGroup);

			const labelSpeedHTML = `
				<div class="orbit-slider-label-group">
					<h4>Hastighet</h4>
					<h5>Dygn (24h)</h5>
				</div>
			`;

			speedSliderGroup.insertAdjacentHTML('afterbegin', labelSpeedHTML);

			const speedInnerSliderGroup = document.createElement('div');
			speedInnerSliderGroup.className = 'orbit-inner-slider-group';

			speedSliderGroup.appendChild(speedInnerSliderGroup);

			const defaultSettings = {
				value: 0,
				step: 1,
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

			const speedDefaultSettings = {
				value: this.initValues ? this.initValues['speed'] : 60230,
				step: 1,
				min: 1,
				max: 60230,
			};

			const speedInput = new InputComponent(
				speedInnerSliderGroup,
				' ',
				speedDefaultSettings,
				this.onSpeedChangeBound,
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

			settingsContainer.appendChild(sliderContainer);
			settingsContainer.appendChild(bottomContainer);
			settingsContainer.appendChild(this.toggleStartBtn);

			this.settingsContainer = settingsContainer;
		}

		// this.refreshSettings();
		
		return this.settingsContainer;
	}

	updateVisualSettings() {
		this.syncVisualSettings({
			orbitX: this.orbitSliders.Position.x.getValue(),
			orbitY: this.currentYInputVal,
			speed: this.currentSpeed * 1000.0,
			isRunning: this.animateValues.isRunning,
            visualHelperEnabled: this.mesh.visible,
			targetNode: this.targetNode ? this.targetNode.ID : null,
		});

		this.updateMesh();
	}

	getOrbitVal(value) {
		const max = 4503;
		const min = 0;

		const maxScale = 400;

		const val = (value - min) / (max - min);

		console.log('val: ', val * maxScale);

		return val * maxScale;
	}

	onOrbitXChange(val) {
		this.curve.xRadius = this.getOrbitVal(val);
		console.log('x change: ', this.curve.xRadius);
		this.updateVisualSettings();
	}

	onOrbitYChange(val) {
		this.curve.yRadius = this.getOrbitVal(val);
		this.currentYInputVal = val;
		this.updateVisualSettings();
	}

	onOrbitZChange(val) {
		this.curve.yRadius = this.getOrbitVal(val);
		this.currentYInputVal = val;
		this.updateVisualSettings();
	}

	onSpeedChange(val) {
		const max = 60230;
		const min = 0;

		const speed = ((max - value) - min) / (max - min);

		this.currentSpeed = speed * 0.01;
		
		this.updateVisualSettings();
	}
}