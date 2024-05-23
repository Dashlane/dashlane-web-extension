import { useEffect } from 'react';
import { AlertSeverity, colors, Dialog, DialogBody, DialogFooter, DialogTitle, jsx, Paragraph, } from '@dashlane/ui-components';
import { CopyButton } from 'libs/dashlane-style/copy-button';
import useTranslate from 'libs/i18n/useTranslate';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { useInviteLinkData } from 'team/settings/hooks/useInviteLinkData';
import { getInviteLinkWithTeamKey } from 'team/urls';
const I18N_KEYS = {
    DIALOG_TITLE: 'team_sharing_invite_dialog_title',
    DIALOG_PARAGRAPH: 'team_sharing_invite_dialog_paragrah',
    COPY_BUTTON: 'team_sharing_invite_dialog_copy_link',
    COPY_SUCCESS_TOAST: 'team_sharing_invite_dialog_copied_notification',
    CLOSE: '_common_dialog_dismiss_button',
};
interface InviteLinkSharingDialogProps {
    showSharingDialog: boolean;
    setShowSharingDialog: (isShowSharingDialogOpen: boolean) => void;
}
export const InviteLinkSharingDialog = ({ showSharingDialog, setShowSharingDialog, }: InviteLinkSharingDialogProps) => {
    const { translate } = useTranslate();
    const { inviteLinkDataForAdmin, getInviteLinkDataForAdmin } = useInviteLinkData();
    const alert = useAlert();
    useEffect(() => {
        getInviteLinkDataForAdmin();
    }, [getInviteLinkDataForAdmin]);
    const handleCopyClick = () => {
        navigator.clipboard.writeText(getInviteLinkWithTeamKey(inviteLinkDataForAdmin?.teamKey));
        alert.showAlert(translate(I18N_KEYS.COPY_SUCCESS_TOAST), AlertSeverity.SUCCESS);
    };
    return (<Dialog closeIconName={translate(I18N_KEYS.CLOSE)} isOpen={showSharingDialog} onClose={() => setShowSharingDialog(false)}>
      <DialogTitle title={translate(I18N_KEYS.DIALOG_TITLE)}/>
      <DialogBody>
        <Paragraph sx={{ marginBottom: '15px' }} color={colors.dashGreen01}>
          {translate(I18N_KEYS.DIALOG_PARAGRAPH)}
        </Paragraph>
        <Paragraph sx={{ marginBottom: '15px', fontWeight: '600' }} color={colors.dashGreen01}>
          {getInviteLinkWithTeamKey(inviteLinkDataForAdmin?.teamKey)}
        </Paragraph>
      </DialogBody>
      <DialogFooter>
        <CopyButton copyValue={getInviteLinkWithTeamKey(inviteLinkDataForAdmin?.teamKey)} buttonText={translate(I18N_KEYS.COPY_BUTTON)} onClick={handleCopyClick}/>
      </DialogFooter>
    </Dialog>);
};
