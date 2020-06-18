import VerificationDialog from './verification-dialog';
import Loader from './loader';
import NewProjectDialog from './new-project';

export default class DialogManager{
    constructor(parentEl) {

        this.verificationDialog = new VerificationDialog(parentEl);
        this.loaderDialog = new Loader(parentEl);
        this.newProjectDialog = new NewProjectDialog(parentEl);

    }
}