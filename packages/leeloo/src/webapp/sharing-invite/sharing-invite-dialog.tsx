import { useEffect } from 'react';
import { Dialog, jsx } from '@dashlane/ui-components';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { Origin, PageView } from '@dashlane/hermes';
import { useHasFeatureEnabled } from 'libs/carbon/hooks/useHasFeature';
import { SharingInvite } from 'webapp/sharing-invite/share-invite';
import useTranslate from 'libs/i18n/useTranslate';
import { logPageView } from 'libs/logs/logEvent';
import { Sharing, SharingInviteStep } from 'webapp/sharing-invite/types';
import { allIgnoreClickOutsideClassName } from 'webapp/variables';
const I18N_KEYS = { DISMISS: '_common_dialog_dismiss_button' };
interface SharingInviteDialogProps {
    onDismiss: () => void;
    recipientsOnlyShowSelected?: boolean;
    sharing: Sharing;
    origin: Origin;
}
export const SharingInviteDialog = ({ onDismiss, recipientsOnlyShowSelected, sharing, origin, }: SharingInviteDialogProps) => {
    const { translate } = useTranslate();
    const hasSAEXSendSharing = useHasFeatureEnabled(FEATURE_FLIPS_WITHOUT_MODULE.SAEXSendSharing);
    useEffect(() => {
        logPageView(PageView.SharingCreateMember);
    }, []);
    if (!hasSAEXSendSharing) {
        return null;
    }
    return (<Dialog isOpen onClose={onDismiss} closeIconName={sharing?.step !== SharingInviteStep.Loading
            ? translate(I18N_KEYS.DISMISS)
            : undefined} disableOutsideClickClose modalContentClassName={allIgnoreClickOutsideClassName}>
      <SharingInvite onDismiss={onDismiss} recipientsOnlyShowSelected={recipientsOnlyShowSelected} sharing={sharing} origin={origin}/>
    </Dialog>);
};
