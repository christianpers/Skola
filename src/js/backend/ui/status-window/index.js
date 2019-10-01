export default class StatusWindow {
  constructor(parentEl) {
    this.el = document.createElement('div');
    this.el.className = 'status-window';

    parentEl.appendChild(this.el);
  }

  onSave() {
    this.el.classList.remove('unsaved');
  }

  onUnsavedChanges() {
    this.el.classList.add('unsaved');
  }
}