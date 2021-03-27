import VerificationDialog from './verification-dialog';
import Loader from './loader';
import NewProjectDialog from './new-project';
import SaveDialog from './save-dialog';

export default class DialogManager{
    constructor(parentEl, canShowSaveDialog) {

        this.verificationDialog = new VerificationDialog(parentEl);
        this.loaderDialog = new Loader(parentEl);
        this.newProjectDialog = new NewProjectDialog(parentEl);
        this.saveDialog = new SaveDialog(parentEl, canShowSaveDialog);

        this._dialogs = [
            this.verificationDialog,
            this.loaderDialog,
            this.newProjectDialog,
            this.saveDialog
        ]

    }

    hideAll() {
        this._dialogs.forEach(t => t.hide());
    }
}