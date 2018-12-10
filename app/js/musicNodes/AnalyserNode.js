import Node from '../views/Nodes/Node';



export default class AnalyserNode extends Node{

	

	constructor(parentEl, onConnectingCallback, onInputConnectionCallback, type) {
		super(parentEl, onConnectingCallback, onInputConnectionCallback, type);

		AnalyserNode.SUBBANDS = 64;
		AnalyserNode.HISTORY_SIZE = 43;

		this._processArray = [];

		this._subbands = [];
		
		this.colorTheme = [];

		this._currMaxVal = 20;

		this.subbandWidthTable = [2,2,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,9,9,9,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,11,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12];
		this._currentSubbandTotWidth = 0;

		this.audioNode = window.NS.audioContext.createAnalyser();
		this.scriptNode = window.NS.audioContext.createScriptProcessor(this.audioNode.frequencyBinCount,2,1);
		this.audioNode.fftSize = 2048;
		this.audioNode.maxDecibels = -30;
		this.audioNode.minDecibels = -100;

		this._processArray = new Uint8Array(this.audioNode.frequencyBinCount);
	
	
		for (var i=0; i<AnalyserNode.SUBBANDS;i++){
			var historyArr = [];
			for (var k=0;k<AnalyserNode.HISTORY_SIZE;k++){
				var val = 0;
				historyArr.push(val);
			}

			var obj = {
				current:{
					sum: 0
				},
				history:{
					arr : historyArr,
					sum : 0 
				},
				idx:i
			};
			this._subbands.push(obj);
	
		}

		this._onAudioProcessBound = this._onAudioProcess.bind(this);
		
	}

	setup() {

	}

	getConnectNode() {
		return [this.scriptNode, this.audioNode];
	}

	enableInput(outputAudioNode) {
		super.enableInput();

		this.scriptNode.addEventListener('audioprocess', this._onAudioProcessBound);

		outputAudioNode.connect(this.audioNode);
		outputAudioNode.connect(this.scriptNode);

	}


	disableInput(nodeToDisconnect) {
		super.disableInput();

		this.scriptNode.removeEventListener('audioprocess', this._onAudioProcessBound);

		nodeToDisconnect.disconnect(this.audioNode);
		nodeToDisconnect.disconnect(this.scriptNode);
	}

	getFreqFromFFTIdx(idx) {

		var ret = false;

		if (idx < 512){
			return idx * window.NS.audioContext.sampleRate / this.audioNode.frequencyBinCount;
		}

		return ret;
	};

	_onAudioProcess(e) {

		console.log('sdfsdf');

		this.update();
		
		// this.render();
		this.createAudioData();
	};

	update() {

		// this.node.getFloatFrequencyData(this._processArray);
		this.audioNode.getByteFrequencyData(this._processArray);

		this.calcSubbandEnergy();
		this.calcSubbandHistoryAverage();
		this.shiftHistory();
	
		// console.log(this._processArray);
		
	};

	createAudioData() {

		// var ret = new Float32Array(SpectrumAnalyser.SUBBANDS*3);
		var data = [];

		this.calcSubbandEnergy();
		this.calcSubbandHistoryAverage();
		this.shiftHistory();

		var subbandRangeAverageSum = 0;
		var subbandRangeCurrentSum = 0;


		
		var currentRow = new Float32Array(AnalyserNode.SUBBANDS);
		for (var i=0;i<this._subbands.length;i++){
			
			var currentSum = this._subbands[i].current.sum;
			var averageSum = this._subbands[i].history.sum;

			// ret[i] = {};
			// ret[i].current = currentSum;
			currentRow[i] = currentSum;
			


		}

		data.push(currentRow);

		// var historyRows = [];
		for (var i=0;i<11;i++){
			var historySubband = new Float32Array(AnalyserNode.SUBBANDS);
			for (var x=0;x<this._subbands.length;x++){
				historySubband[x] = this._subbands[x].history.arr[i]
			}
			data.push(historySubband)
			// historyRows[i] = historySubband;
		}

		const subbands = [2, 3, 4, 6, 8, 20, 30, 40, 50, 55, 60];

		const audioData = [];
		
		for (var i=0;i<subbands.length;i++){
			audioData[i] = data[0][subbands[i]] / 1.5;
		}

		console.log(audioData);

		// window.onAudioData(ret);
	};
	
	calcSubbandEnergy() {

		this._currentSubbandTotWidth = 0;

		for (var i=0;i<this._subbands.length;i++){

			var subbandSize = this.subbandWidthTable[i];

			var obj = this._subbands[i].current;
			obj.sum = 0;
			obj.width = subbandSize;

		
			var range = this._currentSubbandTotWidth;
			
			
			for (var k=range;k<range+subbandSize;k++){
				obj.sum += this._processArray[k];
				// console.log(k);
				
			}
			var startFreq = this.getFreqFromFFTIdx(range);
			var endFreq = this.getFreqFromFFTIdx(range+subbandSize);



			obj.sum *= subbandSize/(this.audioNode.fftSize/2);
		
			this._currentSubbandTotWidth += obj.width;

		}
	};

	calcSubbandHistoryAverage() {

		for (var i=0;i<this._subbands.length;i++){

			var subbandHistory = this._subbands[i].history.arr;
			var subbandHistorySum = this._subbands[i].history.sum;
		
			for (var k=0;k<subbandHistory.length-1;k++){
				subbandHistorySum += subbandHistory[k];
				
			}
			subbandHistorySum *= 1/subbandHistory.length;

			this._subbands[i].history.sum = subbandHistorySum;

			

		}

	};


	shiftHistory() {

	
		var subbandTempArr = this._subbands.slice();

		for (var i=0;i<this._subbands.length;i++){
		
			var historyArr = this._subbands[i].history.arr;
			historyArr.unshift(subbandTempArr[i].current.sum);
			if (historyArr.length > AnalyserNode.HISTORY_SIZE)
				historyArr.pop();

			
		}
		

	};
}