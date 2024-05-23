import { Fragment } from 'react';
import { Button, Icon, jsx, Paragraph } from '@dashlane/design-system';
import { Permission, SharedCollectionUserOrGroupView, Status, } from '@dashlane/sharing-contracts';
import { FlexContainer } from '@dashlane/ui-components';
import { AvatarWithAbbreviatedText } from 'libs/dashlane-style/avatar/avatar-with-abbreviated-text';
import useTranslate from 'libs/i18n/useTranslate';
import { useUserLoginStatus } from 'libs/carbon/hooks/useUserLoginStatus';
import { SharedAccessRoleSelect } from './shared-access-role-select';
export type MemberToConfirmType = {
    status: Status;
    permission: Permission | undefined;
    label: string;
    id: string;
} & {
    isGroup?: boolean | undefined;
};
export interface MemberRowProps {
    inlineMemberToConfirm?: SharedCollectionUserOrGroupView | null;
    isEditorManagerRoleEnabled: boolean;
    isGroup?: boolean;
    isLastGroupMember?: boolean;
    isUpdatePending: boolean;
    isRevokePending: boolean;
    memberToConfirm: MemberToConfirmType[];
    setInlineMemberToConfirm: (member: SharedCollectionUserOrGroupView | null) => void;
    setMemberToConfirm: (member: (SharedCollectionUserOrGroupView & {
        isGroup?: boolean;
    }) | null) => void;
    setEditorManagerMemberToConfirm: (member: MemberToConfirmType[]) => void;
    isUserCollectionManager: boolean;
    member: SharedCollectionUserOrGroupView;
    revokeMember: (member: SharedCollectionUserOrGroupView, isGroup: boolean) => void;
}
export const MemberRow = ({ isGroup = false, isLastGroupMember = false, isRevokePending, inlineMemberToConfirm, member, revokeMember, isEditorManagerRoleEnabled, setMemberToConfirm, setInlineMemberToConfirm, ...rest }: MemberRowProps) => {
    const currentUser = useUserLoginStatus()?.login;
    const { translate } = useTranslate();
    const hasAcceptedInvite = member.status === 'accepted';
    const isConfirmationRow = inlineMemberToConfirm?.id === member.id;
    const handleRevoke = () => {
        if (hasAcceptedInvite) {
            setMemberToConfirm({ ...member, isGroup });
        }
        else if (isConfirmationRow) {
            revokeMember(member, isGroup);
        }
        else {
            setInlineMemberToConfirm(member);
        }
    };
    return (<FlexContainer flexWrap="nowrap" justifyContent="space-between" sx={{ width: '576px' }}>
      <FlexContainer alignItems="center" flexWrap="nowrap" sx={{ height: '64px', overflow: 'hidden' }}>
        {isGroup ? (<FlexContainer alignItems="center" justifyContent="center" sx={{
                background: 'ds.container.agnostic.neutral.standard',
                border: '1px solid ds.border.neutral.quiet.idle',
                borderRadius: '50%',
                height: '35px',
                width: '35px',
            }}>
            <Icon name="GroupOutlined"/>
          </FlexContainer>) : (<AvatarWithAbbreviatedText email={member.label ?? ''} avatarSize={36} placeholderFontSize={18} placeholderTextType="firstTwoCharacters"/>)}
        <Paragraph color="ds.text.neutral.catchy" textStyle="ds.body.standard.regular" sx={{ ml: '16px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {member.label}
        </Paragraph>
      </FlexContainer>
      <FlexContainer alignItems="center" flexWrap="nowrap" sx={{ height: '64px', overflow: 'hidden', flexShrink: '0' }}>
        {isEditorManagerRoleEnabled ? (<SharedAccessRoleSelect isLastGroupMember={isLastGroupMember} isGroup={isGroup} currentUser={currentUser} member={member} {...rest}/>) : (<>
            {isConfirmationRow ? (<Button intensity="quiet" mood="neutral" onClick={() => setInlineMemberToConfirm(null)} sx={{ ml: '8px' }}>
                {translate('_common_action_cancel')}
              </Button>) : null}
            <Button disabled={member.id === currentUser || isLastGroupMember} intensity={isConfirmationRow ? 'catchy' : 'supershy'} mood={hasAcceptedInvite || isConfirmationRow ? 'danger' : 'brand'} onClick={handleRevoke} sx={{ ml: '8px' }} isLoading={isRevokePending && isConfirmationRow}>
              {hasAcceptedInvite || isConfirmationRow
                ? translate('webapp_sharing_collection_access_dialog_revoke_button')
                : translate('webapp_sharing_collection_access_dialog_revoke_invite_button')}
            </Button>
          </>)}
      </FlexContainer>
    </FlexContainer>);
};
