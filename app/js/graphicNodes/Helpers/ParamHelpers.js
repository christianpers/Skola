const isValidParamTextureInput = (outNode) => {

	return outNode.framebuffer || outNode.texture;
};

const onTextureParamUpdate = (inNode, outNode) => {

	inNode.material.needsUpdate = true;
	inNode.material.map = outNode.framebuffer.texture;
};

const onTextureDisconnect = (inNode) => {

	inNode.material.needsUpdate = true;
	inNode.material.map = null;
};

const onNormalmapParamUpdate = (inNode, outNode) => {
	
	inNode.material.normalMap = outNode.framebuffer.texture;
	// inNode.material.displacementScale = .1;
	inNode.mesh.needsUpdate = true;
	inNode.material.needsUpdate = true;
};

const onNormalmapDisconnect = (inNode) => {

	inNode.material.normalMap = null;
	inNode.mesh.needsUpdate = true;
	inNode.material.needsUpdate = true;
};

const onBumpmapParamUpdate = (inNode, outNode) => {
	
	inNode.material.displacementMap = outNode.framebuffer.texture;
	inNode.material.displacementScale = .1;
	inNode.mesh.needsUpdate = true;
	inNode.material.needsUpdate = true;
};

const onBumpmapDisconnect = (inNode) => {

	inNode.material.displacementMap = null;
	inNode.mesh.needsUpdate = true;
	inNode.material.needsUpdate = true;
};

const isValidParamColorInput = (outNode) => {

	return outNode.picker;
};

const onColorParamUpdate = (inNode, outNode) => {

	inNode.material.color = outNode.currentColor;
};

const isValidParamPositionInput = (outNode, param) => {

	return (outNode.isParam && !param.isConnected) || (outNode.isAnalyser && !param.isConnected);
};

const onPositionParamUpdate = (inNode, outNode, param) => {

	inNode.mesh.position[param.param] = outNode.getValue(param.param);
};

const onPositionDisconnect = (inNode, param, outNode) => {

	param.defaultVal = outNode.getValue(param.param);
};


const onRotationParamUpdate = (inNode, outNode, param) => {

	inNode.mesh.rotation[param.param] = outNode.getValue();
};

const onScaleParamUpdate = (inNode, outNode, param) => {

	const val = outNode.getValue();
	const vector = new THREE.Vector3(val, val, val);
	inNode.mesh.scale.set(val, val, val);
};


const onShaderParamUpdate = (inNode, outNode, param) => {


	inNode.mesh.material.uniforms[param.param].value = outNode.getValue();
};


const paramHelpers = {
	texture: {
		update: onTextureParamUpdate,
		isValid: isValidParamTextureInput,
		disconnect: onTextureDisconnect,
	},
	normalMap: {
		update: onNormalmapParamUpdate,
		isValid: isValidParamTextureInput,
		disconnect: onNormalmapDisconnect,
	},
	bumpMap: {
		update: onBumpmapParamUpdate,
		isValid: isValidParamTextureInput,
		disconnect: onBumpmapDisconnect,
	},
	color: {
		update: onColorParamUpdate,
		isValid: isValidParamColorInput,
		disconnect: onPositionDisconnect,
	},
	position: {
		update: onPositionParamUpdate,
		isValid: isValidParamPositionInput,
		disconnect: onPositionDisconnect,
	},
	rotation: {
		update: onRotationParamUpdate,
		isValid: isValidParamPositionInput,
		disconnect: onPositionDisconnect,
	},
	scale: {
		update: onScaleParamUpdate,
		isValid: isValidParamPositionInput,
		disconnect: onPositionDisconnect,
	},
	shaderParam: {
		update: onShaderParamUpdate,
		isValid: isValidParamPositionInput,
		disconnect: onPositionDisconnect,
	}
}

export default paramHelpers;