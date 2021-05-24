import SpaceManager from './LessonManagers/SpaceManager';
import AtomConnectionsManager from './LessonManagers/AtomConnectionsManager';
import { default as ChemistryShared } from '../graphicNodes/ChemistryNodes/shared'; 

import ChemistryState from '../graphicNodes/ChemistryNodes/AtomState';

export default class LessonManager{
    constructor() {
        this.space = null;
        if (window.NS.singletons.PROJECT_TYPE === window.NS.singletons.TYPES.space.id) {
		    this.space = new SpaceManager();
		}

        if (window.NS.singletons.PROJECT_TYPE === window.NS.singletons.TYPES.chemistry.id) {
            this.atomConnectionsManager = new AtomConnectionsManager();

            this.shared = new ChemistryShared();

            this.chemistryState = new ChemistryState();


        }
    }

    init(drawing) {
        if (window.NS.singletons.PROJECT_TYPE === window.NS.singletons.TYPES.chemistry.id) {
            this.atomConnectionsManager.init(drawing.doc);
        }
    }
}
