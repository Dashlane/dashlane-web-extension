import { useEffect } from 'react';
import { AlertSeverity, DialogFooter, jsx, Paragraph, } from '@dashlane/ui-components';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
import useTranslate from 'libs/i18n/useTranslate';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { useInviteLinkData } from 'team/settings/hooks/useInviteLinkData';
import { useGetTeamName } from 'team/hooks/use-get-team-name';
import { MemberAction } from '../types';
const I18N_KEYS = {
    INVITE_LINK_ACTIVATE: 'team_activation_dialog_activate_button',
    INVITE_LINK_NOT_NOW: 'team_activation_dialog_notrightnow_button',
    INVITE_LINK_ACTIVATE_TITLE: 'team_activation_dialog_title',
    INVITE_LINK_ACTIVATE_DESCRIPTION: 'team_activation_dialog_paragrah',
    INVITE_LINK_ACTIVATED_ALERT: 'team_activation_dialog_notification',
};
export const EnableInviteLinkDialog = ({ closeDialog, applyActionOnMembers, }: {
    closeDialog: () => void;
    applyActionOnMembers: (memberAction: MemberAction) => void;
}) => {
    const { translate } = useTranslate();
    const alert = useAlert();
    const { getInviteLinkDataForAdmin, inviteLinkDataForAdmin, createInviteLink, toggleInviteLink, } = useInviteLinkData();
    const teamName = useGetTeamName();
    useEffect(() => {
        getInviteLinkDataForAdmin();
    }, [getInviteLinkDataForAdmin]);
    if (!teamName) {
        return null;
    }
    const handleEnableInviteClick = async () => {
        if (!inviteLinkDataForAdmin?.teamKey) {
            await createInviteLink(teamName);
        }
        else if (inviteLinkDataForAdmin?.disabled) {
            await toggleInviteLink(false);
        }
        alert.showAlert(translate(I18N_KEYS.INVITE_LINK_ACTIVATED_ALERT), AlertSeverity.SUCCESS);
        await getInviteLinkDataForAdmin();
        applyActionOnMembers('shareInviteLink');
    };
    return (<SimpleDialog showCloseIcon={true} isOpen={true} footer={<DialogFooter intent="primary" primaryButtonTitle={translate(I18N_KEYS.INVITE_LINK_ACTIVATE)} primaryButtonOnClick={() => handleEnableInviteClick()} secondaryButtonTitle={translate(I18N_KEYS.INVITE_LINK_NOT_NOW)} secondaryButtonOnClick={closeDialog}/>} onRequestClose={closeDialog} title={translate(I18N_KEYS.INVITE_LINK_ACTIVATE_TITLE)}>
      <Paragraph>
        {translate(I18N_KEYS.INVITE_LINK_ACTIVATE_DESCRIPTION)}
      </Paragraph>
    </SimpleDialog>);
};
