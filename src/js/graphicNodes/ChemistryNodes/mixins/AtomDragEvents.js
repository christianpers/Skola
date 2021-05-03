import {
	syncConnectedElectrons,
	syncAtomPos,
	isElectron,
	isMainAtom,
	isDragEvtAtom
} from '../helpers';

import {
	getStartDragDataAtom,
	getStartDragDataElectron,
	onElectronDragEnd,
	getDraggingElectronDragData,
	getDraggingAtomDragData,
	onAtomDragEnd,
} from '../dragHandlers';

import AtomDisconnectHandler from '../AtomDisconnectHandler';

const AtomDragEvents = (superclass) => class extends superclass {
    onDragStart({object}) {
		this.foregroundRender.disableCameraControls();

		if (isDragEvtAtom(object, this.ID, false)) {
			this.foregroundRender.dragControls.addEventListener('drag', this.onDragBound);
			this.foregroundRender.dragControls.addEventListener('dragend', this.onDragEndBound);
		} else {
			return;
		}

		if (isElectron(object)) {
			this.dragData = Object.assign({}, this.dragData, getStartDragDataElectron(this.ID, this.position, object));

			const nodeSelectedEvent = new CustomEvent('node-selected', { detail: this });
        	document.documentElement.dispatchEvent(nodeSelectedEvent);
		}

		if (isMainAtom(object)) {
			this.dragData = Object.assign({}, this.dragData, getStartDragDataAtom(this.ID, this.type, this.position, this.outerRing));
			if (this.dragData.isConnected) {
				this.disconnectHandler = new AtomDisconnectHandler(this.atomDisconnectCallback, object.position, this.circleDragMesh, this.disconnectProgressMesh);
			}
		}
	}

	onDrag({ object }) {
		if (isElectron(object)) {
			this.dragData = Object.assign({}, this.dragData, getDraggingElectronDragData(object, this.visibleRings, this.dragData));
		}

		if (isMainAtom(object)) {
			this.dragData = Object.assign({}, this.dragData, getDraggingAtomDragData(object, this));

			if (this.dragData.isConnected) {
				this.disconnectHandler.onMove(object.position);
			}
		}

		object.position.z = 0;
	}

	onDragEnd({object}) {
		const { releasePoint, ringToReleaseOn, atomToConnect, electronObj } = this.dragData;

		if (isElectron(object)) {
			onElectronDragEnd(ringToReleaseOn, electronObj, this.visibleRings, this.position, object, this.dragData);

			console.log('releasePoint: ', releasePoint, ' pos: ', this.position);

			// BACKEND SYNC
			const electronsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(this.ID, 'electrons');
			const connectedElectrons = electronsModifierNode.getConnectedElectrons();
			syncConnectedElectrons(this.ID, connectedElectrons);
			this.syncAtomRings(connectedElectrons.length);

			this.dragData.releasePoint = null;
			this.dragData.ringToReleaseOn = null;
			this.dragData.electronObj = null;

			this.updateAtomHTML();

			const nodeSelectedEvent = new CustomEvent('node-selected');
        	document.documentElement.dispatchEvent(nodeSelectedEvent);
		}

		if (isMainAtom(object)) {
			if (this.dragData.isConnected) {
				this.disconnectHandler.onEnd();
				if (this.disconnectHandler.hasDisconnected) {
					return;
				}
			}

			this.disconnectHandler = undefined;
			const electronsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(this.ID, 'electrons');
			const connectedElectrons = electronsModifierNode ? electronsModifierNode.getConnectedElectrons() : [];
			onAtomDragEnd(this, connectedElectrons);

			// SYNC BACKEND ATOM POSITIONS
			this.dragData.draggingAtomData.connectedAtoms.forEach(t => {
				const atom = window.NS.singletons.ConnectionsManager.getNode(t.id);
				const pos = atom.position;
				syncAtomPos(t.id, { x: pos.x, y: pos.y });
			});
			
			const position = this.position;
			syncAtomPos(this.ID, { x: position.x, y: position.y });
		}

		this.dragData.connectedElectrons = [];

		this.foregroundRender.enableCameraControls();

		this.foregroundRender.dragControls.removeEventListener('drag', this.onDragBound);
		this.foregroundRender.dragControls.removeEventListener('dragend', this.onDragEndBound);
	}
}

export default AtomDragEvents;