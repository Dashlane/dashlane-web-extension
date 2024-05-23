import { Fragment } from 'react';
import { SelectDropdownMenu } from '@dashlane/ui-components';
import { jsx, Paragraph, ThemeUIStyleObject } from '@dashlane/design-system';
import { Permission, SharedCollectionUserOrGroupView, Status, } from '@dashlane/sharing-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { useCollectionSharingStatus } from 'webapp/paywall/paywall/collection-sharing';
import { PaywalledCollectionRole } from 'webapp/sharing-invite/components/paywalled-collection-role';
import { MemberToConfirmType } from './member-row';
const I18N_KEYS = {
    MANAGER_LABEL: 'webapp_sharing_invite_item_select_dropdown_manager_label',
    MANAGER_DESCRIPTION: 'webapp_sharing_invite_item_select_dropdown_manager_description',
    MANAGER_UPGRADE: 'webapp_sharing_invite_item_select_dropdown_manager_upgrade',
    EDITOR_LABEL: 'webapp_sharing_invite_item_select_dropdown_editor_label',
    EDITOR_DESCRIPTION: 'webapp_sharing_invite_item_select_dropdown_editor_description',
    REVOKE_DESCRIPTION: 'webapp_shared_access_item_select_dropdown_revoke_description',
    REVOKE_BUTTON: 'webapp_sharing_collection_access_dialog_revoke_button',
    REVOKE_INVITE_BUTTON: 'webapp_sharing_collection_access_dialog_revoke_invite_button',
};
type RoleSelectOption = {
    value?: Permission;
    label: JSX.Element;
    isDisabled?: boolean;
};
interface SharedAccessRoleSelectProps {
    isUpdatePending: boolean;
    isUserCollectionManager: boolean;
    isGroup?: boolean;
    isLastGroupMember?: boolean;
    currentUser?: string;
    memberToConfirm: MemberToConfirmType[];
    member: SharedCollectionUserOrGroupView;
    setEditorManagerMemberToConfirm: (member: MemberToConfirmType[]) => void;
}
const paragraphStyle: ThemeUIStyleObject = {
    whiteSpace: 'normal',
};
export const SharedAccessRoleSelect = ({ isUpdatePending, isUserCollectionManager, isGroup, isLastGroupMember, currentUser, memberToConfirm, member, setEditorManagerMemberToConfirm, }: SharedAccessRoleSelectProps) => {
    const { translate } = useTranslate();
    const { isStarterTeam, isAdmin } = useCollectionSharingStatus();
    const isStarterAdmin = isStarterTeam && isAdmin;
    const revokeLabel = member.status === Status.Pending
        ? translate(I18N_KEYS.REVOKE_INVITE_BUTTON)
        : translate(I18N_KEYS.REVOKE_BUTTON);
    const handleSelectedRole = (newRole?: Permission) => {
        const updatedMemberToConfirm = [...memberToConfirm];
        const existingRole = memberToConfirm.find((memberItem) => memberItem.id === member.id);
        if (existingRole) {
            existingRole.permission = newRole;
        }
        else {
            updatedMemberToConfirm.push({
                ...member,
                permission: newRole,
                isGroup,
            });
        }
        setEditorManagerMemberToConfirm(updatedMemberToConfirm);
    };
    const roleOptions: RoleSelectOption[] = [
        {
            value: Permission.Limited,
            label: (<PaywalledCollectionRole labelText={<>
              <Paragraph as="h2">{translate(I18N_KEYS.EDITOR_LABEL)}</Paragraph>
              <Paragraph color="ds.text.neutral.quiet" textStyle="ds.body.helper.regular" sx={paragraphStyle}>
                {translate(I18N_KEYS.EDITOR_DESCRIPTION)}
              </Paragraph>
            </>} isStarterAdmin={isStarterAdmin}/>),
        },
        {
            value: Permission.Admin,
            label: (<PaywalledCollectionRole labelText={<>
              <Paragraph as="h2">
                {translate(I18N_KEYS.MANAGER_LABEL)}
              </Paragraph>
              <Paragraph color="ds.text.neutral.quiet" textStyle="ds.body.helper.regular" sx={paragraphStyle}>
                {translate(I18N_KEYS.MANAGER_DESCRIPTION)}
              </Paragraph>
            </>} upgradeText={<Paragraph color="ds.text.neutral.quiet" textStyle="ds.body.helper.regular" sx={paragraphStyle}>
              {translate(I18N_KEYS.MANAGER_UPGRADE)}
            </Paragraph>} hasIcon={true} isStarterAdmin={isStarterAdmin} memberPermission={member.permission}/>),
            isDisabled: !!isStarterAdmin,
        },
        {
            value: undefined,
            label: (<PaywalledCollectionRole labelText={<>
              <Paragraph as="h2" color="ds.text.danger.quiet">
                {revokeLabel}
              </Paragraph>
              <Paragraph color="ds.text.neutral.quiet" textStyle="ds.body.helper.regular" sx={paragraphStyle}>
                {translate(I18N_KEYS.REVOKE_DESCRIPTION)}
              </Paragraph>
            </>} isStarterAdmin={isStarterAdmin}/>),
        },
    ];
    const selectedRoleOption = roleOptions.find((roleOption) => {
        const foundMemberToConfirm = memberToConfirm.find((m) => m.id === member.id);
        const memberPermission = foundMemberToConfirm
            ? foundMemberToConfirm
            : member.permission;
        return roleOption.value === memberPermission;
    });
    return (<SelectDropdownMenu name="sharedAccessSelect" id="shared-access-select" menuPortalTarget={document.body} isLoading={isUpdatePending} closeMenuOnSelect isSearchable={false} value={selectedRoleOption} options={roleOptions} isDisabled={member.id === currentUser ||
            isLastGroupMember ||
            !isUserCollectionManager} onChange={(newRole) => handleSelectedRole(newRole?.value)} customStyles={{
            menuPortal: (base) => ({
                ...base,
                zIndex: 200,
            }),
            container: (base) => ({
                ...base,
                width: '165px',
            }),
            control: (base) => ({
                ...base,
                marginTop: 0,
                p: {
                    display: 'none',
                },
            }),
            menu: (base) => ({
                ...base,
                width: '308px',
                cursor: 'pointer',
                right: 0,
            }),
        }}/>);
};
