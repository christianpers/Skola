// Import CodeMirror
import CodeMirror from 'codemirror';
import { autorun, observable, action, makeObservable, toJS } from 'mobx';

import 'codemirror/lib/codemirror.css';
// Import CodeMirror addons and modules
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/wrap/hardwrap';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/display/rulers';
import 'codemirror/addon/display/panel';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/theme/oceanic-next.css';
import 'codemirror/mode/javascript/javascript';

import { mathTypes, getTypes } from '../managers/NodeLibrary/NodeTypes';

const REGEX_TYPE = Object.freeze({
	DECLARATION: 'declaration',
	CONNECT: 'connect',
	ASSIGN_VALUE: 'assign_value'
});

const handleDeclaration = (state, { key, type }, lineIndex) => {
	state.set(key, { type, connectedTo: [], lineIndex });

	return true;
};

const handleConnect = (state, { key, connecter }, lineIndex) => {
	/* TODO
		Check if connecter is modifier node
	 */
	const keyState = state.get(key);
	const connecterState = state.get(connecter);
	// console.log('state for key: ', keyState, ' origin: ', key, ' connecter: ', connecter);
	if (!keyState || !connecterState || (key === connecter)) {
		return false;
	}
	const connectionArr = [...keyState.connectedTo, connecter];
	state.set(key, Object.assign({}, keyState, { connectedTo: connectionArr, lineIndex }));

	return true;
}

const handleAssignValue = (state, { key, property, value }, lineIndex) => {
	/*
	 TODO
	 Check if property should be number/string or enum  should be able to get it from param in node
	 Also check if property even exist on node type (maybe should be a visual dropdown in code editor with possible props)
	*/
	const keyState = state.get(key);
	if (!keyState) {
		return false;
	}
	const assignMap = keyState.assignMap || new Map();
	assignMap.set(property, value);
	state.set(key, Object.assign({}, keyState, { assignMap, lineIndex }));

	return true;
}

const regexHandleMapper = {
	[REGEX_TYPE.DECLARATION]: handleDeclaration,
	[REGEX_TYPE.CONNECT]: handleConnect,
	[REGEX_TYPE.ASSIGN_VALUE]: handleAssignValue
};

/* WHEN ADDING NODE WITH HINT IT GETS ADDED TWICE.. FIX !! */

// const variableDeclarationRegex = /var (\w+) ?= ?new (\w+\(\))/;
const variableDeclarationRegex = /var (\w+) ?= ?new (\w+)/;
const connectRegex = /(\w+).connectTo\((\w+)\)/;
const assignValueRegex = /(\w+).(\w+)\s?=\s?([^\s].*)/;

//TRIGGER HINT REGEX
const blockTypeRegex = /var (\w+) ?= ?new\s$/;

const checkDeclarationMatch = (line) => {
	const declarationMatch = variableDeclarationRegex.exec(line);
	if (declarationMatch) {
		const type = declarationMatch[2];
		return { key: declarationMatch[1], type: type.substring(0, type.length), regexType: REGEX_TYPE.DECLARATION };
	}

	return undefined;
}

const checkConnectMatch = (line) => {
	const connectMatch = connectRegex.exec(line);
	if (connectMatch) {
		const origin = connectMatch[2];
		const connecter = connectMatch[1];

		return { key: origin, connecter, regexType: REGEX_TYPE.CONNECT };
	}

	return undefined;
}

const checkAssignValueMatch = (line) => {
	const match = assignValueRegex.exec(line);
	if (match) {
		return { key: match[1], property: match[2], value: match[3], regexType: REGEX_TYPE.ASSIGN_VALUE };
	}

	return undefined;
}


const tempBlockTypes = [
	'MathCube',
	'Planet',
	'wooi'
];

class AutoFillState {
	constructor() {
		this.visible = false;
		this.lineNumber = -1;
		this.currentStr = '';
		this.charPos = 0;

		this.constructorList = [];
	}

	setVisible(visible) {
		this.visible = visible;
	}

	setLinenumber(lineNumber) {
		this.lineNumber = lineNumber;
	}

	setCurrentStr(str) {
		this.currentStr = str;
	}

	setCharPos(pos) {
		this.charPos = pos;
	}
}

const getHintResults = (str = '', types) => {
	const results = types.filter(t => {
		return t.text.includes(str);
	});

	return str === '' ? types : results;
};


export default class Editor{
	constructor(parentEl, code) {

		this._autoFillState = new AutoFillState();
		this._currentState = new Map();

		this._nodeStateManager = window.NS.singletons.NodeStateManager;
		this._connectionsManager = window.NS.singletons.ConnectionsManager;

		this._handleVariableMappedNodesChange = this._handleVariableMappedNodesChange.bind(this);

		const types = getTypes(mathTypes)
		// console.log('mathtypes: ', types);
		this._autoFillState.constructorList = types.options.map(t => ({ text: t.type, isModifier: t.isModifier }));

		console.log(this._autoFillState.constructorList);

		autorun(() => this._handleVariableMappedNodesChange());

		this.editorInstance = CodeMirror(parentEl, {
	        lineNumbers: true,
			gutters: ["CodeMirror-linenumbers"],
	        // // matchBrackets: true,
	        styleActiveLine: true,
			// tabindex: 1,
			// lineWrapping: true,
	        mode: 'javascript',
	        theme: 'oceanic-next',
			extraKeys: {
				// "Ctrl-Space": (cm) => {
				// 	// console.log('s,dkfmslkdfmsd');
				// 	CodeMirror.showHint(cm, () => {
				// 		return {list: ['sdfsdf', 'sdfsdffffff']}
				// 	});
				// }
			}
	    });

		this.editorInstance.on('startCompletion', () => {
			this._autoFillState.setVisible(true);
		});
		this.editorInstance.on('endCompletion', () => {
			console.log('closed hint');
			this._autoFillState.setVisible(false);
		});

		const hasDiff = (state, compareState) => {
			let ret = false;
			state.forEach((value, key) => {
				if (compareState.has(key)) {
					const currentStateValue = compareState.get(key);
					// console.log('orig: ', value, ' compare: ', currentStateValue);
					ret = Object.keys(value).some(valueKey => {
						// console.log('key: ', valueKey, ' -- orig: ', currentStateValue[valueKey], ' compare: ', value[valueKey], ' result: ', JSON.stringify(currentStateValue[valueKey]) !== JSON.stringify(value[valueKey]));
						if (currentStateValue[valueKey] instanceof Array) {
							return JSON.stringify(currentStateValue[valueKey]) !== JSON.stringify(value[valueKey]);
						}
						return currentStateValue[valueKey] !== value[valueKey];
					});
				} else {
					ret = true;
				}
			});

			return ret;
		}

		// convert state to other key (attrKey)
		const convertStateToKey = (state, attrKey) => {
			const map = new Map();
			state.forEach((value, key) => {
				const newKey = value[attrKey];
				map.set(newKey, Object.assign({}, value, { varName: key }));
			});
			return map;
		}

		const getLineDiff = (lineValue, currLineValue) => {
			return Object.keys(lineValue).reduce((acc, valueKey) => {
				if (!(lineValue[valueKey] instanceof Array)) {
					if (currLineValue[valueKey] !== lineValue[valueKey]) {
						acc[valueKey] = {
							old: currLineValue[valueKey],
							new: lineValue[valueKey]
						};
					}
				}
				
				return acc;
			}, {});
		}

		const getLineDiffs = (lineState, currLineState) => {
			const diffs = {};
			lineState.forEach((value, key) => {
				const currValue = currLineState.get(key);
				diffs[key] = getLineDiff(value, currValue);
			});

			return Object.keys(diffs).reduce((acc, curr) => {
				if (Object.keys(diffs[curr]).length > 0) {
					acc[curr] = diffs[curr];
				}
				return acc;
			}, {});
		}

		

		const handleVarNameChange = (lineIndex, diff) => {
			/* Do what needs to be done variable change... call setVariableName on Node somehow ?? */
			console.log('handle var name change: ', lineIndex, ' diff: ', diff);
		}

		const diffHandles = {
			['varName']: handleVarNameChange
		}

		CodeMirror.on(this.editorInstance, 'change', (instance, { from, to, text, removed, origin }) => {
			const lineCount = instance.lineCount();
			const lines = Array.from(Array(lineCount)).map((index, i) => {
				return instance.getLine(i);
			});
			const state = this.analyse(lines, instance.doc);
			const lineHasState = Array.from(state.values()).some(t => t.lineIndex === from.line);
			if (from.line === to.line && from.ch === to.ch && !lineHasState) {
				this.checkForAutofill(lines, from, to);
			}
			
			// diff check  new vs old state
			console.log('state: ', state, ' oldstate: ', this._currentState);
			if (state.size === this._currentState.size) {
				const lineIndexState = convertStateToKey(state, 'lineIndex');
				const lineIndexCurrState = convertStateToKey(this._currentState, 'lineIndex');
				const diffs = getLineDiffs(lineIndexState, lineIndexCurrState);
				Object.keys(diffs).forEach(lineIndexKey => {
					const diff = diffs[lineIndexKey];
					Object.keys(diff).forEach(attrName => {
						if (diffHandles[attrName]) {
							diffHandles[attrName](lineIndexKey, diff[attrName])
						}
					});
				});
				console.log('line index key state: ', lineIndexState, ' curr: ', lineIndexCurrState, ' diffs: ', diffs);
			} else {
				const hasStateDiff = hasDiff(state, this._currentState);
				const hasOldStateDiff = hasDiff(this._currentState, state);

				if (hasStateDiff || hasOldStateDiff) {
					console.log('found diff cause different size');
					this._nodeStateManager.syncEditor(state);
				}
			}
			
			

			// console.log('has state diff: ', hasStateDiff, ' has old state diff: ', hasOldStateDiff);
			// console.log('found diff: ', foundDiff);
			this._currentState = new Map(state);
			
			// this._nodeStateManager.syncEditor(state);
		});

		setTimeout(() => {
			this.editorInstance.refresh();
		}, 500);
		
	}

	// triggered from autorun
	_handleVariableMappedNodesChange() {
		const variableMappedNodes = this._nodeStateManager.variableMappedNodesKeys;

		const constructorCodes = variableMappedNodes.map(key => {
			const item = this._nodeStateManager.$variableMappedNodes.get(key);
			return item.constructorCode;
		});

		const constructorsStrValue = constructorCodes.join('\r\n');
		if (this.editorInstance) {
			this.editorInstance.setValue(constructorsStrValue);
		}
	}

	checkForAutofill(lines, from, to) {
		// console.log('current line: ', lines, ' from: ', from, ' to: ', to);
		const currentLine = lines[from.line];
		const blockTypeMatch = blockTypeRegex.exec(currentLine);
		if (this._autoFillState.visible) {
			const fromChar = this._autoFillState.charPos;
			this._autoFillState.currentStr = currentLine.substring(fromChar + 1, from.ch + 1);
		}
		if (blockTypeMatch && !this._autoFillState.visible) {
			// console.log('!!! block type match !!!');
		
			this._autoFillState.setLinenumber(from.line);
			this._autoFillState.currentStr = '';
			this._autoFillState.setCharPos(from.ch);
			
			this.showBlockTypeMenu();
			
		}
	}

	showBlockTypeMenu() {
		const instance = this.editorInstance;
		const options = {
			hint: (cm) => {
				const currentStr = this._autoFillState.currentStr;
				const results = getHintResults(currentStr, this._autoFillState.constructorList);

				// console.log('!! HINT FN !!! current str', currentStr, ' results: ', results);
				
				const fromCursor = instance.getDoc().getCursor();
				const hintPos = CodeMirror.Pos(fromCursor.line, fromCursor.ch - currentStr.length);
				const ret = {
					from: hintPos,
					to: hintPos,
					list: results
				};

				CodeMirror.on(ret, 'pick', (completion) => {
					console.log('completion: ', completion);
					const completionStr = completion.text;
					const doc = instance.getDoc();
					const from = { line: this._autoFillState.lineNumber, ch: hintPos.ch };
					const to = { line: this._autoFillState.lineNumber, ch: hintPos.ch + completionStr.length + currentStr.length };
					doc.replaceRange(completionStr, from, to);
				});

				return ret;
			}
		};
		instance.showHint(options);
	}

	analyse(lines, doc) {
		const state = new Map();

		const matches = lines.map((t, i) => {
			const declarationMatch = checkDeclarationMatch(t);
			if (declarationMatch) {
				return { match: declarationMatch, index: i };
			}

			const connectMatch = checkConnectMatch(t);
			if (connectMatch) {
				return { match: connectMatch, index: i };
			}

			const assignMatch = checkAssignValueMatch(t);
			if (assignMatch) {
				return { match: assignMatch, index: i };
			}

			return { index: i };
		});

		matches.forEach(t => {
			const { match, index } = t;
			this.removeError(index);
			this.removeOK(index);
			if (match) {
				if (regexHandleMapper[match.regexType](state, match, index)) {
					this.markOK(index);
				} else {
					this.markError(index);
				}
			} else {
				this.markError(index);
			}
		});


		return state;
	}

	

	hasError() {
		return this.lineErrors.length > 0;
	}

	markError(lineNumber) {
		this.editorInstance.addLineClass(lineNumber, 'gutter', 'red');
		// this._state.linesWithErrors.push(lineNumber);
	}

	removeError(lineNumber) {
		this.editorInstance.removeLineClass(lineNumber, 'gutter', 'red');
	}

	markOK(lineNumber) {
		this.editorInstance.addLineClass(lineNumber, 'gutter', 'green');
		// this._state.linesWithErrors = this._state.linesWithErrors.filter(t => t !== lineNumber);
	}

	removeOK(lineNumber) {
		this.editorInstance.removeLineClass(lineNumber, 'gutter', 'green');
	}

	// removeAllErrors() {

	// 	const length = this.lineErrors.length;
	// 	for (let i = 0; i < length; i++) {
	// 		this.removeError(parseInt(this.lineErrors[i]));
	// 	}

	// 	this.lineErrors = [];
	// }

}