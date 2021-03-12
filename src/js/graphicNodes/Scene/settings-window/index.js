import './index.scss';

import CameraControlSetting from '../CameraControlSetting';
import AxesHelper from '../AxesHelper';
import HorizontalSlider from '../../../views/Nodes/NodeComponents/HorizontalSlider';
import FollowNodeSetting from '../FollowNodeSetting';
import ToggleOrbitHelper from '../ToggleOrbitHelper';

export default class SettingsWindow{
    constructor(parentEl, onAmbientLightSettingChange, foregroundRender, fullscreenClick) {
        this.parentEl = parentEl;

        this.el = document.createElement('div');
		this.el.className = 'settings-window';

        this.labelBtn = document.createElement('div');
        this.labelBtn.className = 'label-btn';

        const label = document.createElement('h5');
        label.innerHTML = 'Inställningar';

        this.labelBtn.appendChild(label);

        this.el.appendChild(this.labelBtn);

        this.onLabelClickBound = this.onLabelClick.bind(this);
        this.labelBtn.addEventListener('click', this.onLabelClickBound);

		this.bottomPartSettings = document.createElement('div');
		this.bottomPartSettings.className = 'bottom-part-settings';

        const col1BottomPartSettings = document.createElement('div');
        col1BottomPartSettings.className = 'settings-col';

        const col2BottomPartSettings = document.createElement('div');
        col2BottomPartSettings.className = 'settings-col';

        this.bottomPartSettings.appendChild(col1BottomPartSettings);
        this.bottomPartSettings.appendChild(col2BottomPartSettings);

        this.isVisible = false;

        if (window.NS.singletons.PROJECT_TYPE === window.NS.singletons.TYPES.chemistry.id) {
            // TODO -- DO SOMETHING HERE FOR CHEMISTRY
        }

        if (window.NS.singletons.PROJECT_TYPE === window.NS.singletons.TYPES.space.id) {
			this.followNodeSetting = new FollowNodeSetting(col1BottomPartSettings);
            this.ambientLightSetting = new HorizontalSlider(col2BottomPartSettings, foregroundRender.ambientLight.intensity, onAmbientLightSettingChange, 2, {min: 0, max: 1}, 'ambient-light settings-item', 'Ambient light');

            this.axesHelper = new AxesHelper(col1BottomPartSettings, foregroundRender);

            this.toggleOrbitHelper = new ToggleOrbitHelper(col1BottomPartSettings);

            // this.onSpeedSettingChangeBound = this.onSpeedSettingChange.bind(this);

            // this.speedSetting = new HorizontalSlider(col2BottomPartSettings, 1, this.onSpeedSettingChangeBound, 2, { min: 0, max: 1 }, 'speed-settings settings-item', 'Speed modifier');
		}

        this.closeFullscreenBtn = document.createElement('div');
        this.closeFullscreenBtn.classList.add('close-fullscreen-btn');

        this.closeFullscreenBtn.addEventListener('click', fullscreenClick);

        this.el.appendChild(this.closeFullscreenBtn);

        this.el.appendChild(this.bottomPartSettings);

        this.parentEl.appendChild(this.el);
    }

    // onSpeedSettingChange(val) {
    //     window.NS.settings.speedModifier = val;
    // }

    onLabelClick(e) {
        e.stopPropagation();
        e.preventDefault();

        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    show() {
        this.isVisible = true;
        this.el.classList.add('visible');

        this.followNodeSetting.checkActive();
    }

    hide() {
        this.isVisible = false;
        this.el.classList.remove('visible');
    }

    showFullscreenBtn() {
        this.closeFullscreenBtn.classList.add('visible');
    }

    hideFullscreenBtn() {
        this.closeFullscreenBtn.classList.remove('visible');
    }
}