import VerificationDialog from './verification-dialog';
import Loader from './loader';

export default class DialogManager{
    constructor(parentEl) {

        this.verificationDialog = new VerificationDialog(parentEl);
        this.loaderDialog = new Loader(parentEl);

    }
}