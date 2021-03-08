import NodeSelection from './NodeSelection';
import ExpandCollapseController from './ExpandCollapseController';
import CollapsedView from './CollapsedView';
import AddRemoveVisualHelp, { TYPES } from './AddRemoveVisualHelp';
import { createGroup, updateGroup } from '../../backend/set';
import { getGroupRef } from '../../backend/get';

import './index.scss';

export default class NodeGroup {
    constructor(pos, initGroupConfig, tempID) {
        this.nonagons = {};
        this.parentEl = window.NS.workspaceEl;
        this.ID = initGroupConfig ? initGroupConfig.id : null;
        this.tempID = tempID || undefined;

        this.el = document.createElement('div');
        this.el.classList.add('group-container');

        this._nodesContainerEl = document.createElement('div');
        this._nodesContainerEl.classList.add('nodes-container');
        this.el.appendChild(this._nodesContainerEl);

        this._expandCollapseController = new ExpandCollapseController(this.el);
        this._collapsedView = new CollapsedView(this.el);

        this._addRemoveVisualHelp = new AddRemoveVisualHelp(this.el);

        this.onUpdatedRenderOrderBound = this.onUpdatedRenderOrder.bind(this);

        this.onNodeTabSelectedBound = this.onNodeTabSelected.bind(this);
        this.nodeSelectionTabs = new NodeSelection(this.el, this.onNodeTabSelectedBound, this.onUpdatedRenderOrderBound);

        this.parentEl.appendChild(this.el);

        const finalPos = pos ? pos : (initGroupConfig && initGroupConfig.data) ? initGroupConfig.data.pos : { x: window.innerWidth/2, y: window.innerHeight/ 2 };

        this.moveCoords = {
			start: {
				x: 0,
				y: 0
			},
			offset: {
				x: finalPos.x - 100,
				y: finalPos.y - 100,
			}
		};

        this.lastDelta = {x: 0, y: 0};

        this.el.style[window.NS.transform] = `translate3d(${finalPos.x - 100}px, ${finalPos.y - 100}px, 0)`;

        this.onMouseDownBound = this.onMouseDown.bind(this);
        this.onMouseMoveBound = this.onMouseMove.bind(this);
        this.onMouseUpBound = this.onMouseUp.bind(this);

        this.el.addEventListener('mousedown', this.onMouseDownBound);

        if (initGroupConfig) {
            const ref = getGroupRef(this.ID);
		    window.NS.singletons.refs.addGroupRef(ref);
        }
        
    }

    isExpanded() {
        return this._expandCollapseController.isExpanded;
    }

    /* TODO -- NOT BEING USED --- HAS TO BE USED WHEN NO INTERNET */
    getCurrentID() {
        if (this.ID) {
            return this.ID;
        }

        return this.tempID;
    }

    onUpdatedRenderOrder(renderOrder) {
        updateGroup({
            renderOrder,
        }, this.ID, true)
        .then((ref) => {
            console.log('render order in group updated');
        })
        .catch((err) => {
            console.log('error updating group', err);
        });
    }

    triggerAddEvent() {
        const addGroupToBackendEvent = new CustomEvent('add-new-group', { detail: this.tempID });
        document.documentElement.dispatchEvent(addGroupToBackendEvent);
    }

    syncBackend() {
        return new Promise((resolve, reject) => {
            const groupObj = {
                pos: this.moveCoords.offset,
                nodes: [...Object.keys(this.nonagons)],
                renderOrder: [...Object.keys(this.nonagons)],
            };
            
            createGroup(groupObj)
                .then((ref) => {
                    this.ID = ref.id;
                    this.tempID = null;
                    if (ref) {
                        window.NS.singletons.refs.addGroupRef(ref);
                    } else {
                        const ref = getGroupRef(this.ID);
                        window.NS.singletons.refs.addGroupRef(ref);
                    }
                    
                    resolve(ref.id);
                })
                .catch((err) => {
                    console.log('err creating group in db', err);
                    reject();
                });
        })
    }

    setNodeTabTitle(nodeID, title) {
        this.nodeSelectionTabs.setTabTitle(nodeID, title);
    }

    hasNonagons() {
        return Object.keys(this.nonagons).length > 0;
    }

    amountNonagons() {
        return Object.keys(this.nonagons).length;
    }

    onNodeTabSelected(id) {
        const node = this.nonagons[id];

        const keys = Object.keys(this.nonagons);
        keys.forEach((t) => this.nonagons[t].groupHide());

        node.groupShow();
    }

    getPos() {
		const pos = new THREE.Vector2();
		const rect = this.el.getBoundingClientRect();
		pos.set(rect.x + rect.width / 2, rect.y + rect.height / 2);
		
		return pos;
	}

    showAddHelper() {
        this._addRemoveVisualHelp.setType(TYPES.plus);
    }

    showRemoveHelper() {
        this._addRemoveVisualHelp.setType(TYPES.minus);
    }

    hideAddRemoveVisualHelper() {
        this._addRemoveVisualHelp.setType(undefined);
    }

    // show() {
    //     this.el.classList.add('visible');
    // }

    // hide() {
    //     this.el.classList.remove('visible');
    // }

    delete() {
        if (this.el) {
            this.parentEl.removeChild(this.el);
        }
        
    }

    hasNonagon(ID) {
        return !!this.nonagons[ID];
    }

    addNonagon(nonagon, initFromBackend) {
        const onSuccess = () => {
            this.nonagons[nonagon.ID] = nonagon;
            nonagon.addToGroup(this._nodesContainerEl);

            this.nodeSelectionTabs.addNode(nonagon);

            this._collapsedView.setData({ amountNonagons: this.amountNonagons() });

            const keys = Object.keys(this.nonagons);
            if (keys.length === 1) {
                nonagon.groupShow();
            } else {
                keys.forEach(t => {
                    this.nonagons[t].groupHide();
                });
                nonagon.groupShow();
                
            }

            this.nodeSelectionTabs.setTabSelected(nonagon.ID);
        };

        const onError = () => {

        }

        onSuccess();

        if (initFromBackend) {
            return;
        }

        // if (this.tempID) {
        //     return;
        // }
        
        const ids = [...Object.keys(this.nonagons)];

        updateGroup({
            nodes: ids,
            renderOrder: ids,
        }, this.ID, true)
        .then((ref) => {
            // console.log('update group ref: ', ref, 'id: ', ref.id);
            console.log('nodes in group updated');
            
        })
        .catch(() => {
            console.log('error updating group add nonagon');
        });
    }

    removeNonagon(e, nonagon) {
        const onSuccess = () => {
            nonagon.groupShow();
            this.nodeSelectionTabs.removeNode(nonagon);
            nonagon.removeFromGroup(e, this);
            delete this.nonagons[nonagon.ID];

            this._collapsedView.setData({ amountNonagons: this.amountNonagons() });

            if (this.hasNonagons()) {
                console.log('has nonagons', this.nonagons);
                const keys = Object.keys(this.nonagons);
                const activeNonagon = this.nonagons[keys[0]];
                activeNonagon.groupShow();

                this.nodeSelectionTabs.setTabSelected(activeNonagon.ID);

                nonagon.setSelected();
            }
        }
        
        onSuccess();

        const ids = Object.keys(this.nonagons);
        
        updateGroup({
            nodes: ids,
            renderOrder: ids,
        }, this.ID, true)
        .then((ref) => {
            console.log('node removed from group');
            // onSuccess();
        })
        .catch(() => {
            console.log('error updating group nonagon remove');
        });
    }

    onMouseDown(e) {
        e.preventDefault;
        e.stopPropagation();

		if (e.target.nodeName === 'INPUT' || e.target.classList.contains('prevent-drag')) {
			return;
		}

        this.lastDelta.x = 0;
		this.lastDelta.y = 0;

        this.moveCoords.start.x = e.x - this.moveCoords.offset.x;
		this.moveCoords.start.y = e.y - this.moveCoords.offset.y;

        window.addEventListener('mouseup', this.onMouseUpBound);
		window.addEventListener('mousemove', this.onMouseMoveBound);


    }

    onMouseMove(e) {
        const deltaX = e.x - this.moveCoords.start.x;
		const deltaY = e.y - this.moveCoords.start.y;

		this.moveCoords.offset.x = deltaX;
		this.moveCoords.offset.y = deltaY;

        this.lastDelta.x = deltaX;
		this.lastDelta.y = deltaY;

		this.el.style[window.NS.transform] = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
    }

    onMouseUp() {
        window.removeEventListener('mouseup', this.onMouseUpBound);
		window.removeEventListener('mousemove', this.onMouseMoveBound);

        if (this.lastDelta.x === 0 && this.lastDelta.y === 0) {
			return;
		}

        updateGroup({
			pos: this.lastDelta,
		}, this.ID, true)
		.then(() => {
			console.log('updated group');
		})
		.catch(() => {
			console.log('error updating group');
		});
    }
}