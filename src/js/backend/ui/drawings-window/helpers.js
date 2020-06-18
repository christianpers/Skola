import {
  checkUserExists,
  getDrawings,
  getAllNodesFromAllDrawings,
  getAllGroupsFromAllDrawings,
  getData,
  getGenericDrawings,
  copySnapshot,
  getDrawingsCollectionRef,
  getGenericDrawingsCollectionRef,
} from '../../get';

// const TypeMapping = Object.freeze({
//     'space': 'Rymden',
//     'chemistry': 'Kemi',
// });

export const getFromArr = (arr) => {
    const ret = {};
    for (let i = 0; i < arr.length; i++) {
    const key = Object.keys(arr[i])[0];
    ret[key] = arr[i][key];
    }
    return ret;
}

export const getDate = (timestamp) => {
    const addZeroIfNeeded = (val) => {
    if (val < 10) {
        return `0${val}`;
    }

    return val;
    }
    const d = new Date(timestamp.seconds * 1000);
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = addZeroIfNeeded(Number(new Intl.DateTimeFormat('en', { month: 'numeric' }).format(d)));
    const da = addZeroIfNeeded(Number(new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)));
    const hours = addZeroIfNeeded(d.getHours());
    const min = addZeroIfNeeded(d.getMinutes());
    return `${ye}-${mo}-${da}  ${hours}:${min}`;
}

export const getDrawingsData = (username) => {
    return new Promise((resolve, reject) => {
      checkUserExists(username)
        .then((exists) => {
          if (exists) {
            return getDrawings(username);
          } else {
            resolve([]);
          }
            
        }).then((drawings) => {
          if (drawings.length === 0) {
            resolve({
              groups: [],
              nodes: [],
              drawings: {},
            });
          }
          const collection = getDrawingsCollectionRef();
          return getData(drawings, collection);
        })
        .then((resp) => {
          const { groups, nodes, drawings } = resp;
          const nodesArr = getFromArr(nodes);
          const groupsArr = getFromArr(groups);
          const keys = Object.keys(drawings);
          const finalData = {};
          keys.forEach(t => {
            finalData[t] = { groups: groupsArr[t], nodes: nodesArr[t], drawing: drawings[t] };
          });

          // copyDrawingToGeneric(finalData['RnIyLW9hVCSQxbxtt9Wp'])
          //   .then(() => {
          //     console.log('drawing created');
          //   })
          //   .catch((err) => {
          //     console.log('err copy');
          //   });

          resolve(finalData);
        })
        .catch((err) => {
          console.log('err', err);
          reject(err);
        });
    })
}

export const getGenericDrawingsData = () => {
    return new Promise((resolve, reject) => {
        return getGenericDrawings()
            .then((drawings) => {
                if (drawings.length === 0) {
                resolve({
                    groups: [],
                    nodes: [],
                    drawings: {},
                });
                }
                const collection = getGenericDrawingsCollectionRef();
                return getData(drawings, collection);
            })
            .then((resp) => {
                const { groups, nodes, drawings } = resp;
                const nodesArr = getFromArr(nodes);
                const groupsArr = getFromArr(groups);
                const keys = Object.keys(drawings);
                const finalData = {};
                keys.forEach(t => {
                    finalData[t] = { groups: groupsArr[t], nodes: nodesArr[t], drawing: drawings[t] };
                });

                resolve(finalData);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

const getType = (type) => {
    const types = window.NS.singletons.TYPES;
    return types[type] ? types[type].title : 'Not set';
}

export const getViewHTML = (drawings, genericDrawings) => {
    const getDrawingHTML = (item, t) => {
        return `
            <div class="drawings-item">
                <div class="top-row">
                    <div class="title block-with-pre">
                        <h5>Namn:</h5>
                        <h4>${item.drawing.doc.title}</h4>
                    </div>
                    <div class="type block-with-pre border">
                        <h5>Typ:</h5>
                        <h4>${getType(item.drawing.doc.type)}</h4>
                    </div>
                </div>
                
                <h5>Noder: ${item.nodes.length}</h5>
                <h5>Skapat: ${getDate(item.drawing.doc.timestamp)}</h5>
                <div class="click-cover" data-id="${t}"></div>
                <h5 class="delete-btn" data-id="${t}">Delete</h5>
            </div>
        `;
    };

    const getGenericDrawingHTML = (item, t) => {
        return `
            <div class="drawings-item">
                <div class="top-row">
                    <div class="title block-with-pre">
                        <h5>Namn:</h5>
                        <h4>${item.drawing.doc.title}</h4>
                    </div>
                    <div class="type block-with-pre border">
                        <h5>Typ:</h5>
                        <h4>${getType(item.drawing.doc.type)}</h4>
                    </div>
                </div>
                <h5>Noder: ${item.nodes.length}</h5>
                <h5>Skapat: ${getDate(item.drawing.doc.timestamp)}</h5>
                <div class="click-cover" data-id="${t}" data-drawing-type="generic"></div>
            </div>
        `;
    }
    const getItems = (items, generic) => {
        const keys = Object.keys(items);
        const ret = keys.map((t, i) => (`
            ${generic ? getGenericDrawingHTML(items[t], t) : getDrawingHTML(items[t], t)}
        `)).join('');

        return ret;
    }

    const drawingItems = getItems(drawings);
    const genericDrawingItems = getItems(genericDrawings, true);
    
    const html = `
      <div class="drawings-outer-content">
        <div class="generic-drawings drawings-container">
            <h4>GENERELLA PROJEKT / BOILERPLATES</h4>
            <div class="drawings-window-content-wrapper">
                ${genericDrawingItems}
            </div>
        </div>
        <div class="personal-drawings drawings-container">
            <h4>DINA PROJEKT</h4>
            <div class="drawings-window-content-wrapper">
                ${drawingItems.length > 0 ? drawingItems : '<h4>INGA SPARADE PROJEKT</h4>'}
            </div>
            <div class="new-drawing">
                <div class="init-container">
                    <h4>SKAPA NYTT PROJEKT</h4>
                    <div class="touch-el"></div>
                </div>
            </div>
        </div>
      </div>
    `;

    return html;
}