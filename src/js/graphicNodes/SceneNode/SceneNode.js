import Node from '../../views/Nodes/Node';
import * as SHADERS from '../../../shaders/SHADERS';

import InputHelpers from '../Helpers/InputHelpers';
import ForegroundRender from '../Scene/ForegroundRender';
import SettingsWindow from '../Scene/settings-window';

import Resizer from '../Scene/resizer';
import Fullscreen from '../Scene/fullscreen';

// import Raycaster from '../Scene/Raycaster';

import './index.scss';

export default class SceneNode{

	constructor(mainRender) {
		// super();

		this.mainRender = mainRender;

		this.isFullscreen = false;

        this.ID = '_' + Math.random().toString(36).substr(2, 9);
        
        this.isVisible = false;

		this.hasOutput = false;
		this.isGraphicsNode = true;
		this.hasGraphicsInput = true;
		this.isCanvasNode = true;
		this.initAsNotCollapsed = true;

		this.inputHelpersType = InputHelpers.sceneNode;

		this.enabledInputs = [];

		this.el = document.createElement('div');
		this.el.className = 'canvas';

		this.topPartEl = document.createElement('div');
		this.topPartEl.className = 'top-part';

		this.el.appendChild(this.topPartEl);
        
        this.bottomLabelContainer = document.createElement('div');
        this.bottomLabelContainer.className = 'bottom-label';
        
        const labelEl = document.createElement('h5');
        labelEl.className = 'canvas-label';
        labelEl.innerHTML = 'CANVAS WINDOW';

        this.bottomLabelContainer.appendChild(labelEl);

        this.el.appendChild(this.bottomLabelContainer);

        this.onToggleVisibleClickBound = this.onToggleVisibleClick.bind(this);
        this.bottomLabelContainer.addEventListener('click', (e) => {
			if (e.target.classList.contains('touch-layer')) {
				return false;
			}
			this.onToggleVisibleClickBound();
		});

		this.foregroundRender = new ForegroundRender(this.mainRender, this.topPartEl);
		this.getCurrentCanvasDimsBound = this.getCurrentCanvasDims.bind(this);
		this.setCanvasSizeBound = this.setCanvasSize.bind(this);
		this.resizer = new Resizer(this.bottomLabelContainer, this.getCurrentCanvasDimsBound, this.setCanvasSizeBound);
		
		this.onFullscreenClickBound = this.onFullscreenClick.bind(this);
		this.fullscreen = new Fullscreen(this.bottomLabelContainer, this.onFullscreenClickBound);

		this.onAmbientLightSettingChangeBound = this.onAmbientLightSettingChange.bind(this);
		this.settingsWindow = new SettingsWindow(this.el, this.onAmbientLightSettingChangeBound, this.foregroundRender, this.onFullscreenClickBound)
		
		// this.raycaster = new Raycaster(this.topPartEl, this.foregroundRender);
		
		this.scene = new THREE.Scene();
		this.renderer = this.mainRender.renderer;
		this.renderer.setSize(this.topPartEl.clientWidth, this.topPartEl.clientHeight);

		this.topPartEl.appendChild(this.renderer.domElement);

		const geometry = new THREE.PlaneGeometry( 2, 2 );

		const resUniforms = {};
		resUniforms.u_res = {value: new THREE.Vector2(window.innerWidth, window.innerHeight)};

		const textureUniforms = {};
		
		textureUniforms.u_connection0 = {value: 0.0};
		textureUniforms.u_texture0 = {value: new Image()};
		
		textureUniforms.u_connection1 = {value: 0.0};
		textureUniforms.u_texture1 = {value: new Image()};

		textureUniforms.u_finalConnection = {value: 0.0};
		textureUniforms.u_multiConnection = {value: 0.0};

		const uniformsObj = Object.assign({}, resUniforms, textureUniforms);
		this.material = new THREE.ShaderMaterial({
			uniforms: uniformsObj,
			vertexShader: SHADERS.CANVAS_RENDER_VERTEX,
			fragmentShader: SHADERS.CANVAS_RENDER_FRAGMENT,
		});

		this.mesh = new THREE.Mesh(geometry, this.material);

		this.scene.add(this.mesh);
	}

	init(parentEl) {
		const w = window.innerWidth;
		const h = window.innerHeight;

		this.parentEl = parentEl;
		
		this.orthoCamera = new THREE.OrthographicCamera( w / - 2, w / 2, h / 2, h / - 2, 1, 1000 );
		
		setTimeout(() => {
			this.onResize();
		}, 100);

		
		this.onKeyPressBound = this.onKeyPress.bind(this);
		this.onFullscreenChangeBound = this.onFullscreenChange.bind(this);
		document.addEventListener('fullscreenchange', this.onFullscreenChangeBound);
		this.parentEl.appendChild(this.el);
    }

	/* CALLED WHEN ON NODE SELECTION (USED FOR BOTH IF NODE SELECTED OR NONE SELECTED) */
	onNodeDeselect() {
		this.settingsWindow.followNodeSetting.checkActive();
	}

	onFullscreenChange() {
		if (this.isFullscreen) {
			this.isFullscreen = false;
			this.settingsWindow.hideFullscreenBtn();
			
			setTimeout(() => {
				this.onResize();
				
			}, 1000);
		}
	}

	onKeyPress(e) {
		if (e.keyCode === 27) {
			this.onFullscreenClick();
		}
	}

	onFullscreenClick() {
		if (!document.fullscreenElement) {
            this.el.requestFullscreen();
			this.settingsWindow.showFullscreenBtn();
			
            setTimeout(() => {
                this.onResize();
				this.isFullscreen = true;
            }, 1000);
        } else {
            if (document.exitFullscreen) {
				this.isFullscreen = false;
                document.exitFullscreen();
				this.settingsWindow.hideFullscreenBtn();
				
                setTimeout(() => {
                    this.onResize();
					
                }, 1000);
            }
        }
	}
    
    onToggleVisibleClick() {
        if (this.isVisible) {
            this.isVisible = false;
            this.el.classList.remove('visible');
			this.resizer.hide();
			this.fullscreen.hide();
			
			document.addEventListener('keypress', this.onKeyPressBound);
        } else {
            this.isVisible = true;
            this.el.classList.add('visible');
			this.resizer.show();
			this.fullscreen.show();

			this.onResize();

			document.removeEventListener('keypress', this.onKeyPressBound);
        }
    }

	onAmbientLightSettingChange(val) {
		this.foregroundRender.ambientLight.intensity = val;
	}

	getCurrentCanvasDims() {
		return [this.topPartEl.clientWidth, this.topPartEl.clientHeight];
	}

	// ONLY BEING CALLED IF SPACE LESSONS ACTIVE
	setForegroundCamera(camera) {
		if (camera) {
			this.foregroundRender.setActiveCamera(camera);
			return;
		}

		const selectedNode = window.NS.singletons.SelectionManager.currentSelectedNode;

		// if (selectedNode.camera) {
		// 	this.foregroundRender.setActiveCamera(selectedNode.camera);
		// }

		if (selectedNode.mesh) {
			const { position } = selectedNode.mesh;
			selectedNode.mainMesh.geometry.computeBoundingBox();
			// console.log(selectedNode.mainMesh.geometry.boundingBox);
			// console.log(selectedNode.mesh.scale);
			const { boundingBox } = selectedNode.mainMesh.geometry;
			const size = selectedNode.mesh.scale.z * boundingBox.max.z;
			
			const distance = -size*8;
			const obj = { mesh: selectedNode.mesh, distance };
			this.foregroundRender.setMeshToFollow(obj);
		}
	}

	resetForegroundCamera() {
		// this.foregroundRender.setActiveCamera(this.foregroundRender.camera);
		this.foregroundRender.resetMeshToFollow();
	}

	setCanvasSize(size) {
		if (size.w < 100 || size.h < 100) {
			return;
		}
		this.el.style.width = `${size.w}px`;
		this.el.style.height = `${size.h}px`;

		this.onResize(size);
	}

	setBackgroundTexture(texture) {
		this.mesh.material.uniforms.u_texture0.value = texture;
	}

	enableInput(outputNode, inputType) {
		// this.inputs[inputType].enable();

		if (outputNode.isBackgroundNode) {
			const framebuffer = outputNode.framebuffer ? outputNode.framebuffer.texture : outputNode.texture;
			this.mesh.material.uniforms.u_texture0.value = framebuffer;
			this.mesh.material.uniforms.u_connection0.value = 1.0;
		} else if (outputNode.isForegroundNode) {
			this.foregroundRender.addNode(outputNode);
			if (this.foregroundRender.connectedNodes.length === 1) {
				const framebuffer = this.foregroundRender.framebuffer.texture;
				this.mesh.material.uniforms.u_texture1.value = framebuffer;
				this.mesh.material.uniforms.u_connection1.value = 1.0;
			}
		} else if (outputNode.isLightNode) {
			this.foregroundRender.addLight(outputNode);
		}

		const obj = {
			out: outputNode,
			type: inputType,
		};
		this.enabledInputs.push(obj);

		if (!outputNode.isLightNode) {
			this.mesh.material.uniforms.u_finalConnection.value = 1.0;
			// if (this.inputs['background'].isActive && this.inputs['foreground'].isActive) {
			// 	this.mesh.material.uniforms.u_multiConnection.value = 1.0;
			// }
		}
	}

	disableInput(outNode, inputType) {
		if (outNode.isBackgroundNode) {
			this.inputs[inputType].disable();

			this.mesh.material.uniforms.u_texture0.value = null;
			this.mesh.material.uniforms.u_connection0.value = 0.0;
			this.mesh.material.uniforms.u_multiConnection.value = 0.0;
		} else if (outNode.isForegroundNode) {
			this.foregroundRender.removeNode(outNode);

			if (this.foregroundRender.connectedNodes.length === 0) {
				// if (this.inputs[inputType]) {
				// 	this.inputs[inputType].disable();
				// }
				
				this.mesh.material.uniforms.u_texture1.value = null;
				this.mesh.material.uniforms.u_connection1.value = 0.0;
			}
		} else if (outNode.isLightNode) {
			// this.inputs[inputType].disable();
			this.foregroundRender.removeLight(outNode);
		}
		
		this.enabledInputs = this.enabledInputs.filter(t => t.out.ID !== outNode.ID);
		const graphicInputs = this.enabledInputs.filter(t => !t.out.isLightNode);

		if (graphicInputs.length === 0) {
			this.mesh.material.uniforms.u_finalConnection.value = 0.0;
		} else if (!this.inputs['foreground'].isActive) {
			this.mesh.material.uniforms.u_multiConnection.value = 0.0;
		}
	}

	update() {
		this.foregroundRender.update();
	}

	render() {
		this.renderer.clear();

		this.foregroundRender.render();
		this.renderer.setRenderTarget(null);
		this.renderer.render(this.scene, this.orthoCamera);
	}

	onResize(dims) {
		const getDims = () => {
			if (dims) {
				return [dims.w, dims.h];
			}
			return this.getCurrentCanvasDims();
		}

		const [w, h] = getDims();

		this.foregroundRender.onResize({w, h});

		const canvasResizeEvent = new CustomEvent('canvas-resize-event', { detail: [w, h] });
        document.documentElement.dispatchEvent(canvasResizeEvent);

		this.mesh.material.uniforms.u_res.value = new THREE.Vector2(w, h);

		this.orthoCamera.left = w / - 2;
		this.orthoCamera.right = w / 2;
		this.orthoCamera.top = h / -2;
		this.orthoCamera.bottom = h / 2;
		this.orthoCamera.updateProjectionMatrix();

		this.renderer.setSize( w, h );

	}
}