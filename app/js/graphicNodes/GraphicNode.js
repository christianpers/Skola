import Node from '../views/Nodes/Node';
import Editor from '../views/Editor';

export default class GraphicNode extends Node{
	constructor(
		parentEl,
		onConnectingCallback,
		onInputConnectionCallback,
		type,
		shader,
		shaderType,
	) 
	{
		super(
			parentEl,
			onConnectingCallback,
			onInputConnectionCallback,
			type
		);

		this.shader = shader;
		this.shaderType = shaderType;

		this.editor = new Editor(this.el, this.shader);

		this.editor.editorInstance.on("change", () => {
	    	this.editor.removeAllErrors();
	    	// this.controlUI.enableRefresh();
	    	this.editor.editorInstance.eachLine((line) => {

	    		const format = /[{}#]+/;
	    		const blank = /\S/;


	    		if (blank.test(line.text)) {
	    			return;
	    		}

				if(!format.test(line.text) && line.text.indexOf('//') <= -1){
					const lineNum = this.editor.editorInstance.getLineNumber(line);
					if (line.text.indexOf(';') <= -1) {
						this.editor.markError(lineNum);

					}
				}
	    	});

	    	// if (this.editor.hasError()) {
	    	// 	this.controlUI.disableRefresh();
	    	// }
	    	// this.sandbox.canvas.load(this.editor.editorInstance.getValue());
	    });
	}

	setup() {

	}
}