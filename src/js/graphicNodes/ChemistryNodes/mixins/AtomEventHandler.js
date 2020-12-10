import {
	resetElectronAndRing
} from '../helpers';

import {
	getStartDragDataAtom,
} from '../dragHandlers';

const AtomEventHandler = (superclass) => class extends superclass {
    onOrbitalChange({ detail: { isFull, orbital, ringIndex } }) {
		console.log('---- START ', this.ID, '---------');
		console.log('on orbital change 1');
        const modifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(this.ID, 'electrons');
        if (!modifierNode) {
			console.log('on orbital change 2');
            return;
        }
		console.log('on orbital change 3', ' ringINdex: ', ringIndex, ' orbital: ', orbital);
        orbital.positions.forEach(posKey => {
            const electron = modifierNode.getElectronByPositionKeyAndRingIndex(parseInt(posKey), ringIndex);
			console.log('electron; ', electron, ' posKey: ', posKey);
            if (electron) {
                electron.orbitalConnected = isFull;
            }
        });

		console.log('---- END ', this.ID, '---------');
    }

    onAtomDisconnect() {
        const connectionIds = window.NS.singletons.LessonManager.atomConnectionsManager.findConnections(this.ID);
		connectionIds.forEach(connectionId => {
			const connection = window.NS.singletons.LessonManager.atomConnectionsManager.getConnection(connectionId);
			const { positionKey: dragAtomPosKey, id: dragAtomId } = connection.dragAtom;
			const { positionKey: connectingAtomPosKey, id: connectingAtomId } = connection.connectingAtom;

			resetElectronAndRing(dragAtomId, dragAtomPosKey);
			resetElectronAndRing(connectingAtomId, connectingAtomPosKey);

			window.NS.singletons.LessonManager.atomConnectionsManager.removeConnection(connectionId)
		});

		//SYNC BACKEND
		window.NS.singletons.LessonManager.atomConnectionsManager.syncConnections();

		this.dragData = Object.assign({}, this.dragData, getStartDragDataAtom(this.ID, this.type, this.position, this.outerRing));
    }

    onAtomConnectionUpdateEvent() {
		this.updateAtomHTML();
	}
};

export default AtomEventHandler;
