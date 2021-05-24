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

const isValidSpaceSizeInput = (outNode, inNode, param) => {
	if (!outNode.isSpaceSize) {
		return false;
	}
	return (outNode.isParam && !param.isConnected);
}

const isValidOrbitPositionParamInput = (outNode, inNode, param) => {
	if (!outNode.isOrbitPosition) {
		return false;
	}
	return (outNode.isParam && !param.isConnected);
} 

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

	if (outNode.isOrbitPosition) {
		return false;
	}

	if (outNode.isSpaceSize) {
		return false;
	}

	return (outNode.isParam && !param.isConnected) || (outNode.isAnalyser && !param.isConnected);
};

const onPositionParamUpdate = (inNode, outNode, param) => {
	inNode.mesh.position[param.param] = outNode.getValue(param);
	// inNode.mesh.rotation.y = 0;
	// console.log('position: ', inNode.mesh.rotation.y);
};

const onPositionDisconnect = (inNode, param, outNode) => {
	inNode.mesh.position[param.param] = param.defaultVal;
};

const onRotationDisconnect = (inNode, param, outNode) => {
	inNode.mainMesh.rotation[param.param] = param.defaultVal;
}

const onRotationParamUpdate = (inNode, outNode, param) => {
	
	const val = outNode.getValue(param);
	inNode.mainMesh.rotation[param.param] = val;
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

/* check if those below work for the particles... have to check which inputs works.. remove some ? */

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
	if (param.param === 'electrons') {
		const meshGroup = outNode.getMeshGroup(inNode);

		inNode.updateMeshType(
			meshGroup, 
			param.param,
			outNode.enableDragging,
			// outNode.controlsAmountAtomRings,
			outNode.addToGroup,
		);
	} else {
		const coreParamNodes = window.NS.singletons.ConnectionsManager.getParamConnections(inNode.ID, 'isCoreParam');
		const amountRequested = coreParamNodes.reduce((acc, curr) => {
			const amountPositions = curr.outNode.getAmountPositions();
			acc.totalAmount += amountPositions;
			acc.amountPerType.push({
				amountPositions,
				...curr
			});
			return acc;
		}, { totalAmount: 0, amountPerType: [] });
		const positionState = inNode.getCorePositions(amountRequested);

		Object.keys(positionState).forEach(paramID => {
			const outNode = window.NS.singletons.ConnectionsManager.getNode(positionState[paramID].outNodeID);
			const meshGroup = outNode.getMeshGroup(positionState[paramID].positions);
			const paramObj = window.NS.singletons.ConnectionsManager.getParam(paramID);

			inNode.updateMeshType(
				meshGroup, 
				paramObj.param.param,
				outNode.enableDragging,
				// outNode.controlsAmountAtomRings,
				outNode.addToGroup,
			);
		})
	}
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
		disconnect: onRotationDisconnect,
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
	orbitPosition: {
		update: onPositionParamUpdate,
		isValid: isValidOrbitPositionParamInput,
		disconnect: onPositionDisconnect,
	},
	spaceSize: {
		update: onScaleParamUpdate,
		isValid: isValidSpaceSizeInput,
		disconnect: onScaleParamDisconnect,
	}
}

export default paramHelpers;