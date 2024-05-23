import { Fragment, useEffect } from 'react';
import { AlertSeverity, DialogFooter, jsx, Paragraph, } from '@dashlane/ui-components';
import { Icon } from '@dashlane/design-system';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
import useTranslate from 'libs/i18n/useTranslate';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { getInviteLinkWithTeamKey } from 'team/urls';
import { useInviteLinkData } from 'team/settings/hooks/useInviteLinkData';
const I18N_KEYS = {
    SHARELINK_TITLE: 'team_memebers_share_link_dialog_title',
    SHARELINK_MSG: 'team_memebers_share_link_dialog_paragraph',
    SHARELINK_BUTTON: 'team_memebers_share_link_dialog_copy_link_button',
    SHARELINK_COPIED: 'team_members_share_invite_link_copied',
};
export const ShareInviteLinkDialog = ({ closeDialog, }: {
    closeDialog: () => void;
}) => {
    const { translate } = useTranslate();
    const alert = useAlert();
    const { inviteLinkDataForAdmin, getInviteLinkDataForAdmin } = useInviteLinkData();
    useEffect(() => {
        getInviteLinkDataForAdmin();
    }, [getInviteLinkDataForAdmin]);
    const inviteLink = getInviteLinkWithTeamKey(inviteLinkDataForAdmin?.teamKey);
    const handleShareInviteClick = async () => {
        await navigator.clipboard.writeText(inviteLink);
        alert.showAlert(translate(I18N_KEYS.SHARELINK_COPIED), AlertSeverity.SUCCESS);
    };
    return (<SimpleDialog showCloseIcon={true} isOpen={true} footer={<DialogFooter intent="primary" primaryButtonTitle={<>
              <Icon name="ActionCopyOutlined" size="medium" color="ds.text.inverse.catchy"/>
              {translate(I18N_KEYS.SHARELINK_BUTTON)}
            </>} primaryButtonOnClick={handleShareInviteClick}/>} onRequestClose={closeDialog} title={translate(I18N_KEYS.SHARELINK_TITLE)}>
      <>
        <Paragraph>{translate(I18N_KEYS.SHARELINK_MSG)}</Paragraph>
        <Paragraph sx={{ marginTop: '16px', fontWeight: '600' }}>
          {inviteLink}
        </Paragraph>
      </>
    </SimpleDialog>);
};
