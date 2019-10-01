import { checkUserExists, getDrawings, getDrawingRef, getAllNodesFromAllDrawings } from '../../get';
// import { formatDate } from '../../helpers';
import { createDrawing } from '../../set';

import './index.scss';

export default class DrawingsWindow{
constructor(parentEl, username, onSelected) {

  this.username = username;
  this.drawings = {};
  this.onSelected = onSelected;

  this.el = document.createElement('div');
  this.el.className = 'drawings-window';

  this.onExistingDrawingClickBound = this.onExistingDrawingClick.bind(this);
  // this.onNewDrawingClickBound = this.onNewDrawingClick.bind(this);

  parentEl.appendChild(this.el);

  checkUserExists(username)
  .then((exists) => {
    if (exists) {
      return getDrawings(username);
    } else {
      return Promise.reject('user doesnt exist');
    }
      
  }).then((drawings) => {
    this.drawings = drawings;
    return getAllNodesFromAllDrawings(drawings);
  })
  .then((resp) => {
    for (let i = 0; i < resp.length; i++) {
      const key = Object.keys(resp[i])[0];
      this.drawings[key].nodes = resp[i][key];
    }

    console.log('sdf', resp, this.drawings);

    this.populateView();
  })
  .catch((err) => {
    console.log('err', err);
  });        
}

  populateView() {
    const keys = Object.keys(this.drawings);
    const items = keys.map((t, i) => (`
      <div class="drawings-item">
        <h4>${this.drawings[t].title}</h4>
        <h5>Nodes: ${this.drawings[t].nodes.length}</h5>
        <h5>Last saved: ${new Date(this.drawings[t].timestamp.seconds * 1000)}</h5>
        <div class="click-cover" data-id="${t}"></div>
      </div>
    `)).join('');
    const html = `
      <div class="drawings-outer-content">
        <h4>YOUR DRAWINGS</h4>
        <div class="drawings-window-content-wrapper">
          ${keys.length > 0 ? items : '<h4>NO SAVED DRAWINGS</h4>'}
        </div>
        <div class="new-drawing">
          <div class="init-container">
            <h4>CREATE NEW DRAWING</h4>
          </div>
          <div class="data-container">
            <div class="input-title-container">
              <input type="text" placeholder="Title" />
              <button class="save-title" type="button">Spara</button>
              <button class="cancel-title" type="button">Bakåt</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.el.innerHTML = html;

    const existingDrawings = this.el.querySelectorAll('.drawings-item');
    existingDrawings.forEach((t) => {
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
        window.NS.singletons.refs.setDrawingRef(ref);
        // console.log(ref.id, ref);
        this.onSelected();
      })
      .catch(() => {
        console.log('error');
      });
    });

    const cancelTitle = titleContainer.querySelector('.cancel-title');
    cancelTitle.addEventListener('click', () => {
      console.log('cancel click', this);
      titleContainer.classList.remove('visible');
      input.value = '';
    });
  }

  onExistingDrawingClick(e) {
    const id = e.target.getAttribute('data-id');
    const drawing = this.drawings[id];
    
    console.log('on existing click: ', id, drawing);
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