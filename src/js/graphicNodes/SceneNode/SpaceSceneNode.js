import SceneNode from './SceneNode';
import SpaceTimeUI from './space/TimeUI';

export default class SpaceSceneNode extends SceneNode {
    constructor(mainRenderer) {
        super(mainRenderer);

		this._spaceTimeUI = new SpaceTimeUI(this.el);

    }

    init(parentEl) {
        super.init(parentEl);

        // const texture = THREE.ImageUtils.loadTexture('./assets/textures/space/galaxy_starfield.png');

        // this.setBackgroundTexture(texture);
    }

    /* CALLED WHEN ON NODE SELECTION (USED FOR BOTH IF NODE SELECTED OR NONE SELECTED) */
	onNodeDeselect() {
		this.settingsWindow.followNodeSetting.checkActive();
	}

	setForegroundCamera(camera) {
		if (camera) {
			this.foregroundRender.setActiveCamera(camera);
			return;
		}

		const selectedNode = window.NS.singletons.SelectionManager.currentSelectedNode;

		if (selectedNode.mesh) {
			const { position } = selectedNode.mesh;
			selectedNode.mainMesh.geometry.computeBoundingBox();
			const { boundingBox } = selectedNode.mainMesh.geometry;
			const size = selectedNode.mesh.scale.z * boundingBox.max.z;
			
			const distance = -size*8;
			const obj = { mesh: selectedNode.mesh, distance };
			this.foregroundRender.setMeshToFollow(obj);
		}
	}

	resetForegroundCamera() {
		this.foregroundRender.resetMeshToFollow();
	}
}