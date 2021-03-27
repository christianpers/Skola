import './index.scss';

export default class StatusWindow {
  constructor(parentEl) {

    this.unsavedChanges = {};
    this.el = document.createElement('div');
    this.el.className = 'status-window';

    this.onClickBound = this.onClick.bind(this);
    this.onSaveDialogClose = this.onSaveDialogClose.bind(this);

    // this.el.addEventListener('click', this.onClickBound);

    this.statusText = document.createElement('p');
    // this.el.appendChild(this.titleEl);
    this.el.appendChild(this.statusText);

    this.btn = document.createElement('button');
    this.btn.addEventListener('click', this.onClickBound);

    const btnLabel = document.createElement('p');
    this.btn.appendChild(btnLabel);
    btnLabel.innerHTML = 'Spara';

    this.el.appendChild(this.btn);

    parentEl.appendChild(this.el);

    this._timeout = undefined;
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
    clearTimeout(this._timeout);
    this._timeout = undefined;

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

  onSaveDialogClose() {
    window.NS.singletons.DialogManager.saveDialog.hide();
    this._timeout = undefined;
  }

  onSaved() {
    this.unsavedChanges = {};
    this.el.classList.remove('unsaved');
    window.NS.singletons.DialogManager.saveDialog.hide();
    clearTimeout(this._timeout);
    this._timeout = undefined;
  }

  onUnsavedChanges() {
    this.el.classList.add('unsaved');
    this.statusText.innerHTML = '<span>Du har osparade ändringar !</span>';

    if (!this._timeout) {
      this._timeout = this.getTimeout();
    }
  }

  getTimeout() {
    return setTimeout(() => {
      window.NS.singletons.DialogManager.saveDialog.hide();
      if (window.NS.singletons.DialogManager.saveDialog.shouldShow()) {
        window.NS.singletons.DialogManager.saveDialog.show(this.onClickBound, this.onSaveDialogClose);
      } else {
        this._timeout = this.getTimeout();
      }
      
    }, 5000);
  }
}