import SpaceManager from './LessonManagers/SpaceManager';

export default class LessonManager{
    constructor() {
        this.space = null;
        if (window.NS.singletons.PROJECT_TYPE === window.NS.singletons.TYPES.space.id) {
		    this.space = new SpaceManager();
		}
        
    }
}