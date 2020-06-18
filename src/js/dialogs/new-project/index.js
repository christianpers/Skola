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
                    <h4>Projektnamn:</h4>
                    <input class="title-input" type="text" placeholder="Projektnamn" />
                </div>
                <div class="dropdown-container"></div>
                <button class="save-btn btn" type="button"><h5>Spara</h5></button>
                <button class="cancel-btn btn" type="button"><h5>Avbryt</h5></button>
            </div>
        `;

        this.el.innerHTML = html;

        const dropdownContainer = this.el.querySelector('.dropdown-container');

        const getItems = () => {
            const types = window.NS.singletons.TYPES;
            const keys = Object.keys(types);
            return keys.map(t => ({ id: t, title: types[t].title }));
        }

        const items = getItems();

        this.selectedType = null;

        this.onTypeSelectedBound = this.onTypeSelected.bind(this);
        this.typeDropdown = new Dropdown(dropdownContainer, items, 'Välj typ av projekt:', this.onTypeSelectedBound);

        this.parentEl.appendChild(this.el);

        this.inputEl = this.el.querySelector('.title-input');

        this.onSaveClickBound = this.onSaveClick.bind(this);
        this.onCancelClickBound = this.onCancelClick.bind(this);

        this.onSaveBtn = this.el.querySelector('.save-btn');
        this.onCancelBtn = this.el.querySelector('.cancel-btn');

        this.onSaveFn = null;
        this.onCancelFn = null;
    }

    onTypeSelected(bool, item, title) {
        console.log('type: ', item, ' sdf: ', title);
        this.selectedType = item;
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