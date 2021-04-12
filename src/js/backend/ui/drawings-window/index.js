import {
  getFromArr,
  getDate,
  getDrawingsData,
  getGenericDrawingsData,
  getViewHTML,
  getDrawing,
  drawingExists,
} from './helpers';

import {
  getDrawingRef,
} from '../../get';

import { createDrawing, createDrawingFromGeneric } from '../../set';

import './index.scss';

export default class DrawingsWindow{
  constructor(parentEl, username, onSelected, drawingId) {
    this.username = username;
    this.drawings = {};
    this.genericDrawings = {};
    this.paths = {};
    this.onSelected = onSelected;

    this.el = document.createElement('div');
    this.el.className = 'drawings-window';

    parentEl.appendChild(this.el);

    const hasDrawingId = drawingId.length > 0;

    if (!hasDrawingId) {
      this.initFromScratch(username);
    } else {
      this.initFromDrawingId(username, drawingId);
    }
  }

  initFromDrawingId(username, drawingId) {
    const onDrawingExists = () => {
      getDrawing(username, drawingId)
        .then(drawingData => {
          window.NS.singletons.refs.setDrawingRef(getDrawingRef(drawingId));
          this.onSelected(drawingData);
        })
        .catch(err => {
          console.log('err: ', err);
        });
    };

    const onDrawingNotExists = () => {
      window.location.href = window.location.origin;
    };

    drawingExists(username, drawingId)
      .then(exists => {
        if (exists) {
          onDrawingExists();
        } else {
          onDrawingNotExists();
        }
      })
      .catch(err => {
        console.log('err: ', err);
      });
  }

  initFromScratch(username) {
    this.onExistingDrawingClickBound = this.onExistingDrawingClick.bind(this);
    // this.onNewDrawingClickBound = this.onNewDrawingClick.bind(this);
    this.onDeleteDrawingBound = this.onDeleteDrawing.bind(this);

    this.onNewProjectSaveBound = this.onNewProjectSave.bind(this);
    this.onNewProjectCancelBound = this.onNewProjectCancel.bind(this);

    

    const getData = () => {
      // const promises = [getDrawingsData(username), getGenericDrawingsData()];
      // return Promise.all(promises);
      return getDrawingsData(username);
    }

    getData()
      .then((resp) => {
        // const [drawings, genericDrawings] = resp;
        this.drawings = resp;
        // this.drawings = drawings;
        // this.genericDrawings = genericDrawings;
        // this.el.innerHTML = getViewHTML(drawings, genericDrawings);
        this.el.innerHTML = getViewHTML(resp);
        this.makeInteractive();
      })
      .catch((err) => {
        console.log('sdfsdf', err);
      });
  }

  makeInteractive() {
    const existingDrawings = this.el.querySelectorAll('.drawings-item');
    existingDrawings.forEach((t) => {
      const deleteBtn = t.querySelector('.delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', this.onDeleteDrawingBound);
      }
      
      t.addEventListener('click', this.onExistingDrawingClickBound);
    });

    const newDrawing = this.el.querySelector('.init-container .touch-el');
    newDrawing.addEventListener('click', () => {
      window.NS.singletons.DialogManager.newProjectDialog.show(this.onNewProjectSaveBound, this.onNewProjectCancelBound);
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
          window.NS.singletons.DialogManager.loaderDialog.hide();
          getDrawingsData(this.username)
            .then((drawingsData) => {
              this.drawings = drawingsData;

              this.el.innerHTML = getViewHTML(this.drawings, this.genericDrawings);
              this.makeInteractive();
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

  onNewProjectSave(title, type) {
    createDrawing({ title, type })
      .then((ref) => {
        window.NS.singletons.DialogManager.newProjectDialog.hide();
        window.NS.singletons.refs.setDrawingRef(ref);
        getDrawingsData(this.username)
            .then((drawingsData) => {
              const drawing = drawingsData[ref.id];
              this.onSelected(drawing);
            });
        
      })
      .catch((e) => {
        window.NS.singletons.DialogManager.newProjectDialog.onError();
        console.log('error', e);
      });
  }

  onNewProjectCancel() {
    window.NS.singletons.DialogManager.newProjectDialog.hide();
  }
}