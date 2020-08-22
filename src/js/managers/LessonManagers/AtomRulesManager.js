export const ATOM_STATUS = Object.freeze({
    POSITIVE: 'POSITIVE',
    NEGATIVE: 'NEGATIVE',
    NEUTRAL: 'NEUTRAL',
    NO_STATUS: 'NO_STATUS',
});

export default class AtomRulesManager {
    constructor() {
    }

    getAtomStatus(ID) {
        const electronsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(ID, 'electrons');
        let connectedElectrons = [];
        if (electronsModifierNode) {
            connectedElectrons = electronsModifierNode.getConnectedElectrons();
        }

        const protonsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(ID, 'protons');
        let amountProtons = 0;
        if (protonsModifierNode) {
            amountProtons = protonsModifierNode.getAmountProtons();
        }


        const amountConnectedElectrons = connectedElectrons.length;
        let status = ATOM_STATUS.NO_STATUS;

        if (amountProtons > amountConnectedElectrons) {
            status = ATOM_STATUS.POSITIVE;
        } else if (amountProtons < amountConnectedElectrons) {
            status = ATOM_STATUS.NEGATIVE;
        } else if (amountProtons === amountConnectedElectrons) {
            status = ATOM_STATUS.NEUTRAL;
        }

        return {
            status,
            connectedElectrons,
        };
    }
}