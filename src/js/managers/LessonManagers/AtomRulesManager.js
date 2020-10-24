export const ATOM_STATUS = Object.freeze({
    POSITIVE: 'POSITIVE',
    NEGATIVE: 'NEGATIVE',
    NEUTRAL: 'NEUTRAL',
    NO_STATUS: 'NO_STATUS',
});

export default class AtomRulesManager {
    constructor() {
    }

    // SHOULD ONLY RETURN IF ATOM HAS NOT COMPLETE ORBITALS (I.E IS AVAILABLE FOR CONNECTIONS FROM OTHER ATOMS)
    getAtomStatus(ID) {
        const atomNode = window.NS.singletons.ConnectionsManager.getNode(ID);
        const notCompletePairs = atomNode.getNotCompleteElectronPairs();

        const electronsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(ID, 'electrons');
        let connectedElectrons = [];
        if (electronsModifierNode) {
            connectedElectrons = electronsModifierNode.getConnectedElectrons();
        }

        return {
            notCompletePairs,
            connectedElectrons,
        };
    }

    getNotCompleteOrbitals(atomID) {
        const atomNode = window.NS.singletons.ConnectionsManager.getNode(atomID);
        const outerRing = atomNode.outerRing;

        const electronsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(atomID, 'electrons');
        if (electronsModifierNode) {
            const connectedElectrons = electronsModifierNode.getConnectedElectrons();

            const notCompleteOrbitals = outerRing.getNotCompleteOrbitals();
            return {
                notCompleteOrbitals,
                connectedElectrons,
            }
        }

        return {};
    }

    getNotCompleteOrbitalsWithoutOrbitalsObj(atomID) {
        const getOrbital = (orbitals, index) => {
            if (orbitals[index]) {
                return orbitals[index];
            }

            orbitals[index] = [];

            return orbitals[index];
        };
        const atomNode = window.NS.singletons.ConnectionsManager.getNode(atomID);
        const outerRing = atomNode.outerRing;

        if (!outerRing) {
            return {};
        }

        const { orbitals: amountOrbitals } = outerRing.ringDef;
		const orbitals = {};

        const electronsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(atomID, 'electrons');
        let connectedElectrons = [];
        if (electronsModifierNode) {
            connectedElectrons = electronsModifierNode.getConnectedElectrons();
            console.log('atomäID start ----: ', atomID);
            connectedElectrons
                .filter(t => {
                    const ringIndex = t.getRingIndex();
                    return Number(ringIndex) === Number(outerRing.index);
                })
                .forEach(t => {
                    const ringPosIndex = Number(t.ringPositionKey);
                    const orbitalIndex = ringPosIndex % amountOrbitals;
                    const orbital = getOrbital(orbitals, orbitalIndex);
                    orbital.push({ keyIndex: ringPosIndex, electron: t });
                });

            const availablePositionKeys = outerRing.getAvailablePositionKeys();
            availablePositionKeys.forEach(t => {
                const key = Number(t);
                const orbitalIndex = key % amountOrbitals;
                const orbital = getOrbital(orbitals, orbitalIndex);
                const position = outerRing.getElectronPosition(atomNode.position, key);
                orbital.push({ keyIndex: key, position });
            });

            console.log('final orbs: ', orbitals);

            console.log('atomäID end ----: ', atomID);

            const orbitalKeys = Object.keys(orbitals);
            const notCompleteOrbitals = orbitalKeys.filter(t => {
                const orbital = orbitals[t];
                const orbitalPositionsWithElectron = orbital.filter(tS => tS.electron);
                return orbitalPositionsWithElectron.length === 1;
            }).map(t => {
                return orbitals[t];
            });

            return {
                notCompleteOrbitals,
                connectedElectrons,
            }
             
        }

        return {};
    }
}