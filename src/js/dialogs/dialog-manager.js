import VerificationDialog from './verification-dialog';

export default class DialogManager{
    constructor(parentEl) {

        this.verificationDialog = new VerificationDialog(parentEl);

    }

    // onShow(type) {
    //     switch (type) {
    //         case 'VERIFICATION_SHOW':
    //             this.verificationDialog.show();
    //             return;
    //         case 'VERIFICATION_HIDE':
    //             this.verificationDialog.hide();
    //         default:
    //             break;
    //     }
    // }
}