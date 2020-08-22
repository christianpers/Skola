const isValidParamTextureInput = (outNode) => {

	return outNode.framebuffer || outNode.texture;
};

const onTextureParamUpdate = (inNode, outNode) => {

	inNode.material.needsUpdate = true;
	inNode.material.map = outNode.framebuffer ? outNode.framebuffer.texture : outNode.texture;
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
	return !!outNode.picker;
};

const onColorParamUpdate = (inNode, outNode) => {

	inNode.material.color = outNode.currentColor;
};

const isValidParamPositionInput = (outNode, inNode, param) => {

	if  (outNode.framebuffer || outNode.texture || outNode.picker || outNode.isSequencer) {
		return false;
	}

	if (outNode.isShapeNode) {
		return false;
	}

	if (!param) {
		return false;
	}

	if (!param.minMax) {
		return false;
	}

	return (outNode.isParam && !param.isConnected) || (outNode.isAnalyser && !param.isConnected);
};

const onPositionParamUpdate = (inNode, outNode, param) => {
	inNode.mesh.position[param.param] = outNode.getValue(param);
};

const onPositionDisconnect = (inNode, param, outNode) => {
	inNode.mesh.position[param.param] = param.defaultVal;
};


const onRotationParamUpdate = (inNode, outNode, param) => {
	inNode.mainMesh.rotation[param.param] = outNode.getValue(param);
};

const onScaleParamUpdate = (inNode, outNode, param) => {
	const val = outNode.getValue();
	inNode.mesh.scale.set(val, val, val);
};

const onScaleParamDisconnect = (inNode, param, outNode) => {

	// if (outNode.isAnalyser) {
	inNode.mesh.scale.set(1, 1, 1);
	// } else {
	// 	param.defaultVal = outNode.getValue(param);
	// }
	
};

const onLightParamUpdate = (inNode, outNode, param) => {

	const val = outNode.getValue(param);

	inNode.mesh.position[param.param] = val;
	inNode.light.position[param.param] = val;
};


const onShaderParamUpdate = (inNode, outNode, param) => {
	inNode.mesh.material.uniforms[param.param].value = outNode.getValue();
};

const onTargetParamUpdate = (inNode, outNode) => {
	inNode.targetPosition = outNode.mesh.position;
};

const isValidTarget = (outNode) => {
	return !!outNode.mesh;
};

const onTargetParamDisconnect = (inNode, param, outNode) => {
	param.defaultVal = outNode.mesh.position;
};

const onParticleParamUpdate = () => {};

const isValidParticleFormInput = (outNode) => {
	return outNode.isShapeNode;
};

const onParticleSizeParamUpdate = (inNode, outNode) => {
	inNode.currentParticleSize = outNode.getValue();
};

const onParticleSizeParamDisconnect = (inNode, param) => {
	inNode.currentParticleSize = param.defaultVal;
};

const onParticleColorParamUpdate = (inNode, outNode) => {
	inNode.currentParticleColor = outNode.currentColor.toArray();
};

const onParticleColorParamDisconnect = (inNode, param) => {
	inNode.currentParticleColor = param.defaultVal.toArray();
};

const isValidParamSingleNumberInput = (outNode, inNode, param) => {

	if (!param) {
		return false;
	}

	if (!param.minMax) {
		return false;
	}

	return (outNode.returnsSingleNumber && !param.isConnected) || (outNode.isAnalyser && !param.isConnected);
};

const onAtomParamUpdate = (inNode, outNode, param) => {
	const meshGroup = outNode.getMeshGroup(inNode);
	inNode.updateMeshType(
		meshGroup, 
		param.param,
		outNode.enableDragging,
		outNode.controlsAmountAtomRings,
		outNode.addToGroup,
	);
};

const isValidAtomParamInput = (outNode, inNode, param) => {
	if (!param) {
		return false;
	}
	if (!(outNode.isParam && !param.isConnected)) {
		return false;
	}

	if (outNode.type.toLowerCase() === param.param) {
		return true;
	}
};

const onAtomParamDisconnect = (inNode, param) => {

};

const paramHelpers = {
	particleColor: {
		update: onParticleColorParamUpdate,
		isValid: isValidParamColorInput,
		disconnect: onParticleColorParamDisconnect,
	},
	particleSize: {
		update: onParticleSizeParamUpdate,
		isValid: isValidParamSingleNumberInput,
		disconnect: onParticleSizeParamDisconnect,
	},
	particleForm: {
		update: onParticleParamUpdate,
		isValid: isValidParticleFormInput,
		disconnect: onParticleParamUpdate,
	},
	particle: {
		update: onParticleParamUpdate,
		isValid: isValidParamPositionInput,
		disconnect: onParticleParamUpdate,
	},
	target: {
		update: onTargetParamUpdate,
		isValid: isValidTarget,
		disconnect: onTargetParamDisconnect,
	},
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
		disconnect: onScaleParamDisconnect,
	},
	shaderParam: {
		update: onShaderParamUpdate,
		isValid: isValidParamPositionInput,
		disconnect: onPositionDisconnect,
	},
	light: {
		update: onLightParamUpdate,
		isValid: isValidParamPositionInput,
		disconnect: onPositionDisconnect,
	},
	atom: {
		update: onAtomParamUpdate,
		isValid: isValidAtomParamInput,
		disconnect: onAtomParamDisconnect,
	},
}

export default paramHelpers;