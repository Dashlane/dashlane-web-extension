import { useEffect } from 'react';
import { Dialog, DialogBody, DialogFooter, DialogTitle, jsx, } from '@dashlane/ui-components';
import { PageView } from '@dashlane/hermes';
import { logPageView } from 'libs/logs/logEvent';
import { openDashlaneUrl } from 'libs/external-urls';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { useRouterGlobalSettingsContext } from 'libs/router';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    CANCEL: 'webapp_sharing_invite_cancel',
    DISMISS: '_common_dialog_dismiss_button',
    LIMIT_REACHED: 'webapp_sharing_invite_free_sharing_limit_reached',
    LIMIT_SUBTITLE: 'webapp_sharing_invite_free_sharing_limit_reached_subtitle',
    UPGRADE: 'webapp_sharing_invite_upgrade_to_premium',
};
export interface Props {
    closeDialog: () => void;
}
export const SharingLimitReachedDialog = ({ closeDialog }: Props) => {
    const accountInfo = useAccountInfo();
    const { routes } = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    useEffect(() => {
        logPageView(PageView.PaywallSharingLimit);
    }, []);
    const goPremium = () => {
        const trackingParams = { type: 'sharing', action: 'goPremium' };
        const upgradeTargetPlanUrl = routes.userGoPremium(accountInfo?.subscriptionCode, 'monthly');
        openDashlaneUrl(upgradeTargetPlanUrl, trackingParams);
    };
    return (<Dialog isOpen onClose={closeDialog} closeIconName={translate(I18N_KEYS.DISMISS)}>
      <DialogTitle title={translate(I18N_KEYS.LIMIT_REACHED)}/>
      <DialogBody>{translate(I18N_KEYS.LIMIT_SUBTITLE)}</DialogBody>
      <DialogFooter secondaryButtonTitle={translate(I18N_KEYS.CANCEL)} secondaryButtonOnClick={closeDialog} secondaryButtonProps={{ type: 'button' }} primaryButtonTitle={translate(I18N_KEYS.UPGRADE)} primaryButtonOnClick={goPremium} primaryButtonProps={{ type: 'button' }}/>
    </Dialog>);
};
