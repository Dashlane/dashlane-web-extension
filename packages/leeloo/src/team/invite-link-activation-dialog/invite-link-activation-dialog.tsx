import { NotificationName } from '@dashlane/communication';
import { AlertSeverity, colors, Dialog, DialogBody, DialogFooter, DialogTitle, jsx, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { useInviteLinkData } from 'team/settings/hooks/useInviteLinkData';
import { useNotificationInteracted } from 'libs/carbon/hooks/useNotificationStatus';
import { useGetTeamName } from 'team/hooks/use-get-team-name';
const I18N_KEYS = {
    DIALOG_TITLE: 'team_activation_dialog_title',
    DIALOG_PARAGRAPH: 'team_activation_dialog_paragrah',
    NOT_RIGHT_NOW_BUTTON: 'team_activation_dialog_notrightnow_button',
    ACTIVATE_BUTTON: 'team_activation_dialog_activate_button',
    SUCCESS_TOAST: 'team_activation_dialog_notification',
    CANCEL_TOAST: 'team_activation_dialog_cancel_notification',
    CLOSE: '_common_dialog_dismiss_button',
};
interface InviteLinkActivationDialogProps {
    showActivationDialog: boolean;
    setShowActivationDialog: (isActivationDialogOpen: boolean) => void;
    setShowSharingDialog: (isSharingDialogOpen: boolean) => void;
}
export const InviteLinkActivationDialog = ({ showActivationDialog, setShowActivationDialog, setShowSharingDialog, }: InviteLinkActivationDialogProps) => {
    const { toggleInviteLink, createInviteLink, getInviteLinkDataForAdmin } = useInviteLinkData();
    const { setAsInteracted: setActivateLinkInteracted } = useNotificationInteracted(NotificationName.ActivateInviteLink);
    const { translate } = useTranslate();
    const alert = useAlert();
    const teamName = useGetTeamName();
    if (!teamName) {
        return null;
    }
    const handleClickOnActivate = async () => {
        setActivateLinkInteracted?.();
        setShowActivationDialog(false);
        const inviteLinkDataForAdmin = await getInviteLinkDataForAdmin();
        if (!inviteLinkDataForAdmin?.teamKey) {
            await createInviteLink(teamName);
            alert.showAlert(translate(I18N_KEYS.SUCCESS_TOAST), AlertSeverity.SUCCESS);
        }
        else {
            await toggleInviteLink(false);
        }
        setShowSharingDialog(true);
    };
    const handleClickOnNotNow = () => {
        setActivateLinkInteracted?.();
        setShowActivationDialog(false);
        alert.showAlert(translate(I18N_KEYS.CANCEL_TOAST), AlertSeverity.SUBTLE);
    };
    return (<Dialog closeIconName={translate(I18N_KEYS.CLOSE)} isOpen={showActivationDialog} onClose={() => setShowActivationDialog(false)}>
      <DialogTitle title={translate(I18N_KEYS.DIALOG_TITLE)}/>
      <DialogBody>
        <Paragraph sx={{ marginBottom: '15px' }} color={colors.dashGreen01}>
          {translate(I18N_KEYS.DIALOG_PARAGRAPH)}
        </Paragraph>
      </DialogBody>
      <DialogFooter primaryButtonTitle={translate(I18N_KEYS.ACTIVATE_BUTTON)} primaryButtonOnClick={handleClickOnActivate} primaryButtonProps={{ type: 'button' }} secondaryButtonTitle={translate(I18N_KEYS.NOT_RIGHT_NOW_BUTTON)} secondaryButtonOnClick={handleClickOnNotNow}/>
    </Dialog>);
};
