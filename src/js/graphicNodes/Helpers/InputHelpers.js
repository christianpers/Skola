const isValidNeedsFramebufferInput = (outNode) => {
	return outNode.framebuffer || outNode.isForegroundNode;
};

const isValidSceneNodeConnection = (outNode, inNode, inputType, outType) => {
	const isValidBackgroundInput = () => {
		return outNode.isBackgroundNode;
	};

	const isValidForegroundInput = () => {
		if (outType) {
			if (outNode.outputs[outType]) {
				return outNode.isForegroundNode && !outNode.outputs[outType].isParamOutput;
			}
		}
		return outNode.isForegroundNode;
	};

	const isValidLightInput = () => {
		return outNode.isLightNode && !inNode.foregroundRender.hasConnectedLight;
	};


	const hasOutputConnection = inNode.enabledInputs.some(t => t.out.ID === outNode.ID);

	if (hasOutputConnection || !inputType) {
		return false;
	}

	
	const inputTypeValidations = {
		'background': isValidBackgroundInput,
		'foreground': isValidForegroundInput,
		'light': isValidLightInput,
	};

	return inputTypeValidations[inputType]();

};

const isValidGeneralInput = (outNode) => {
	return true;
};

const inputHelpers = {
	general: {
		isValid: isValidGeneralInput,
	},
	needsFramebuffer: {
		isValid: isValidNeedsFramebufferInput,
	},
	sceneNode: {
		isValid: isValidSceneNodeConnection,
	}
};

export default inputHelpers;