import SynthCopy from '../musicHelpers/SynthCopy';

export default class KeyboardManager{
	constructor() {

		KeyboardManager.KEY_INTS = [65,83,68,70,71,72,73,79];

		this.keys = [];

		for (var i=0;i<KeyboardManager.KEY_INTS.length;i++){
			const key = KeyboardManager.KEY_INTS[i];
			var obj = {keyNr: key, step: i, triggered: false, synth: new SynthCopy(i)};
			
			this.keys.push(obj);
		}

		window.addEventListener('keydown', (e) => {
			
			const keyCode = e.keyCode;
			const keyObj = this.getKey(keyCode);
			if (keyObj !== null){

				e.preventDefault();
				if (keyObj.triggered) return;
				
				keyObj.triggered = true;
				keyObj.synth.keyDown();
			}
		});

		window.addEventListener('keyup', (e) => {			

			e.preventDefault();

			const keyCode = e.keyCode;
			const keyObj = this.getKey(keyCode);
			if (keyObj !== null){
				if (!keyObj.triggered) return;
			
				keyObj.triggered = false;
				keyObj.synth.keyUp();	
			};
		});
	}

	onAudioNodeConnectionUpdate(connections) {
		for (let i = 0; i < this.keys.length; i++) {
			this.keys[i].synth.updateConnections(connections);
		}
	}

	onAudioNodeParamChange(nodeID, params) {

		for (let i = 0; i < this.keys.length; i++) {
			this.keys[i].synth.onParamChange(nodeID, params);
		}
	}

	getKey(key) {

		let ret = null;
		for (let i=0; i<this.keys.length;i++) {
			if (this.keys[i].keyNr === key){
				ret = this.keys[i];
				continue;
			}
		}

		return ret;

	}
}