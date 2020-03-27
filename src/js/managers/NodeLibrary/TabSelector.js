export default class TabSelector {
    constructor(parentEl, tabs) {

        this.parentEl = parentEl;
        this.el = document.createElement('div');
        this.el.classList.add('tab-selector');

        this.tabs = {};

        tabs.forEach(t => {
            const tabEl = document.createElement('div');
            tabEl.classList.add('tab-item');
            tabEl.addEventListener('click', () => {
                this.onTabClick(t.type);
            });
            
            const title = document.createElement('h5');
            title.innerHTML = t.type;

            tabEl.appendChild(title);
            this.el.appendChild(tabEl);

            this.tabs[t.type] = {
                el: tabEl,
                obj: t,
            };
        });

        this.parentEl.appendChild(this.el);
    }

    onTabClick(type) {
        this.setTabSelected(type);
    }

    deselectTabs() {
        const keys = Object.keys(this.tabs);
        keys.forEach(t => {
            const tabObj = this.tabs[t];

            tabObj.el.classList.remove('selected');
            tabObj.obj.hide();
        });
    }

    setTabSelected(type) {
        this.deselectTabs();
        const tabObj = this.tabs[type];
        tabObj.el.classList.add('selected');
        tabObj.obj.show();
    }
}