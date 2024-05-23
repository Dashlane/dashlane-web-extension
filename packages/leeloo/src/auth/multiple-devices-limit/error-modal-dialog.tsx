import * as React from 'react';
import { Dialog, DialogBody, DialogFooter, DialogTitle, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useMultipleDevicesLimitReachedStage } from 'auth/multiple-devices-limit/use-multiple-devices-limit-reached-stage';
import { UnlinkMultipleDevicesErrorStageView } from '@dashlane/communication';
const I18N_KEYS = {
    TITLE: 'webapp_login_multiple_devices_limit_error_dialog_title',
    BODY: 'webapp_login_multiple_devices_limit_error_dialog_body',
    TRY_AGAIN: 'webapp_login_multiple_devices_limit_error_dialog_try_again',
    SEE_PREMIUM: 'webapp_login_multiple_devices_limit_error_dialog_see_premium',
    BUTTON_CLOSE_DIALOG: '_common_dialog_dismiss_button',
};
interface ErrorModalProps {
    errorStage: UnlinkMultipleDevicesErrorStageView;
}
export const UnlinkMultipleDevicesErrorModal = ({ errorStage, }: ErrorModalProps) => {
    const { retryPayload, subscriptionCode } = errorStage;
    const { translate } = useTranslate();
    const stage = useMultipleDevicesLimitReachedStage();
    const onHandleOnTryAgain = () => {
        stage.unlinkMultipleDevices(retryPayload);
    };
    const onHandleGoToPremiumPlan = () => {
        stage.onHandleGoToPremiumPlan(subscriptionCode);
    };
    return (<Dialog isOpen={true} onClose={stage.logOut} closeIconName={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG)}>
      <DialogTitle title={translate(I18N_KEYS.TITLE)}/>
      <DialogBody>
        <Paragraph>{translate(I18N_KEYS.BODY)}</Paragraph>
      </DialogBody>
      <DialogFooter primaryButtonTitle={translate(I18N_KEYS.TRY_AGAIN)} primaryButtonOnClick={onHandleOnTryAgain} secondaryButtonTitle={translate(I18N_KEYS.SEE_PREMIUM)} secondaryButtonOnClick={onHandleGoToPremiumPlan}/>
    </Dialog>);
};
