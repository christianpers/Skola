import {
  getFromArr,
  getDate,
  getDrawingsData,
  getGenericDrawingsData,
  getViewHTML,
} from './helpers';

import {
  getDrawingRef,
} from '../../get';

import { createDrawing, createDrawingFromGeneric } from '../../set';

import './index.scss';

export default class DrawingsWindow{
  constructor(parentEl, username, onSelected) {
    this.username = username;
    this.drawings = {};
    this.genericDrawings = {};
    this.paths = {};
    this.onSelected = onSelected;

    this.el = document.createElement('div');
    this.el.className = 'drawings-window';

    this.onExistingDrawingClickBound = this.onExistingDrawingClick.bind(this);
    // this.onNewDrawingClickBound = this.onNewDrawingClick.bind(this);
    this.onDeleteDrawingBound = this.onDeleteDrawing.bind(this);

    parentEl.appendChild(this.el);

    const getData = () => {
      const promises = [getDrawingsData(username), getGenericDrawingsData()];
      return Promise.all(promises);
    }

    getData()
      .then((resp) => {
        const [drawings, genericDrawings] = resp;
        console.log('sdfsd: ', drawings);
        this.drawings = drawings;
        this.genericDrawings = genericDrawings;
        this.el.innerHTML = getViewHTML(drawings, genericDrawings);
        this.makeInteractive();
      })
      .catch((err) => {
        console.log('sdfsdf', err);
      });
    
  }

  makeInteractive() {
    const existingDrawings = this.el.querySelectorAll('.drawings-item');
    console.log('existingDrawings', existingDrawings);
    existingDrawings.forEach((t) => {
      const deleteBtn = t.querySelector('.delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', this.onDeleteDrawingBound);
      }
      
      t.addEventListener('click', this.onExistingDrawingClickBound);
    });

    const titleContainer = this.el.querySelector('.data-container');

    const newDrawing = this.el.querySelector('.init-container');
    newDrawing.addEventListener('click', () => {
      titleContainer.classList.add('visible');
    });

    const input = titleContainer.querySelector('input');

    const saveTitle = titleContainer.querySelector('.save-title');
    saveTitle.addEventListener('click', () => {
      createDrawing({ title: input.value })
        .then((ref) => {
          console.log('created drawing ref: ', ref);
          window.NS.singletons.refs.setDrawingRef(ref);
          this.onSelected();
        })
        .catch((e) => {
          console.log('error', e);
        });
    });

    const cancelTitle = titleContainer.querySelector('.cancel-title');
    cancelTitle.addEventListener('click', () => {
      console.log('cancel click', this);
      titleContainer.classList.remove('visible');
      input.value = '';
    });
  }

  onDeleteDrawing(e) {
    e.preventDefault();
    e.stopPropagation();
    const id = e.target.getAttribute('data-id');
    const path = this.drawings[id].drawing.path;

    const onYes = () => {
      window.NS.singletons.DialogManager.verificationDialog.hide();
      window.NS.singletons.DialogManager.loaderDialog.show();
      const deleteFn = firebase.functions().httpsCallable('recursiveDelete');
      deleteFn({ path: path })
        .then((result) => {
          console.log('Delete success: ' + JSON.stringify(result));
          window.NS.singletons.DialogManager.loaderDialog.hide();
          // this.getDrawingsData();
          getDrawingsData(this.username)
            .then((drawingsData) => {
              this.drawings = drawingsData;

              this.el.innerHTML = getViewHTML(this.drawings, this.genericDrawings);
              this.makeInteractive();
              // this.populateView(finalData);
            });
        })
        .catch((err) => {
          window.NS.singletons.DialogManager.loaderDialog.hide();
          console.log('Delete failed, see console,');
          console.warn(err);
        });
    };

    const onNo = () => {
      window.NS.singletons.DialogManager.verificationDialog.hide();
    };
    
    window.NS.singletons.DialogManager.verificationDialog.show(onYes, onNo);
  }

  onExistingDrawingClick(e) {
    const handleGenericDrawing = (id) => {
      window.NS.singletons.DialogManager.loaderDialog.show();
      const drawing = this.genericDrawings[id];
      createDrawingFromGeneric(drawing)
        .then((drawingRef) => {
          window.NS.singletons.refs.setDrawingRef(drawingRef);
          window.NS.singletons.DialogManager.loaderDialog.hide();
          this.onSelected(drawing);
        })
        .catch((err) => {
          console.log('err', err);
        });

    }
    const id = e.target.getAttribute('data-id');
    const type = e.target.getAttribute('data-drawing-type');
    if (type && type === 'generic') {
      /*
        This creates a new personal drawing if drawing is generic with the generic one as boilerplate
     */
      handleGenericDrawing(id);
      return false;
    }
    const drawing = this.drawings[id];

    window.NS.singletons.refs.setDrawingRef(getDrawingRef(id));
    this.onSelected(drawing);
  }

	show() {
		this.el.classList.remove('hide');
	}

	hide() {
		this.el.classList.add('hide');
	}
}