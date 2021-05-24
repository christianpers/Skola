import { v4 as uuidv4 } from 'uuid';

class Orbital {
    constructor({ ID, angle, radius }) {
        this._ID = ID;
        this._angle = angle;
        this._connectedElectrons = [];
        this._radius = radius;

        const radians = this.angleRadian;
        const x = radius * Math.cos(radians);
        const y = radius * Math.sin(radians);

        this._position = new THREE.Vector2(x, y);
    }

    connectElectron(electronId) {
        if (!this.isFull) {
            this._connectedElectrons.push(electronId);
        } else {
            console.warn('This orbit is full');
        }
    }

    disconnectElectron(electronId) {
        this._connectedElectrons = this._connectedElectrons.filter(t => t !== electronId);
    }

    get angleRadian() {
        return this._angle * (Math.PI / 180);
    }

    get ID() {
        return this._id;
    }

    get isFull() {
        return this._connectedElectrons.length === 2;
    }

    get wantConnection() {
        return this._connectedElectrons.length === 1;
    }
}

class Electron {
    constructor(ID) {
        this._ID = ID;
    }
}

/* maybe doesnt need rings in state */

/* go through the code and try to build up this state to make things simpler   views should react to this state */
class Atom {
    constructor(ID) {
        this._ID = ID;
        this._orbitals = new Map();
        this._electrons = new Map();

    }

    createOrbital(angle, radius) {
        const ID = uuidv4();
        const orbital = new Orbital(
            ID,
            angle,
            radius
        );

        this._orbitals.set(ID, orbital);

        return ID;
    }

    getOrbital(ID) {
        return this._orbitals.get(ID);
    }

    removeOrbital(ID) {
        this._orbitals.delete(ID);
    }

    createElectron() {
        const ID = uuidv4();
        const electron = new Electron(ID);

        this._electrons.set(ID, electron);
    }

    removeElectron(ID) {
        this._electrons.delete(ID);
    }

    /* TODO have to create a fn that gives back next available electron position */

    connectElectronToOrbital(electronID, orbitalID) {
        const orbital = this._orbitals.get(orbitalID);

        orbital.connectElectron(this._electrons.get(electronID));
    }

    disconnectElectron(electronID, orbitalID) {
        const orbital = this._orbitals.get(orbitalID);

        orbital.disconnectElectron(this._electrons.get(electronID));
    }


    getConnectableOrbitals() {
        const ret = [];

        this._orbitals.forEach((valueObj, key) => {
            if (valueObj.wantConnection) {
                ret.push(key);
            }
        });

        return ret;
    }
}

export default class ChemistryState{
    constructor() {
        this._atoms = new Map();
    }

    createAtom(ID) {
        const atom = new Atom(ID);

        this._atoms.set(ID, atom);
    }

    getAtom(ID) {
        return this._atoms.get(ID);
    }

    deleteAtom(ID) {
        this._atoms.delete(ID);
    }

    getConnectableAtoms(excludeID) {
        const ret = [];

        this._atoms.forEach((valueObj, key) => {
            if (key !== excludeID) {
                const connectableOrbitals = valueObj.getConnectableOrbitals();
                if (connectableOrbitals.length) {
                    ret.push(key);
                }
            }
        });

        return ret;
    }
}