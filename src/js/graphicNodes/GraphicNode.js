import Node from '../views/Nodes/Node';
import Editor from '../views/Editor';
import NodeParam from '../views/Nodes/NodeComponents/NodeParam';
import NodeParamContainer from '../views/Nodes/NodeComponents/NodeParamContainer';

import { SIMPLE_3D_VERTEX, ACTIVE_MESH_FRAGMENT } from '../../shaders/SHADERS';

import ParamHelpers from './Helpers/ParamHelpers';
import InputHelpers from './Helpers/InputHelpers';

export default class GraphicNode extends Node{
	constructor() {
		super();

		this.params = {};
		this.inputParams = {};
		this.isForegroundNode = false;
		this.isBackgroundNode = false;
		this.needsMinMax = false;
		this.isRendered = false;

		this.currentOutConnections = [];
		this.currentOutConnectionsLength = 0;
		
		this.el = document.createElement('div');
		this.el.className = 'node';

		this.inputHelpersType = InputHelpers.general;

		this.isGraphicsNode = true;
		this.isRenderNode = false;
		this.canConnectToMaterial = false;
		this.isCanvasNode = false;

		this.dotPos = undefined;

		this.onCanvasResizeBound = this.onCanvasResize.bind(this);
		document.documentElement.addEventListener('canvas-resize-event', this.onCanvasResizeBound);
	}

	init(
		pos,
		parentEl,
		onDisconnectCallback,
		onInputConnectionCallback,
		type,
		initData,
		onNodeRemove,
		isModifier,
		onNodeDragStart,
		onNodeDragMove,
		onNodeDragRelease,
		addCallback,
	) {
		super.init(
			pos,
			parentEl,
			onDisconnectCallback,
			onInputConnectionCallback,
			type,
			initData,
			onNodeRemove,
			isModifier,
			onNodeDragStart,
			onNodeDragMove,
			onNodeDragRelease,
			addCallback,
		);
	}

	onCanvasResize(e) {
		const [w, h] = e.detail;
	}

	onConnectionAdd(e) {
		if (e.detail.inNodeID === this.ID) {
			const connection = e.detail.connection;
			const param = window.NS.singletons.ConnectionsManager.params[connection.paramID];
			const outNode = window.NS.singletons.ConnectionsManager.nodes[connection.outNodeID];
			this.enableParam(param, outNode);
		}
	}

	onConnectionRemove(e) {
		if (e.detail.inNodeID === this.ID) {
			const connection = e.detail.connection;
			const param = window.NS.singletons.ConnectionsManager.params[connection.paramID];
			const outNode = window.NS.singletons.ConnectionsManager.nodes[connection.outNodeID];
			this.disableParam(param, outNode);
		}
	}

	enableParam(paramObj, outNode) {
		paramObj.enable();

		ParamHelpers[paramObj.param.paramHelpersType].update(this, outNode, paramObj.param);
	}

	updateParam(paramObj, outNode) {
		ParamHelpers[paramObj.param.paramHelpersType].update(this, outNode, paramObj.param);
	}

	disableParam(paramObj, outNode) {
		paramObj.disable();

		ParamHelpers[paramObj.param.paramHelpersType].disconnect(this, paramObj.param, outNode);
	}

	getActiveHelperMesh() {
		const planeGeometry = new THREE.PlaneBufferGeometry( 5, 5, 1, 1 );
		const planeMaterial = new THREE.ShaderMaterial({
            uniforms: {},
            vertexShader: SIMPLE_3D_VERTEX,
            fragmentShader: ACTIVE_MESH_FRAGMENT,
        });

		planeMaterial.transparent = true;
		
		const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
		planeMesh.position.y = 0;
		planeMesh.scale.set(1.4, 1.4, 1);
		planeMesh.visible = false;

		return planeMesh;
	}

	onResize() {
	}
}