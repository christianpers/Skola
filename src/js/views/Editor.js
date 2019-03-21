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

export default class Editor{
	constructor(parentEl, code) {

		this.parentEl = parentEl;

		this.lineErrors = []; // array of linenumbers which should be marked with error

		this.el = document.createElement('div');
		this.el.className = 'editor';

		this.parentEl.appendChild(this.el);

		this.editorInstance = CodeMirror(this.el, {
	        value: code,
	        lineNumbers: true,
	        matchBrackets: true,
	        styleActiveLine: true,
	        mode: 'x-shader/x-fragment',
	        theme: 'oceanic-next',
	    });
	}

	hasError() {
		return this.lineErrors.length > 0;
	}

	markError(lineNumber) {

		const strLineNumber = `${lineNumber}`;

		let hasLineError = false;
		const length = this.lineErrors.length;
		for (let i = 0; i < length; i++) {
			if (this.lineErrors[i] === strLineNumber) {
				hasLineError = true;
			}
		}

		if (!hasLineError) {
			this.lineErrors.push(strLineNumber);
		}

		this.editorInstance.addLineClass(lineNumber, "background", "errorBg");
	}

	removeError(lineNumber) {

		const strLineNumber = `${lineNumber}`;

		const tempLineErrors = this.lineErrors.filter((val) => val !== strLineNumber);

		this.lineErrors = tempLineErrors;
		
		this.editorInstance.removeLineClass(lineNumber, "background", "errorBg");
		
	}

	removeAllErrors() {

		const length = this.lineErrors.length;
		for (let i = 0; i < length; i++) {
			this.removeError(parseInt(this.lineErrors[i]));
		}

		this.lineErrors = [];
	}

}