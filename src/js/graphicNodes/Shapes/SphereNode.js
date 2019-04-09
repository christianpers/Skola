import GraphicNode from '../GraphicNode';

import NodeOutput from '../../views/Nodes/NodeComponents/NodeOutput';

export default class SphereNode extends GraphicNode{
	constructor() {
		super();

		this.isForegroundNode = true;
		this.hasMultipleOutputs = true;

		this.el.classList.add('no-height');
		this.el.classList.add('no-input-multiple-outputs');
		
		const w = window.innerWidth;
		const h = window.innerHeight;

		this.geometry = new THREE.SphereGeometry(2, 32, 32);
		this.material = new THREE.MeshPhongMaterial( {  } );
		this.mesh = new THREE.Mesh(this.geometry, this.material);

		const textureParam = {
			title: 'Texture',
			param: 'map',
			useAsInput: true,
			parent: 'Material',
			paramHelpersType: 'texture',
			needsFrameUpdate: false,
		};

		const colorParam = {
			title: 'Color',
			param: 'color',
			useAsInput: true,
			defaultVal: new THREE.Color(1,1,1),
			parent: 'Material',
			paramHelpersType: 'color',
			needsFrameUpdate: false,
		};

		const bumpMapParam = {
			title: 'Displacement',
			// param: 'displacementMap',
			param: 'normalMap',
			useAsInput: true,
			parent: 'Material',
			paramHelpersType: 'normalMap',
			needsFrameUpdate: false,
		};

		const positionXParam = {
			title: 'Position X',
			param: 'x',
			useAsInput: true,
			parent: 'Position',
			paramHelpersType: 'position',
			needsFrameUpdate: false,
			minMax: {min: -2, max: 2},
			defaultVal: 0,
		};

		const positionYParam = {
			title: 'Position Y',
			param: 'y',
			useAsInput: true,
			parent: 'Position',
			paramHelpersType: 'position',
			needsFrameUpdate: false,
			minMax: {min: -2, max: 2},
			defaultVal: 0,
		};

		const positionZParam = {
			title: 'Position Z',
			param: 'z',
			useAsInput: true,
			parent: 'Position',
			paramHelpersType: 'position',
			needsFrameUpdate: false,
			minMax: {min: -2, max: 2},
			defaultVal: 0,
		};

		const rotationXParam = {
			title: 'Rotation x',
			param: 'x',
			useAsInput: true,
			parent: 'Rotation',
			paramHelpersType: 'rotation',
			needsFrameUpdate: false,
			minMax: {min: -6, max: 6},
			defaultVal: 0,
		};

		const rotationYParam = {
			title: 'Rotation y',
			param: 'y',
			useAsInput: true,
			parent: 'Rotation',
			paramHelpersType: 'rotation',
			needsFrameUpdate: false,
			minMax: {min: -6, max: 6},
			defaultVal: 0,
		};

		const scaleParam = {
			title: 'Scale',
			param: 'scale',
			useAsInput: true,
			parent: 'Scale',
			paramHelpersType: 'scale',
			needsFrameUpdate: false,
			minMax: {min: .1, max: 6},
			defaultVal: 1,
		};

		this.params = {
			textureParam,
			colorParam,
			bumpMapParam,
			positionXParam,
			positionYParam,
			positionZParam,
			rotationXParam,
			rotationYParam,
			scaleParam,
		};

		this.paramVals = {};
	}

	init(
		pos,
		parentEl,
		onConnectingCallback,
		onInputConnectionCallback,
		type,
		initData,
		onNodeActive,
		onNodeRemove,
	) {
		super.init(
			pos,
			parentEl,
			onConnectingCallback,
			onInputConnectionCallback,
			type,
			initData,
			onNodeActive,
			onNodeRemove,
		);

		this.onOutputClickGraphicsBound = this.onOutputClickGraphics.bind(this);
		this.onOutputClickTargetBound = this.onOutputClickTarget.bind(this);

		const outputContainer = document.createElement('div');
		outputContainer.className = 'multiple-outputs';

		this.bottomPartEl.appendChild(outputContainer);

		this.outputGraphics = new NodeOutput(outputContainer, this.onOutputClickGraphicsBound, false, false, false, true);
		this.outputTarget = new NodeOutput(outputContainer, this.onOutputClickTargetBound, true, false, false, true);

		this.outputDataConnection = null;

		this.outputs = {
			'sphere-graphics': this.outputGraphics,
			'sphere-target': this.outputTarget,
		};

		this.inDotPos = {
			'sphere-graphics': null,
			'sphere-target': null,
		};

		this.enabledOutputs = [];
	}

	onOutputClickGraphics(pos) {

		this.onConnectingCallback(this, pos, 'sphere-graphics');
	}

	onOutputClickTarget(pos) {

		this.onConnectingCallback(this, pos, 'sphere-target');
	}

	getOutputPos(type) {
		const obj = {
			x: this.outputs[type].el.offsetLeft,
			y: this.outputs[type].el.offsetTop,
		};

		return obj;
	}

	getOutDotPos(el, outputType) {
		if (!this.inDotPos[outputType]) {
			this.inDotPos[outputType] = this.outputs[outputType].el.getBoundingClientRect();
		}

		return this.inDotPos[outputType];
	}

	getOutputEl(outputType) {
		return this.outputs[outputType];
	}

	enableOutput(param, connectionData) {
		const type = connectionData.outputType;

		this.outputs[type].enable();

		this.enabledOutputs.push(type);

	}

	disableOutput(inNode, param, outputType) {
		this.outputs[outputType].disable();

		this.enabledOutputs = this.enabledOutputs.filter(t => t !== outputType);

	}

	getMesh() {
		return this.mesh;
	}

}