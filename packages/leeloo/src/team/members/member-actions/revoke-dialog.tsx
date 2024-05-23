import { Dialog, jsx, Paragraph } from '@dashlane/design-system';
import { AlertSeverity } from '@dashlane/ui-components';
import { DataStatus } from '@dashlane/framework-react';
import { TeamMemberInfo } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { useIsPersonalSpaceDisabled } from 'libs/hooks/use-is-personal-space-disabled';
import { teamUpdated } from 'libs/carbon/triggers';
import { useAlert } from 'libs/alert-notifications/use-alert';
import TeamPlans from 'libs/api/TeamPlans';
import { getAuth } from 'user';
import { LEE_INCORRECT_AUTHENTICATION, LeeWithStorage } from 'lee';
import { useAlertQueue } from 'team/alerts/use-alert-queue';
import * as actions from './reducer';
import { State } from '..';
const I18N_KEYS = {
    REVOKE_ERROR_MSG: 'team_members_revoke_error_message',
    REVOKE_SUCCESS_MSG: 'team_members_revoke_success_message',
    SINGLE: {
        REVOKE_DIALOG_CONFIRM: 'team_members_revoke_single_dialog_confirm',
        REVOKE_DIALOG_CANCEL: 'team_members_revoke_single_dialog_cancel',
        REVOKE_DIALOG_MSG: 'team_members_revoke_single_dialog_message',
        REVOKE_DIALOG_MSG_B2B_ONLY: 'team_members_revoke_single_dialog_message_b2b_only',
        REVOKE_DIALOG_TITLE: 'team_members_revoke_single_dialog_title',
    },
    MULTIPLE: {
        REVOKE_DIALOG_CONFIRM: 'team_members_remove_multiple_dialog_confirm',
        REVOKE_DIALOG_CANCEL: 'team_members_revoke_multiple_dialog_cancel',
        REVOKE_DIALOG_MSG: 'team_members_revoke_multiple_dialog_message',
        REVOKE_DIALOG_MSG_B2B_ONLY: 'team_members_revoke_multiple_dialog_message_b2b_only',
        REVOKE_DIALOG_TITLE: 'team_members_remove_multiple_dialog_title',
    },
};
export const RevokeDialog = ({ lee, closeDialog, selectedMembers, }: {
    lee: LeeWithStorage<State>;
    closeDialog: () => void;
    selectedMembers: TeamMemberInfo[];
}) => {
    const { translate } = useTranslate();
    const alert = useAlert();
    const { reportTACError } = useAlertQueue();
    const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
    const revokeMembers = async () => {
        closeDialog();
        const auth = getAuth(lee.globalState);
        if (!auth) {
            reportTACError(new Error(LEE_INCORRECT_AUTHENTICATION));
            return;
        }
        const { teamId } = auth;
        if (!teamId) {
            return;
        }
        try {
            const memberLogins = selectedMembers.map((m) => m.login);
            const { content: { removedMembers, unproposedMembers, refusedMembers }, } = await new TeamPlans().revokeMembers({
                auth,
                memberLogins,
            });
            const acceptedMembers = Object.keys({
                ...removedMembers,
                ...unproposedMembers,
            });
            acceptedMembers.forEach((acceptedLogin) => {
                const member = selectedMembers.find((m) => m.login === acceptedLogin);
                lee.dispatch(actions.userRevokedSingleMember(member));
            });
            const refusedLogins = Object.keys(refusedMembers);
            refusedLogins.forEach((refusedLogin) => {
                const member = selectedMembers.find((m) => m.login === refusedLogin);
                if (!member) {
                    throw new Error(`member '${refusedLogin}' not found in members list`);
                }
                else {
                    alert.showAlert(translate(I18N_KEYS.REVOKE_ERROR_MSG), AlertSeverity.ERROR);
                }
                lee.dispatch(actions.userRevokedSingleMemberFailed(member));
            });
            if (acceptedMembers.length) {
                alert.showAlert(translate(I18N_KEYS.REVOKE_SUCCESS_MSG, {
                    count: acceptedMembers.length,
                }), AlertSeverity.SUCCESS);
                await teamUpdated({
                    teamId,
                    action: 'memberRevoked',
                    users: acceptedMembers,
                });
            }
        }
        catch (error) {
            reportTACError(error);
        }
    };
    const isSingle = selectedMembers.length === 1;
    const isPersonalSpaceEnabled = isPersonalSpaceDisabled.status === DataStatus.Success
        ? !isPersonalSpaceDisabled.isDisabled
        : true;
    const MULTIPLICITY_I18N_KEYS = isSingle
        ? I18N_KEYS.SINGLE
        : I18N_KEYS.MULTIPLE;
    return (<Dialog isOpen={true} onClose={closeDialog} isDestructive actions={{
            primary: {
                children: translate(MULTIPLICITY_I18N_KEYS.REVOKE_DIALOG_CONFIRM),
                onClick: revokeMembers,
            },
            secondary: {
                children: translate(MULTIPLICITY_I18N_KEYS.REVOKE_DIALOG_CANCEL),
                onClick: closeDialog,
            },
        }} closeActionLabel={''} title={isSingle
            ? translate(I18N_KEYS.SINGLE.REVOKE_DIALOG_TITLE)
            : translate(I18N_KEYS.MULTIPLE.REVOKE_DIALOG_TITLE, {
                count: selectedMembers.length,
            })}>
      
      <Paragraph className="automation-tests-revoke-member-dialog-content">
        {isSingle
            ? translate(isPersonalSpaceEnabled
                ? I18N_KEYS.SINGLE.REVOKE_DIALOG_MSG
                : I18N_KEYS.SINGLE.REVOKE_DIALOG_MSG_B2B_ONLY, {
                username: selectedMembers[0].login || selectedMembers[0].name,
            })
            : translate(isPersonalSpaceEnabled
                ? I18N_KEYS.MULTIPLE.REVOKE_DIALOG_MSG
                : I18N_KEYS.MULTIPLE.REVOKE_DIALOG_MSG_B2B_ONLY)}
      </Paragraph>
    </Dialog>);
};
