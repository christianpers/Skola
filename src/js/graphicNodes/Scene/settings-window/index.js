import './index.scss';

import CameraControlSetting from '../CameraControlSetting';
import AxesHelper from '../AxesHelper';
import HorizontalSlider from '../../../views/Nodes/NodeComponents/HorizontalSlider';

export default class SettingsWindow{
    constructor(parentEl, onAmbientLightSettingChange, foregroundRender, fullscreenClick) {
        this.parentEl = parentEl;

        this.el = document.createElement('div');
		this.el.className = 'settings-window';

		this.bottomPartSettings = document.createElement('div');
		this.bottomPartSettings.className = 'bottom-part-settings';

        this.cameraControlSetting = new CameraControlSetting(this.bottomPartSettings, foregroundRender);
		this.ambientLightSetting = new HorizontalSlider(this.bottomPartSettings, 1, onAmbientLightSettingChange, 2, {min: 0, max: 1}, 'ambient-light', 'Ambient light');

		this.axesHelper = new AxesHelper(this.bottomPartSettings, foregroundRender);

        this.closeFullscreenBtn = document.createElement('div');
        this.closeFullscreenBtn.classList.add('close-fullscreen-btn');

        this.closeFullscreenBtn.addEventListener('click', fullscreenClick);

        this.el.appendChild(this.closeFullscreenBtn);

        this.el.appendChild(this.bottomPartSettings);

        this.parentEl.appendChild(this.el);
    }

    showFullscreenBtn() {
        this.closeFullscreenBtn.classList.add('visible');
    }

    hideFullscreenBtn() {
        this.closeFullscreenBtn.classList.remove('visible');
    }
}