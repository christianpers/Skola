// Import CodeMirror
import CodeMirror from 'codemirror';

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
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/display/rulers';
import 'codemirror/addon/display/panel';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/theme/oceanic-next.css';
import 'codemirror/mode/javascript/javascript';

const REGEX_TYPE = Object.freeze({
	DECLARATION: 'declaration',
	CONNECT: 'connect',
	ASSIGN_VALUE: 'assign_value'
});

const handleDeclaration = (state, { key, type }) => {
	state.set(key, { type, connectedTo: [] });

	return true;
};

const handleConnect = (state, { key, connecter }) => {
	/* TODO
		Check if connecter is modifier node
	 */
	const keyState = state.get(key);
	const connecterState = state.get(connecter);
	console.log('state for key: ', keyState, ' origin: ', key, ' connecter: ', connecter);
	if (!keyState || !connecterState || (key === connecter)) {
		return false;
	}
	const connectionArr = [...keyState.connectedTo, connecter];
	state.set(key, Object.assign({}, keyState, { connectedTo: connectionArr }));

	return true;
}

const handleAssignValue = (state, { key, property, value }) => {
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
	state.set(key, Object.assign({}, keyState, { assignMap }));

	return true;
}

const regexHandleMapper = {
	[REGEX_TYPE.DECLARATION]: handleDeclaration,
	[REGEX_TYPE.CONNECT]: handleConnect,
	[REGEX_TYPE.ASSIGN_VALUE]: handleAssignValue
};

const variableDeclarationRegex = /var (\w+) ?= ?new (\w+\(\))/;
const connectRegex = /(\w+).connectTo\((\w+)\)/;
const assignValueRegex = /(\w+).(\w+)\s?=\s?([^\s].*)/;

const checkDeclarationMatch = (line) => {
	const declarationMatch = variableDeclarationRegex.exec(line);
	if (declarationMatch) {
		return { key: declarationMatch[1], type: declarationMatch[2], regexType: REGEX_TYPE.DECLARATION };
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


export default class Editor{
	constructor(parentEl, code) {

		this._state = new Map();

		this._onNodeAddedFromConnectionsManager = this._onNodeAddedFromConnectionsManager.bind(this);

		document.documentElement.addEventListener('node-added-event', this._onNodeAddedFromConnectionsManager);

		this.editorInstance = CodeMirror(parentEl, {
	        // // value: 'function myScript(){return 100;}\n',
	        lineNumbers: true,
			gutters: ["CodeMirror-linenumbers"],
	        // // matchBrackets: true,
	        styleActiveLine: true,
			// tabindex: 1,
			// lineWrapping: true,
	        mode: 'javascript',
	        theme: 'oceanic-next'
	    });

		CodeMirror.on(this.editorInstance, 'change', (instance, { from, to, text, removed, origin }) => {
			// const val = instance.getValue(';');
			
			const lineCount = instance.lineCount();
			const lines = Array.from(Array(lineCount)).map((index, i) => {
				return instance.getLine(i);
			});
			this._state = this.analyse(lines, instance.doc);
			const nodes = window.NS.singletons.ConnectionsManager.nodes;
			console.log('state: ', this._state, ' nodes: ', nodes);
		});

		setTimeout(() => {
			this.editorInstance.refresh();
			console.log('refresh');
		}, 500);

		/*
		
			Have to have a state somehwere ???? that has the variable name assigned with the node ID
			when creating with code I will have the variable name first and then assign the ID to that
			variable name when I get callback from node added event
		
		*/
		
	}

	_onNodeAddedFromConnectionsManager(e) {
		console.log('node added: ', e, ' sdf: ', e.detail.constructor.name);

		const nodes = window.NS.singletons.ConnectionsManager.nodes;
		const groupedNodes = Object.keys(nodes).reduce((acc, curr) => {
			const node = nodes[curr];
			// const variableName = node.variableName;
			// if (!variableName) {
			if (!acc[node.constructor.name]) {
				acc[node.constructor.name] = [];
			}

			acc[node.constructor.name].push(node);
			// }
			

			return acc;
		}, {});

		const addedNodes = [];

		Object.keys(groupedNodes).forEach(t => {
			const nodes = groupedNodes[t];

			nodes.forEach((node, i) => {
				const code = node.code(i);
				if (!node.variableName) {
					node.variableName = code;
					addedNodes.push(code);
				}
				
			});
		});

		const addedStrValue = addedNodes.join('"\r\n"') + "\r\n";
		const currentValue = this.editorInstance.getValue("\r\n");
		this.editorInstance.setValue(currentValue + addedStrValue);

		console.log('added: ', addedStrValue, ' currentValue: ', currentValue);

		// const node = e.detail;
		// if (node.code) {

		// 	console.log(node.code(node.ID));
		// }

		/* 
			add code for node

		*/
	}

	analyse(lines, doc) {
		const state = new Map();
		// const lines = value.split(/;/);

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
				if (regexHandleMapper[match.regexType](state, match)) {
					this.markOK(index);
				} else {
					this.markError(index);
				}
			} else {
				this.markError(index);
			}
		});


		return state;
		console.log('collected state: ', state);
	}

	hasError() {
		return this.lineErrors.length > 0;
	}

	markError(lineNumber) {
		this.editorInstance.addLineClass(lineNumber, 'gutter', 'red');
	}

	removeError(lineNumber) {
		this.editorInstance.removeLineClass(lineNumber, 'gutter', 'red');
	}

	markOK(lineNumber) {
		this.editorInstance.addLineClass(lineNumber, 'gutter', 'green');
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