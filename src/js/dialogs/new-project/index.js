import Dropdown from '../../views/Nodes/NodeComponents/Dropdown';

import './index.scss';

export default class NewProjectDialog{
    constructor(parentEl) {
        this.parentEl = parentEl;

        this.el = document.createElement('div');
        this.el.classList.add('new-project-dialog');
        this.el.classList.add('hidden');

        const html = `
            <div class="inner-content">
                <div class="title-container">
                    <h4>Skapa nytt projekt</h4>
                    <input class="title-input" type="text" placeholder="Namn på ditt projekt" />
                </div>
                <div class="dropdown-container"></div>
                <div class="btn-container">
                    <button class="cancel-btn btn" type="button"><h5>Avbryt</h5></button>
                    <button class="save-btn btn" type="button" disabled><h5>Skapa</h5></button>
                    
                </div>
            </div>
        `;

        this.el.innerHTML = html;

        const dropdownContainer = this.el.querySelector('.dropdown-container');

        const getItems = (isDebugUser) => {
            const types = window.NS.singletons.TYPES;
            const keys = Object.keys(types);
            return keys.filter(t => types[t].readyForUse || isDebugUser).map(t => ({ id: t, title: types[t].title }));
        };

        const items = getItems(window.NS.showDebug);

        this.selectedType = null;

        this.onTypeSelectedBound = this.onTypeSelected.bind(this);
        this.typeDropdown = new Dropdown(dropdownContainer, items, 'Välj typ av projekt:', this.onTypeSelectedBound);

        this.parentEl.appendChild(this.el);

        this.onInputChange = this.onInputChange.bind(this);

        this.inputEl = this.el.querySelector('.title-input');
        this.inputEl.addEventListener('input', this.onInputChange);

        this.onSaveClickBound = this.onSaveClick.bind(this);
        this.onCancelClickBound = this.onCancelClick.bind(this);

        this.onSaveBtn = this.el.querySelector('.save-btn');
        this.onCancelBtn = this.el.querySelector('.cancel-btn');

        this.onSaveFn = null;
        this.onCancelFn = null;
    }

    onInputChange() {
        this.checkValid();
    }

    onTypeSelected(bool, item, title) {
        this.selectedType = item;
        this.checkValid();
    }

    checkValid() {
        const title = this.inputEl.value;
        if (title.length <= 0 || !this.selectedType) {
            this.onSaveBtn.disabled = true;
        } else {
            this.onSaveBtn.disabled = false;
        }
    }

    onSaveClick() {
        const title = this.inputEl.value;
        if (title.length <= 0 || !this.selectedType) {
            return;
        }
        const { id } = this.selectedType;
        this.onSaveFn(title, id);
    }

    onCancelClick() {
        this.inputEl.value = '';
        this.onCancelFn();
    }

    show(onSave, onCancel) {
        this.el.classList.remove('hidden');
        this.onSaveFn = onSave;
        this.onCancelFn = onCancel;
        this.onSaveBtn.addEventListener('click', this.onSaveClickBound);
        this.onCancelBtn.addEventListener('click', this.onCancelClickBound);
    }

    hide() {
        this.el.classList.add('hidden');
        this.onSaveBtn.removeEventListener('click', this.onSaveFn);
        this.onCancelBtn.removeEventListener('click', this.onCancelFn);
    }

    onError() {
        this.el.classList.add('error');
    }
}