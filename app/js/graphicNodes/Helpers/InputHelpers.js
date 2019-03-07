const isValidNeedsFramebufferInput = (outNode) => {
	return outNode.framebuffer || outNode.isForegroundNode;
};

const isValidSceneNodeConnection = (outNode, inNode) => {
	const hasOutputConnection = inNode.enabledInputs.some(t => t.out.ID === outNode.ID);

	return isValidNeedsFramebufferInput(outNode) && !hasOutputConnection;

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