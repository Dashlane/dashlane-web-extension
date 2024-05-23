import { useState } from 'react';
import { Recipient } from '@dashlane/communication';
import { Badge, jsx } from '@dashlane/design-system';
import { Avatar } from 'libs/dashlane-style/avatar/avatar';
import { DetailedItem } from 'libs/dashlane-style/detailed-item';
import { DisabledButtonWithTooltip } from 'libs/dashlane-style/buttons/DisabledButtonWithTooltip';
import UserGroupLogo from 'libs/dashlane-style/user-group-logo';
import { useUserLoginStatus } from 'libs/carbon/hooks/useUserLoginStatus';
import useTranslate from 'libs/i18n/useTranslate';
import { SharedAccessCancel } from './shared-access-cancel';
import { MemberPermissionPlusRevoke } from './edit-permission';
import { CancelState } from './types';
import { memberToRecipient } from './helpers';
import { RecipientTypes, SharedAccessMember, } from '@dashlane/sharing-contracts';
export interface SharedRecipientProps {
    itemGroupId: string;
    isAdmin: boolean;
    openEditPermissionsDialog: (recipient: Recipient, permission: MemberPermissionPlusRevoke) => void;
    member: SharedAccessMember;
}
const I18N_KEYS = {
    CANCEL: 'webapp_shared_access_cancel',
    CANCEL_INVITE: 'webapp_shared_access_cancel_invitation',
    COLLECTION_TOOLTIP: 'webapp_sharing_collection_access_description_tooltip',
    EDIT_BUTTON: 'webapp_shared_access_edit_permissions',
    FULL_RIGHTS: 'webapp_sharing_permissions_full_rights',
    LIMITED_RIGHTS: 'webapp_sharing_permissions_limited_rights',
    PENDING: 'webapp_shared_access_pending_invitation',
    YOU: 'webapp_shared_access_you_badge',
};
const constructSecondaryText = (member: SharedAccessMember) => {
    const { status, permission } = member;
    const acceptedString = permission === 'admin' ? I18N_KEYS.FULL_RIGHTS : I18N_KEYS.LIMITED_RIGHTS;
    if (status === 'pending') {
        return I18N_KEYS.PENDING;
    }
    else if (status === 'accepted') {
        return acceptedString;
    }
    return '';
};
export const SharedAccessRecipient = ({ itemGroupId, openEditPermissionsDialog, member, isAdmin, }: SharedRecipientProps) => {
    const [cancelStatus, setCancelStatus] = useState<CancelState | null>(null);
    const currentUserId = useUserLoginStatus()?.login;
    const { translate } = useTranslate();
    if (cancelStatus === CancelState.Success) {
        return null;
    }
    const { permission, status } = member;
    const isCurrentUser = currentUserId === member.recipientId;
    const canShowInfoAction = isAdmin && currentUserId !== member.recipientId;
    const isStatusPending = status === 'pending';
    const infoAction = isStatusPending ? (<SharedAccessCancel recipientId={member.recipientId} itemGroupId={itemGroupId} cancelStatus={cancelStatus} setCancelStatus={setCancelStatus}/>) : (<DisabledButtonWithTooltip disabled={member.recipientType === RecipientTypes.Collection} icon="ActionEditOutlined" layout="iconLeading" intensity="supershy" onClick={() => openEditPermissionsDialog(memberToRecipient(member), permission)} content={translate(I18N_KEYS.COLLECTION_TOOLTIP)} tooltipSx={{ textWrap: 'wrap', maxWidth: '240px' }} size="small">
      {translate(I18N_KEYS.EDIT_BUTTON)}
    </DisabledButtonWithTooltip>);
    return (<li key={member.recipientId} sx={{
            alignItems: 'center',
            display: 'flex',
            minHeight: '48px',
            position: 'relative',
        }}>
      <DetailedItem infoAction={canShowInfoAction ? infoAction : null} logo={member.recipientType === RecipientTypes.Group ? (<UserGroupLogo />) : (<Avatar email={member.recipientName} size={36}/>)} text={constructSecondaryText(member)
            ? translate(constructSecondaryText(member))
            : translate('webapp_shared_permissions_dialog_revoke_success_title')} title={member.recipientName} disabled={cancelStatus === CancelState.Loading} titleLogo={isCurrentUser ? (<Badge label={translate(I18N_KEYS.YOU).toUpperCase()} layout="labelOnly" sx={{ marginLeft: '4px' }}/>) : null}/>
    </li>);
};
