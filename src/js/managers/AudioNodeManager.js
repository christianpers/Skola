import OscillatorNode from '../musicNodes/OscillatorNode';
import GainNode from '../musicNodes/GainNode';
import SpeakerNode from '../musicNodes/SpeakerNode';
import AnalyserNode from '../musicNodes/AnalyserNode';
import LowpassFilterNode from '../musicNodes/LowpassFilterNode';
import EnvelopeNode from '../musicNodes/EnvelopeNode';

export default class AudioNodeManager{
	constructor(
		parentEl,
		onConnectingCallback,
		onInputConnectionCallback,
		addCallback,
		initData,
		onParameterChange,
		onNodeRemove,
	) {

		this.parentEl = parentEl;
		this.onConnectingCallback = onConnectingCallback;
		this.onInputConnectionCallback = onInputConnectionCallback;
		this.addCallback = addCallback;
		this.initData = initData;
		this.onParameterChange = onParameterChange;
		this.onNodeRemove = onNodeRemove;
	}

	init() {
		if (this.initData) {
			for (let i = 0; i < this.initData.length; i++) {
				this.initData[i].node.init(
					this.parentEl,
					this.onConnectingCallback,
					this.onInputConnectionCallback,
					this.initData[i].type,
					this.initData[i],
					this.onParameterChange,
					this.onNodeRemove,
				);
				this.addCallback(this.initData[i].node);
			}
		}
	}

	createNode(data, pos) {
		const node = new data.obj();
		node.init(
			pos,
			this.parentEl,
			this.onConnectingCallback,
			this.onInputConnectionCallback,
			data.type,
			undefined,
			this.onParameterChange,
			this.onNodeRemove,
		);
		this.addCallback(node);
	}

}