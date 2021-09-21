import Editor from '../Editor';

import './index.scss';


export default class EditorView{
    constructor(parentEl) {
        this._containerEl = document.createElement('editor');

        this.editor = new Editor(this._containerEl);

        this._panel = document.createElement('editor-panel');

        const editorTitle = document.createElement('h5');
        editorTitle.innerHTML = 'Code Editor';

        this._panel.appendChild(editorTitle);

        this._containerEl.appendChild(this._panel);

        this._onPanelClick = this._onPanelClick.bind(this);

        this._panel.addEventListener('click', this._onPanelClick);

        parentEl.appendChild(this._containerEl);
    }

    _onPanelClick() {
        if (this._containerEl.classList.contains('visible')) {
            this._containerEl.classList.remove('visible');
        } else {
            this._containerEl.classList.add('visible');
        }
    }
}
