const isValidSingleInput = (outNode, inNode, paramConnection, connections) => {
	let ret = true;

	if (outNode.isParam && !paramConnection || !outNode.isParam && paramConnection) {
		ret = false;
	}

	const hasConnection = connections.some(t => t.in.ID === inNode.ID && !t.param);
	if (hasConnection) {
		ret = false;
	}

	return ret;
};

const isValidMultipleInput = (outNode, inNode, paramConnection, connections) => {
	let ret = true;

	if (outNode.isParam && !paramConnection || !outNode.isParam && paramConnection) {
		ret = false;
	}

	return ret;
};

const isValidOscillatorTriggerInput = (outNode, inNode, paramConnection, connections) => {
	let ret = true;

	const hasConnection = connections.some(t => t.out.ID === outNode.ID && t.in.ID === inNode.ID);
	if (hasConnection) {
		ret = false;
	}

	if (!outNode.isSequencer) {
		ret = false;
	}

	return ret;
}

const isValidGainInput = (outNode, inNode, paramConnection, connections) => {

	let ret = true;

	const hasConnection = connections.some(t => t.in.ID === inNode.ID && t.out.ID === outNode.ID);
	if (hasConnection) {
		ret = false;
	}

	if (!outNode.isEnvelope) {
		ret = false;
	}

	return ret;
}

const isValidFrequencyInput = (outNode, inNode, paramConnection, connections) => {

	let ret = true;

	const hasConnection = connections.some(t => t.in.ID === inNode.ID && t.out.ID === outNode.ID);
	if (hasConnection) {
		ret = false;
	}

	if (!outNode.isEnvelope && !outNode.isLFO) {
		ret = false;
	}

	return ret;
}



const AudioInputHelpers = {
	single: {
		isValid: isValidSingleInput,
	},
	multiple: {
		isValid: isValidMultipleInput,
	},
	oscillatorTrigger: {
		isValid: isValidOscillatorTriggerInput,
	},
	gain: {
		isValid: isValidGainInput,
	},
	frequency: {
		isValid: isValidFrequencyInput,
	}
};

export default AudioInputHelpers;