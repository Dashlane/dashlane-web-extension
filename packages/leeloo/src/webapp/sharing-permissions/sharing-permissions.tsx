import React from "react";
import { Paragraph, ThemeUIStyleObject } from "@dashlane/ui-components";
import { mergeSx } from "@dashlane/design-system";
import { Permission } from "@dashlane/sharing-contracts";
import { TranslatorInterface } from "../../libs/i18n/types";
import {
  RadioButton,
  RadioButtonGroup,
} from "../../libs/dashlane-style/radio-button";
const I18N_KEYS_COMMON_KEY = {
  FULL_RIGHTS_LABEL: "webapp_sharing_permissions_full_rights",
  LIMITED_RIGHTS_LABEL: "webapp_sharing_permissions_limited_rights",
};
const I18N_COLLECTION_KEY = {
  FULL_RIGHTS_DETAIL_PERMISSION:
    "webapp_sharing_collection_permissions_full_rights_detail",
  LIMITED_RIGHTS_DETAIL_PERMISSION:
    "webapp_sharing_collection_permissions_limited_rights_detail",
  REVOKE_LABEL: "webapp_sharing_collection_permissions_revoke",
  REVOKE_DISABLED_DETAIL_PERMISSION:
    "webapp_sharing_collection_permissions_revoke_disabled_detail",
  REVOKE_DETAIL_PERMISSION:
    "webapp_sharing_collection_permissions_revoke_detail",
};
const I18N_ITEM_KEY = {
  FULL_RIGHTS_DETAIL_PERMISSION:
    "webapp_sharing_permissions_full_rights_detail",
  LIMITED_RIGHTS_DETAIL_PERMISSION:
    "webapp_sharing_permissions_limited_rights_detail",
  REVOKE_DISABLED_DETAIL_PERMISSION:
    "webapp_sharing_collection_permissions_revoke_disabled_detail",
  REVOKE_LABEL: "webapp_sharing_permissions_revoke",
  REVOKE_DETAIL_PERMISSION: "webapp_sharing_permissions_revoke_detail",
};
export interface Props {
  canRevoke?: boolean;
  loading?: boolean;
  isCollectionItemPermission: boolean;
  shouldRevokeBeDisabled?: boolean;
  onSelectPermission: (permission: Permission) => void;
  permission: Permission | "revoke";
  translate: TranslatorInterface;
}
const permissionTitleSx: ThemeUIStyleObject = {
  marginBottom: "8px",
  fontWeight: 600,
};
export const SharingPermissions = (props: Props) => {
  const {
    isCollectionItemPermission,
    shouldRevokeBeDisabled,
    canRevoke,
    loading,
    onSelectPermission,
    permission,
    translate,
  } = props;
  const handleChange = (event: React.FormEvent<HTMLInputElement>) =>
    onSelectPermission(event.currentTarget.value as Permission);
  const translationKey = isCollectionItemPermission
    ? I18N_COLLECTION_KEY
    : I18N_ITEM_KEY;
  return (
    <RadioButtonGroup
      disabled={loading}
      groupName="permission"
      value={permission}
      onChange={handleChange}
    >
      <RadioButton value="admin">
        <div
          sx={mergeSx([permissionTitleSx, { color: "ds.text.neutral.catchy" }])}
        >
          {translate(I18N_KEYS_COMMON_KEY.FULL_RIGHTS_LABEL)}
        </div>
        <Paragraph color="ds.text.neutral.quiet" size="x-small">
          {translate(translationKey.FULL_RIGHTS_DETAIL_PERMISSION)}
        </Paragraph>
      </RadioButton>
      <RadioButton value="limited">
        <div
          sx={mergeSx([permissionTitleSx, { color: "ds.text.neutral.catchy" }])}
        >
          {translate(I18N_KEYS_COMMON_KEY.LIMITED_RIGHTS_LABEL)}
        </div>
        <Paragraph color="ds.text.neutral.quiet" size="x-small">
          {translate(translationKey.LIMITED_RIGHTS_DETAIL_PERMISSION)}
        </Paragraph>
      </RadioButton>
      {canRevoke ? (
        <RadioButton value="revoke" disabled={shouldRevokeBeDisabled}>
          <div
            sx={mergeSx([permissionTitleSx, { color: "ds.text.danger.quiet" }])}
          >
            {translate(translationKey.REVOKE_LABEL)}
          </div>
          {shouldRevokeBeDisabled ? (
            <Paragraph color="ds.text.neutral.quiet" size="x-small">
              {translate(translationKey.REVOKE_DISABLED_DETAIL_PERMISSION)}
            </Paragraph>
          ) : (
            <Paragraph color="ds.text.neutral.quiet" size="x-small">
              {translate(translationKey.REVOKE_DETAIL_PERMISSION)}
            </Paragraph>
          )}
        </RadioButton>
      ) : null}
    </RadioButtonGroup>
  );
};
