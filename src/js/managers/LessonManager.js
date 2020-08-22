import SpaceManager from './LessonManagers/SpaceManager';
import AtomConnectionsManager from './LessonManagers/AtomConnectionsManager';
import AtomRulesManager, { ATOM_STATUS } from './LessonManagers/AtomRulesManager';

export default class LessonManager{
    constructor(drawing) {
        this.space = null;
        if (window.NS.singletons.PROJECT_TYPE === window.NS.singletons.TYPES.space.id) {
		    this.space = new SpaceManager();
		}

        if (window.NS.singletons.PROJECT_TYPE === window.NS.singletons.TYPES.chemistry.id) {
            this.atomConnectionsManager = new AtomConnectionsManager(drawing.doc);
            this.atomRulesManager = new AtomRulesManager();
            this.ATOM_STATUS = ATOM_STATUS;
        }
    }
}
