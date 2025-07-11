import { getCircle, getDoubleCircle } from './helpers';
import Orbital from './Orbital';
import * as Events from './events';

const getOrbitalAngle = (ringIndex, orbPositions) => {
	const orbDistance = 360 / orbPositions;
	return ((ringIndex % orbPositions) * orbDistance + 90);
};

export default class AtomCircle{
	constructor(radius, ringDef, index, atomEl) {
        this.title = 'AtomCircle';
        this.index = index;

		this.atomEl = atomEl;

		this.positions = {};
        this.ringDef = ringDef;

		this.radius = radius;

		for (let i = 0; i < ringDef.amountElectrons; i++) {
			const position = this.getElectronPosition({ x: 0, y: 0 }, i);
			const angle = getOrbitalAngle(i, ringDef.orbitalPositions);
			this.positions[i] = { available: true, position, orbitalAngle: angle };
		}

		this.orbitals = [];

		const { orbitalPositions } = this.ringDef;
		const orbitalDistance = 360 / orbitalPositions;
		
		for (let i = 0; i < orbitalPositions; i++) {
			const angle = getOrbitalAngle(i, orbitalPositions);
			const positions = this.getPositionsForOrbital(angle);
			const orbitalItem = new Orbital(angle, radius, positions, this.index > 0, this.ringDef.allowElectronAngleMove);
			this.orbitals.push(orbitalItem);
		}

        this.highlightColor = new THREE.Color(245/255, 244/255, 225/255).getHex();
        this.defaultColor = new THREE.Color(250/255, 75/255, 75/255).getHex();
		this.connectedColor = new THREE.Color(152/255, 235/255, 169/255).getHex();
        this.initCurve(radius);
	}

	initCurve(radius) {
		const detailPerPartCurve = 10;
		// const rotateOrigin = { x: 0, y: 0 };
		// const rotateAngle = 120;
		// const points = getDoubleCircle(rotateOrigin, rotateAngle, detailPerPartCurve, 0, 0, radius, radius);
		const points = getCircle(detailPerPartCurve, 0, 0, radius, radius);
		
		let index = 0;

		const length = points.length;
		const positions = new Float32Array( length * 3 );

		for (let i = 0; i < length; i++) {
			positions[index++] = points[i].x;
			positions[index++] = points[i].y;
			positions[index++] = 0;
		}

		this.geometry = new THREE.BufferGeometry();
		this.bufferAttr = new THREE.BufferAttribute( positions, 3 );
		// this.bufferAttr.setDynamic(true);
		this.geometry.addAttribute( 'position', this.bufferAttr );

		this.material = new THREE.LineBasicMaterial( { transparent: true, color : this.defaultColor, opacity: 1.0 } );
		this.material.userData.toggleSelected = true;

		this.mesh = new THREE.Group();
		
		this.ringMesh = new THREE.Line( this.geometry, this.material );

		this.mesh.add(this.ringMesh);
		for (let i = 0; i < this.orbitals.length; i++) {
			this.mesh.add(this.orbitals[i].mesh);
		}

		this.mesh.visible = false;
	}

	totalAmountPositions() {
		return this.ringDef.amountElectrons;
	}

	getOrbitalForAngle(angle) {
		return this.orbitals.find(t => t.angle === angle);
	}

    setHighlighted() {
        this.material.color.setHex(this.highlightColor);
    }

    setDefault() {
        this.material.color.setHex(this.defaultColor);
    }

	markPositionAsTaken(key) {
		this.positions[key] = Object.assign({}, this.positions[key], { available: false });
		const orbital = this.getOrbitalFromPositionKey(key);
		const orbitalIsFull = !orbital.positions.some(posKey => this.positions[posKey].available);

		const orbitalUpdateEvent = new CustomEvent(Events.ON_ORBITAL_POSITIONS_UPDATE, { detail: { isFull: orbitalIsFull, orbital, ringIndex: this.index }});
        this.atomEl.dispatchEvent(orbitalUpdateEvent);
	}

	markPositionAsAvailable(key) {
		this.positions[key] = Object.assign({}, this.positions[key], { available: true });
		const orbital = this.getOrbitalFromPositionKey(key);
		const orbitalIsFull = !orbital.positions.some(posKey => this.positions[posKey].available);

		const orbitalUpdateEvent = new CustomEvent(Events.ON_ORBITAL_POSITIONS_UPDATE, { detail: { isFull: orbitalIsFull, orbital, ringIndex: this.index }});
        this.atomEl.dispatchEvent(orbitalUpdateEvent);
	}

	getAvailableElectronPosition(offset) {
		// let availablePosition;
		// const keys = Object.keys(this.positions);
		const keys = this.getAvailablePositionKeys();
		const availablePositionKey = keys[0];
		if (!availablePositionKey) {
			return { key: undefined, pos: undefined };
		}
		const availableObj = this.positions[availablePositionKey];
		const pos = new THREE.Vector2();

		const { position, orbitalAngle } = availableObj;

		pos.x = position.x + offset.x;
		pos.y = position.y + offset.y;
		this.markPositionAsTaken(availablePositionKey);

		return { key: availablePositionKey, pos, orbitalAngle };
	}

	getConnectedElectronPosition(offset, key, overrideAngle = undefined) {
		if (overrideAngle !== undefined) {
			const radians = overrideAngle * (Math.PI / 180);
			const x = offset.x + this.radius * Math.cos(radians);
			const y = offset.y + this.radius * Math.sin(radians);

			return new THREE.Vector2(x, y);
		}
		return this.getElectronPosition(offset, key);
	}

	getElectronPosition(offset, electronRingIndex) {
		const getAngle = (ringIndex, orbPositions) => {
			const pairOffset = ringIndex >= orbPositions ? 5 : -5;
			return getOrbitalAngle(ringIndex, orbPositions) - pairOffset;
		};
		const { orbitalPositions } = this.ringDef;
		const electronAngle = getAngle(electronRingIndex, orbitalPositions);

		const radians = electronAngle * (Math.PI / 180);
		const x = offset.x + this.radius * Math.cos(radians);
		const y = offset.y + this.radius * Math.sin(radians);

		return new THREE.Vector2(x, y);
	}

	getNotCompleteOrbitals() {
		const ret = [];
		this.orbitals.forEach(t => {
			const availableKeys = t.positions.filter(t => this.positions[t].available);
			if (availableKeys.length === 1) {
				ret.push({ orbital: t, availablePositionKey: availableKeys[0] });
			}
		});

		return ret;
	}

	getOrbitalFromPositionKey(posKey) {
		return this.orbitals.find(t => t.positions.some(tP => tP === posKey.toString()));
	}

    remove() {
        this.geometry.dispose();
        this.material.dispose();
    }

	
	update() {
		

		// this.currentT += this.currentSpeed * window.NS.settings.speedModifier;
		// if (this.currentT > 1) {
		// 	this.currentT = 0;
		// }
	}

	render() {

	}

	removeFromDom() {

		this.reset();
		// window.cancelAnimationFrame(this.animateValues.reqAnimFrame);

		super.removeFromDom();

	}

	getAvailablePositionKeys() {
		return Object.keys(this.positions)
			.filter(t => this.positions[t].available);
	}

	getPositionsForOrbital(angle) {
		const keys = Object.keys(this.positions);
		return keys.filter(t => {
			const pos = this.positions[t];
			return pos.orbitalAngle === angle;
		});
	};

	get isFull() {
		const availablePositions = 0;

		const available = Object.keys(this.positions)
			.filter(t => this.positions[t].available);
		
		return available.length === 0;
	}
}