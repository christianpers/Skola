import './index.scss';

export default class Dropdown {
    constructor(parentEl, items, title, onSelectedCallback, initValue) {
        this.el = document.createElement('div');
        this.el.classList.add('dropdown');

        this.onSelectedCallback = onSelectedCallback;

        const titleEl = document.createElement('h3');
        titleEl.innerHTML = title;

        this.title = title;

        this.el.appendChild(titleEl);

        this.arrowToggleContainer = document.createElement('div');
        this.arrowToggleContainer.classList.add('arrow-toggle-container');

        const arrowEl = document.createElement('img');
        arrowEl.src = '/assets/arrow-down-yellow.svg';

        this.arrowToggleContainer.appendChild(arrowEl);

        this.toggleBound = this.toggle.bind(this);

        this.arrowToggleContainer.addEventListener('click', this.toggleBound);

        const listContainer = document.createElement('div');
        listContainer.classList.add('list-container');

        this.selectedContainer = document.createElement('div');
        this.selectedContainer.classList.add('selected-container');

        this.selectedContainerTitle = document.createElement('h4');
        this.selectedContainerTitle.innerHTML = 'Nothing selected';

        this.selectedContainer.appendChild(this.selectedContainerTitle);

        this.el.appendChild(this.selectedContainer);

        this.el.appendChild(listContainer);
        this.el.appendChild(this.arrowToggleContainer);

        this.onItemSelectedBound = this.onItemSelected.bind(this);

        this.el.addEventListener('click', this.onItemSelectedBound);

        this.domItems = {};

        for (let i = 0; i < items.length; i++) {
            const itemEl = document.createElement('div');
            itemEl.classList.add('list-item');
            
            const titleEl = document.createElement('h4');
            titleEl.innerHTML = items[i].title;
            itemEl.appendChild(titleEl);

            listContainer.appendChild(itemEl);

            const touchEl = document.createElement('div');
            touchEl.classList.add('touch-layer');

            itemEl.appendChild(touchEl);
            touchEl.setAttribute('data-id', items[i].title);

            if (initValue && initValue === items[i].title) {
                this.onSelectedCallback(true, items[i], this.title);
                itemEl.classList.add('selected');
                this.selectedContainerTitle.innerHTML = initValue;
            }

            this.domItems[items[i].title] = {el: itemEl, textureItem: items[i]};
        }

        this.parentEl = parentEl;

        this.parentEl.appendChild(this.el);
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

        this.onSelectedCallback(false, this.domItems[id].textureItem, this.title);
    }
}