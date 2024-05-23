import * as React from 'react';
import { Dialog, DialogBody, DialogFooter, DialogTitle, } from '@dashlane/ui-components';
import LoadingSpinner from 'libs/dashlane-style/loading-spinner';
import { openUrl } from 'libs/external-urls';
import useTranslate from 'libs/i18n/useTranslate';
import { getInviteDialogErrorText } from 'team/invite-result-dialog/error-text';
import { InviteErrors, REFUSED_MEMBER_KEYS, } from 'team/invite-result-dialog/types';
import { useTeamSettings } from 'team/settings/hooks/useTeamSettings';
import { DASHLANE_SUPPORT } from 'team/urls';
import crossImage from './cross.svg';
import styles from './styles.css';
import tickImage from './tick.svg';
interface InviteResultDialogProps {
    teamId: number | null;
    isOpen: boolean;
    invitedMembers: {
        [k: string]: boolean;
    };
    refusedMembers: {
        [k: string]: string;
    };
    onClose: () => void;
}
export type InvitePartialSuccessState = Pick<InviteResultDialogProps, 'invitedMembers' | 'refusedMembers'> & {
    show: boolean;
};
const emptyInvitePartialSuccessState: InvitePartialSuccessState = {
    invitedMembers: {},
    refusedMembers: {},
    show: false,
};
export const useInviteResultPartialSuccess = () => {
    const [invitePartialSuccessState, setInvitePartialSuccessState] = React.useState<InvitePartialSuccessState>(emptyInvitePartialSuccessState);
    const handleInvitationResultClosed = () => {
        setInvitePartialSuccessState(emptyInvitePartialSuccessState);
    };
    return {
        invitePartialSuccessState,
        setInvitePartialSuccessState,
        handleInvitationResultClosed,
    };
};
const I18N_KEYS = {
    TITLE: 'team_invite_result_dialog_title',
    SUCCESSFUL_INVITES_RATE: 'team_invite_result_dialog_successful_invites_rate',
    REFUSED_MEMBER_LIST_TITLE: 'team_invite_result_dialog_refused_member_list_title',
    HELP_CENTER: 'team_invite_result_dialog_button_help_center',
    OK_GOT_IT: 'team_invite_result_dialog_button_ok',
    CLOSE: '_common_dialog_dismiss_button',
};
interface MemberErrorInformation {
    email: string;
    key?: string;
    errorType: string;
}
export const InviteResultDialog = ({ teamId, isOpen, invitedMembers, refusedMembers, onClose, }: InviteResultDialogProps) => {
    const { translate } = useTranslate();
    const [refusedMembersByType, setRefusedMembersByType] = React.useState<MemberErrorInformation[]>([]);
    const [refusedMembersByCopy, setRefusedMembersByCopy] = React.useState<MemberErrorInformation[]>([]);
    const invitedMembersCount = Object.keys(invitedMembers).length;
    const refusedMembersCount = Object.keys(refusedMembers).length;
    const { teamSettings, teamSettingsLoading } = useTeamSettings(teamId);
    const ssoEnabled = teamSettings?.ssoEnabled;
    React.useEffect(() => {
        if (teamSettingsLoading) {
            return;
        }
        const refusedMembersIndexedByType: MemberErrorInformation[] = [];
        const refusedMembersIndexedByCopy: MemberErrorInformation[] = [];
        Object.keys(refusedMembers).forEach((memberEmail: string) => {
            const inviteErrorType = refusedMembers[memberEmail];
            if (inviteErrorType === InviteErrors.SSO_ALREADY_ACTIVATED &&
                !ssoEnabled) {
                refusedMembersIndexedByCopy.push({
                    email: memberEmail,
                    key: REFUSED_MEMBER_KEYS.INVITE_RESTRICTED,
                    errorType: inviteErrorType,
                });
                return;
            }
            else if (inviteErrorType === InviteErrors.USER_HAS_MASTER_PASSWORD &&
                ssoEnabled) {
                refusedMembersIndexedByCopy.push({
                    email: memberEmail,
                    key: REFUSED_MEMBER_KEYS.PRE_EXISTING_MP_USER,
                    errorType: inviteErrorType,
                });
                return;
            }
            refusedMembersIndexedByType.push({
                email: memberEmail,
                errorType: inviteErrorType,
            });
        });
        setRefusedMembersByType(refusedMembersIndexedByType);
        setRefusedMembersByCopy(refusedMembersIndexedByCopy);
    }, [teamSettingsLoading, ssoEnabled, refusedMembers]);
    return (<Dialog closeIconName={translate(I18N_KEYS.CLOSE)} isOpen={isOpen} onClose={onClose} ariaDescribedby="refusedList">
      <DialogTitle title={translate(I18N_KEYS.TITLE)}/>
      <DialogBody>
        {teamSettingsLoading ? (<LoadingSpinner size={30}/>) : (<>
            {invitedMembersCount ? (<div className={styles.successfulInvitesRatio}>
                <img src={tickImage} className={styles.irDialogIcon}/>
                <span className={styles.inviteResultDialogHeader}>
                  {translate(I18N_KEYS.SUCCESSFUL_INVITES_RATE, {
                    proposedMembers: invitedMembersCount + refusedMembersCount,
                    invitedMembers: invitedMembersCount,
                })}
                </span>
              </div>) : null}
            <div className={styles.refusedMemberListTitle}>
              <img src={crossImage} className={styles.irDialogIcon}/>
              <span id="refusedList" className={styles.inviteResultDialogHeader}>
                {translate(I18N_KEYS.REFUSED_MEMBER_LIST_TITLE, {
                count: refusedMembersCount,
            })}
              </span>
            </div>
            <ul className={styles.refusedMemberList}>
              {refusedMembersByType.map((error) => (<li className={styles.refusedMember} key={error.email}>
                  {error.email}
                  <span className={styles.reason}>
                    {': '}
                    {REFUSED_MEMBER_KEYS[error.errorType.toUpperCase()]
                    ? translate(REFUSED_MEMBER_KEYS[error.errorType.toUpperCase()])
                    : translate.markup(REFUSED_MEMBER_KEYS.GENERIC_ERROR, { helpCenter: DASHLANE_SUPPORT }, { linkTarget: '_blank' })}
                  </span>
                </li>))}
              {refusedMembersByCopy.map((error) => (<li className={styles.refusedMember} key={error.email}>
                  {error.email}
                  <span className={styles.reason}>
                    : {getInviteDialogErrorText(error.key)}
                  </span>
                </li>))}
            </ul>
          </>)}
      </DialogBody>
      <DialogFooter primaryButtonTitle={translate(I18N_KEYS.OK_GOT_IT)} primaryButtonOnClick={onClose} secondaryButtonTitle={translate(I18N_KEYS.HELP_CENTER)} secondaryButtonOnClick={() => openUrl(DASHLANE_SUPPORT)}/>
    </Dialog>);
};
export default InviteResultDialog;
