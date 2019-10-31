import './index.scss';

export default class StatusWindow {
  constructor(parentEl) {

    this.unsavedChanges = {};
    this.el = document.createElement('div');
    this.el.className = 'status-window';

    this.titleEl = document.createElement('h4');
    this.titleEl.innerHTML = 'Backend status';

    this.onClickBound = this.onClick.bind(this);

    this.el.addEventListener('click', this.onClickBound);

    this.statusText = document.createElement('p');
    this.statusText.innerHTML = 'Backend status: <span>Up to date</span>';
    // this.el.appendChild(this.titleEl);
    this.el.appendChild(this.statusText);

    parentEl.appendChild(this.el);
  }

  addEvent(evtObj) {
    // console.log('evtObj: ', evtObj);
    this.unsavedChanges[evtObj.id] = Object.assign({}, this.unsavedChanges[evtObj.id], evtObj.saveData);

    this.onUnsavedChanges();
    // console.log('unsaved: ', this.unsavedChanges);
  }

  onNodeRemove(node) {
    delete this.unsavedChanges[node.ID];

    const keys = Object.keys(this.unsavedChanges);
    if (keys.length === 0) {
      this.onSaved();
    }
  }

  onClick() {
    const getPromise = (id, saveData) => {
      const ref = window.NS.singletons.refs.getNodeRef(id);
      if (ref) {
        return ref.update(saveData);
      } else {
        console.log('didnt find ref on update');
        return Promise.resolve();
      }
      
    };
    const keys = Object.keys(this.unsavedChanges);
    const promises = keys.map(t => {
      return getPromise(t, this.unsavedChanges[t]);
    });

    Promise.all(promises)
    .then(() => {
      console.log('all updated');
      this.onSaved();
    })
    .catch(() => {
      console.log('error');
    });
    
  }

  onSaved() {
    this.unsavedChanges = {};
    this.el.classList.remove('unsaved');
    this.statusText.innerHTML = 'Backend status: <span>Up to date</span>';
  }

  onUnsavedChanges() {
    this.el.classList.add('unsaved');
    this.statusText.innerHTML = 'Backend status: <span>Unsaved changes !</span>';
  }
}