import './index.scss';

export default class Dropdown {
    constructor(parentEl, items, title, onSelectedCallback, initValue, onResetCallback) {
        this.el = document.createElement('div');
        this.el.classList.add('dropdown');

        this.onSelectedCallback = onSelectedCallback;

        const upperRowContainer = document.createElement('div');
        upperRowContainer.classList.add('upper-row-container');

        const titleEl = document.createElement('h4');
        titleEl.innerHTML = title;

        this.title = title;

        upperRowContainer.appendChild(titleEl);

        // this.onResetBtnClickBound = this.onResetBtnClick.bind(this);
        if (onResetCallback) {
            this.resetBtn = document.createElement('div');
            this.resetBtn.classList.add('reset-btn');
            this.resetBtn.classList.add('button');
            this.resetBtn.addEventListener('click', onResetCallback);

            const resetBtnTitle = document.createElement('h5');
            resetBtnTitle.innerHTML = 'Reset';

            this.resetBtn.appendChild(resetBtnTitle);

            upperRowContainer.appendChild(this.resetBtn);
        }
        
        this.el.appendChild(upperRowContainer);

        this.arrowToggleContainer = document.createElement('div');
        this.arrowToggleContainer.classList.add('arrow-toggle-container');

        const arrowEl = document.createElement('img');
        arrowEl.src = '/assets/arrow-down-yellow.svg';

        this.arrowToggleContainer.appendChild(arrowEl);

        this.toggleBound = this.toggle.bind(this);

        this.arrowToggleContainer.addEventListener('click', this.toggleBound);

        this.listContainer = document.createElement('div');
        this.listContainer.classList.add('list-container');

        this.selectedContainer = document.createElement('div');
        this.selectedContainer.classList.add('selected-container');

        this.selectedContainerTitle = document.createElement('h4');
        this.selectedContainerTitle.innerHTML = 'Nothing selected';

        this.selectedContainer.appendChild(this.selectedContainerTitle);

        this.el.appendChild(this.selectedContainer);

        this.el.appendChild(this.listContainer);
        this.el.appendChild(this.arrowToggleContainer);

        this.onItemSelectedBound = this.onItemSelected.bind(this);

        this.el.addEventListener('click', this.onItemSelectedBound);

        // this.domItems = {};

        this.createItems(items, initValue);

        this.parentEl = parentEl;

        this.parentEl.appendChild(this.el);
    }

    createItems(items, initValue, selectedId) {
        this.domItems = {};

        for (let i = 0; i < items.length; i++) {
            const itemEl = document.createElement('div');
            itemEl.classList.add('list-item');
            itemEl.setAttribute('list-id', items[i].ID || 'no-id');
            
            const titleEl = document.createElement('h4');
            titleEl.innerHTML = items[i].title;
            itemEl.appendChild(titleEl);

            this.listContainer.appendChild(itemEl);

            const touchEl = document.createElement('div');
            touchEl.classList.add('touch-layer');

            itemEl.appendChild(touchEl);
            touchEl.setAttribute('data-id', items[i].title);

            if (initValue && initValue === items[i].title) {
                this.onSelectedCallback(true, items[i], this.title);
                itemEl.classList.add('selected');
                this.selectedContainerTitle.innerHTML = initValue;
            }

            if (selectedId) {
                if (selectedId === items[i].id) {
                    itemEl.classList.add('selected');
                    this.selectedContainerTitle.innerHTML = items[i].title;
                }
            }

            this.domItems[items[i].title] = {el: itemEl, item: items[i]};
        }

    }

    update(items, resetSelected) {
        let selectedId = null;
        while (this.listContainer.firstChild) {
            const child = this.listContainer.firstChild;
            if (child.classList.contains('selected')) {
                selectedId = child.getAttribute('list-id');
            }
            this.listContainer.removeChild(this.listContainer.firstChild);
        }

        this.createItems(items, null, resetSelected ? null : selectedId);
        if (resetSelected) {
            this.selectedContainerTitle.innerHTML = 'Nothing selected';
        }
    }

    toggle() {
        if (this.el.classList.contains('open')) {
            this.closeList();
        } else {
            this.openList();
        }
    }

    openList() {
        this.el.classList.add('open');
    }

    closeList() {
        this.el.classList.remove('open');
    }

    onItemSelected(e) {
        const id = e.target.getAttribute('data-id') || undefined;

        if (!id) {
            return;
        }

        this.closeList();

        const keys = Object.keys(this.domItems);
        for (let i = 0; i < keys.length; i++) {
            this.domItems[keys[i]].el.classList.remove('selected');
        }

        this.domItems[id].el.classList.add('selected');

        this.selectedContainerTitle.innerHTML = id;

        this.onSelectedCallback(false, this.domItems[id].item, this.title);
    }
}