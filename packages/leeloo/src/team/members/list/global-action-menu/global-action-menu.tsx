import { TeamMemberInfo } from '@dashlane/communication';
import { Button, Icon, jsx } from '@dashlane/design-system';
import { DropdownMenu } from '@dashlane/ui-components';
import { useFeatureFlip } from '@dashlane/framework-react';
import { Button as EventButtonLogType, UserClickEvent } from '@dashlane/hermes';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { MemberAction } from 'team/members/types';
import { getPendingUsers } from 'team/members/get-pending-users';
import { useInviteLinkData } from 'team/settings/hooks/useInviteLinkData';
import { downloadTeamMembersCSV } from './download-team-members-csv';
import { FormatedDropdownElement } from './formated-dropdown-element';
const I18N_KEYS = {
    RESEND_INVITES: 'team_members_resend_invite_all',
    SHARE_INVITE_LINK: 'team_members_share_invite_link',
    DOWNLOAD_TEAM_MEMBERS_CSV: 'team_members_download_csv',
    DOWNLOAD_TEAM_MEMBERS_CSV_DESCRIPTION: 'team_members_download_csv_description',
};
interface Props {
    members: TeamMemberInfo[];
    onMembersActionSelect: (actionName: MemberAction, members?: TeamMemberInfo[]) => void;
}
export const GlobalActionMenu = ({ members, onMembersActionSelect }: Props) => {
    const { translate } = useTranslate();
    const { getInviteLinkDataForAdmin } = useInviteLinkData();
    const downloadCSV = () => {
        logEvent(new UserClickEvent({ button: EventButtonLogType.DownloadCsv }));
        downloadTeamMembersCSV(members);
    };
    const resendInvitePendingUsers = () => {
        onMembersActionSelect('reinviteAll', getPendingUsers(members));
    };
    const handleShareInviteLink = async () => {
        const inviteLinkDataForAdmin = await getInviteLinkDataForAdmin();
        const action = !inviteLinkDataForAdmin?.teamKey || inviteLinkDataForAdmin?.disabled
            ? 'enableInviteLink'
            : 'shareInviteLink';
        onMembersActionSelect(action);
    };
    const isTeamSignUpPageEnabled = useFeatureFlip(FEATURE_FLIPS_WITHOUT_MODULE.OnboardingWebTeamsignuppage);
    return (<DropdownMenu sx={{ zIndex: 1001 }} content={[
            <FormatedDropdownElement key="resendInvite" onClick={resendInvitePendingUsers} icon="NotificationOutlined" title={translate(I18N_KEYS.RESEND_INVITES)}/>,
            isTeamSignUpPageEnabled ? (<FormatedDropdownElement key="shareInviteLink" onClick={handleShareInviteLink} icon="ActionCopyOutlined" title={translate(I18N_KEYS.SHARE_INVITE_LINK)}/>) : (false),
            <FormatedDropdownElement key="exportUserCSV" onClick={downloadCSV} icon="DownloadOutlined" title={translate(I18N_KEYS.DOWNLOAD_TEAM_MEMBERS_CSV)} description={translate(I18N_KEYS.DOWNLOAD_TEAM_MEMBERS_CSV_DESCRIPTION)}/>,
        ].filter(Boolean)}>
      <Button id="expand-invite-option" intensity="quiet" mood="neutral" size="medium" layout="iconOnly" sx={{ marginLeft: '16px' }} icon={<Icon name="ActionMoreOutlined" size="medium" color="ds.text.neutral.standard"/>}/>
    </DropdownMenu>);
};
