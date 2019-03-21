const doesOscillatorHaveEnvelope = (connections, gainsWithEnvelopeConnections, oscillatorNode) => {

	for (let i = 0; i < gainsWithEnvelopeConnections.length; i++) {
		const gainNode = gainsWithEnvelopeConnections[i].in;

		const getOscillator = (inNode) => {
			const tempConnections = connections.filter(t => t.in.ID === inNode.ID && !t.param);

			const oscillator = tempConnections.find(t => t.out.isOscillator && t.out.ID === oscillatorNode.ID);
			if (oscillator) {
				return true;
			} else if (tempConnections.length > 0) {
				return getOscillator(tempConnections[0].out);
			} else {
				return false;
			}
		}

		const hasOscillator = getOscillator(gainNode);
		if (hasOscillator) {
			return true;
		}
	}

	return false;
 };

 const updateOscillators = (connections) => {

 	const gainsWithEnvelopeConnections = connections.filter(t => t.param && (t.param.param === 'gain' && t.out.isEnvelope));
 	const oscillators = connections.filter(t => t.out.isOscillator && !t.param);
 	for (let i = 0; i < oscillators.length; i++) {
 		const oscillatorHasEnvelope = doesOscillatorHaveEnvelope(connections, gainsWithEnvelopeConnections, oscillators[i].out);
 		oscillators[i].out.hasEnvelopeConnection = oscillatorHasEnvelope;
 	}

 }

 const Helpers = {
 	updateOscillators,
 };

 export default Helpers;