import { useState } from "react";
import {
  RecipientType,
  RecipientTypes,
  SharedAccessMember,
} from "@dashlane/sharing-contracts";
import { Badge } from "@dashlane/design-system";
import { Avatar } from "../../libs/dashlane-style/avatar/avatar";
import { DetailedItem } from "../../libs/dashlane-style/detailed-item";
import { DisabledButtonWithTooltip } from "../../libs/dashlane-style/buttons/DisabledButtonWithTooltip";
import UserGroupLogo from "../../libs/dashlane-style/user-group-logo";
import { useUserLoginStatus } from "../../libs/carbon/hooks/useUserLoginStatus";
import useTranslate from "../../libs/i18n/useTranslate";
import { SharedAccessCancel } from "./shared-access-cancel";
import { MemberPermissionPlusRevoke } from "./edit-permission";
import { CancelState } from "./types";
export interface SharedRecipientProps {
  vaultItemId: string;
  isAdmin: boolean;
  onUserSelected?: (userId: string) => void;
  openEditPermissionsDialog: (
    recipient: SharedAccessMember,
    permission: MemberPermissionPlusRevoke,
    recipientType?: RecipientType
  ) => void;
  member: SharedAccessMember;
}
const I18N_KEYS = {
  CANCEL: "webapp_shared_access_cancel",
  CANCEL_INVITE: "webapp_shared_access_cancel_invitation",
  COLLECTION_TOOLTIP: "webapp_sharing_collection_access_description_tooltip",
  EDIT_BUTTON: "webapp_shared_access_edit_permissions",
  FULL_RIGHTS: "webapp_sharing_permissions_full_rights",
  LIMITED_RIGHTS: "webapp_sharing_permissions_limited_rights",
  PENDING: "webapp_shared_access_pending_invitation",
  YOU: "webapp_shared_access_you_badge",
};
export const SharedAccessRecipient = ({
  vaultItemId,
  onUserSelected,
  openEditPermissionsDialog,
  member,
  isAdmin,
}: SharedRecipientProps) => {
  const [cancelStatus, setCancelStatus] = useState<CancelState | null>(null);
  const currentUserId = useUserLoginStatus()?.login;
  const { translate } = useTranslate();
  if (cancelStatus === CancelState.Success) {
    return null;
  }
  const { permission, status, recipientType } = member;
  const isCurrentUser = currentUserId === member.recipientId;
  const canShowInfoAction = isAdmin && currentUserId !== member.recipientId;
  const isStatusPending = status === "pending";
  const infoAction = isStatusPending ? (
    <SharedAccessCancel
      recipientId={member.recipientId}
      vaultItemId={vaultItemId}
      cancelStatus={cancelStatus}
      setCancelStatus={setCancelStatus}
    />
  ) : (
    <DisabledButtonWithTooltip
      disabled={!isAdmin}
      icon="ActionEditOutlined"
      layout="iconLeading"
      intensity="supershy"
      onClick={() => {
        if (onUserSelected) {
          onUserSelected(member.recipientId);
        }
        openEditPermissionsDialog(member, permission, recipientType);
      }}
      content={translate(I18N_KEYS.COLLECTION_TOOLTIP)}
      tooltipSx={{ textWrap: "wrap", maxWidth: "240px" }}
      size="small"
    >
      {translate(I18N_KEYS.EDIT_BUTTON)}
    </DisabledButtonWithTooltip>
  );
  return (
    <li
      key={member.recipientId}
      sx={{
        alignItems: "center",
        display: "flex",
        minHeight: "48px",
        position: "relative",
      }}
    >
      <DetailedItem
        infoAction={canShowInfoAction ? infoAction : null}
        logo={
          member.recipientType === RecipientTypes.Group ? (
            <UserGroupLogo />
          ) : (
            <Avatar email={member.recipientName} size={36} />
          )
        }
        title={member.recipientName}
        permissionBadge={
          <Badge
            mood={permission === "admin" ? "brand" : "danger"}
            label={translate(
              permission === "admin"
                ? I18N_KEYS.FULL_RIGHTS
                : I18N_KEYS.LIMITED_RIGHTS
            )}
          />
        }
        disabled={cancelStatus === CancelState.Loading}
        titleLogo={
          isCurrentUser ? (
            <Badge
              label={translate(I18N_KEYS.YOU).toUpperCase()}
              layout="labelOnly"
              sx={{ marginLeft: "4px" }}
            />
          ) : null
        }
      />
    </li>
  );
};
