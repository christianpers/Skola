import NodePlaceHelper from './NodePlaceHelper';
import { types as nodeTypes, spaceTypes, chemistryTypes, mathTypes } from './NodeTypes'; 
import NodeLibraryTab from './NodeLibraryTab';
import TabSelector from './TabSelector';

import './NodeLibrary.scss';

export default class NodeLibrary{
	constructor(parentEl, onNodeAddedCallback, workspaceManager) {
		this.parentEl = parentEl;

		this.hasDoneInitOnNodeCreation = false;
		this.currentCreatedNode = null;

		this.onMouseOverBound = this.onMouseOver.bind(this);
		this.onMouseOutBound = this.onMouseOut.bind(this);

		this.mouseIsDown = false;

		this.el = document.createElement('div');
		this.el.className = 'node-library';

		this.setMouseDownBound = this.setMouseDown.bind(this);

		this.spaceTab = new NodeLibraryTab(
			this.el,
			'Rymden',
			spaceTypes,
			this.setMouseDownBound,
			workspaceManager,
			onNodeAddedCallback,
		);
		this.chemistryTab = new NodeLibraryTab(
			this.el,
			'Kemi',
			chemistryTypes,
			this.setMouseDownBound,
			workspaceManager,
			onNodeAddedCallback,
		);

		this.mathTab = new NodeLibraryTab(
			this.el,
			'Matte',
			mathTypes,
			this.setMouseDownBound,
			workspaceManager,
			onNodeAddedCallback,
		);

		const tabs = {
			'space': this.spaceTab,
			'chemistry': this.chemistryTab,
			'math': this.mathTab
		};

		this.tabSelector = new TabSelector(this.el, [tabs[window.NS.singletons.PROJECT_TYPE]]);
		const activeTab = window.NS.singletons.TYPES[window.NS.singletons.PROJECT_TYPE].title;
		this.tabSelector.setTabSelected(activeTab || 'Rymden');

		this.isShowing = false;

		this.el.addEventListener('mouseover', this.onMouseOverBound);

		this.titleEl = document.createElement('h4');
		this.titleEl.innerHTML = 'NODE LIBRARY';
		this.titleEl.className = 'title-bar';

		this.el.appendChild(this.titleEl);

		this.parentEl.appendChild(this.el);
	}

	setMouseDown(val) {
		this.mouseIsDown = val;
	}

	onMouseOver() {
		if (this.mouseIsDown) {
			return;
		}

		if (!this.isShowing) {
			this.show();
		}
	}

	onMouseOut() {
		if (this.mouseIsDown) {
			return;
		}

		if (this.isShowing) {
			this.hide();
		}
	}

	hide() {
		this.isShowing = false;
		this.el.classList.remove('showing');
		this.el.removeEventListener('mouseout', this.onMouseOutBound);
	}

	show() {
		this.isShowing = true;
		this.el.classList.add('showing');
		this.el.addEventListener('mouseout', this.onMouseOutBound);
	}
}