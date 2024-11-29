import { useState } from "react";
import { useHistory, useLocation } from "../../../../libs/router";
import { equals } from "ramda";
import { Flex } from "@dashlane/design-system";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { GroupRecipient, UserRecipient } from "@dashlane/communication";
import { useModuleQuery } from "@dashlane/framework-react";
import {
  Permission,
  RecipientTypes,
  SharedAccessMember,
  sharingItemsApi,
} from "@dashlane/sharing-contracts";
import {
  Credential,
  Secret,
  SecureNote,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { autofillSettingsApi } from "@dashlane/autofill-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import {
  logSelectCredential,
  logSelectSecureNote,
} from "../../../../libs/logs/events/vault/select-item";
import { useRouterGlobalSettingsContext } from "../../../../libs/router/RouterGlobalSettingsProvider";
import { useCompromisedCredentialsAtRisk } from "../../../credentials/hooks/use-compromised-credentials";
import { CredentialTitle } from "../../../credentials/list/credential-title";
import Row from "../../../list-view/row";
import { EditPermission } from "../../../shared-access/edit-permission";
import { isUserGroup } from "./util";
import { NoteTitle } from "../../../secure-notes/list/note-title";
import { PermissionBadge } from "./permission-badge";
import { EditPermissionButton } from "./edit-permission-button";
import { LockedItemType, UnlockerAction } from "../../../unlock-items/types";
import { useProtectedItemsUnlocker } from "../../../unlock-items/useProtectedItemsUnlocker";
import { SecretTitle } from "../../../secrets/list/secret-title";
import { CollectionTitle } from "./collection-title";
import { SharedItem } from "./items-list";
const I18N_KEYS = {
  FULL_ACCESS_GROUP_ITEM:
    "webapp_sharing_center_panel_items_full_access_info_group_item",
  FULL_ACCESS_GROUP_PASSWORD:
    "webapp_sharing_center_panel_items_full_access_info_group_password",
  FULL_ACCESS_USER_ITEM:
    "webapp_sharing_center_panel_items_full_access_info_user_item",
  FULL_ACCESS_USER_PASSWORD:
    "webapp_sharing_center_panel_items_full_access_info_user_password",
  ITEM_IN_COLLECTION_TOOLTIP:
    "webapp_sharing_collection_access_description_tooltip",
  LIMITED_ACCESS_GROUP_ITEM:
    "webapp_sharing_center_panel_items_limited_access_info_group_item",
  LIMITED_ACCESS_GROUP_PASSWORD:
    "webapp_sharing_center_panel_items_limited_access_info_group_password",
  LIMITED_ACCESS_USER_ITEM:
    "webapp_sharing_center_panel_items_limited_access_info_user_item",
  LIMITED_ACCESS_USER_PASSWORD:
    "webapp_sharing_center_panel_items_limited_access_info_user_password",
  LIMITED_ACCESS_YOU_ITEM:
    "webapp_sharing_center_panel_items_limited_access_info_you_item",
  LIMITED_ACCESS_YOU_PASSWORD:
    "webapp_sharing_center_panel_items_limited_access_info_you_password",
};
export interface CollectionItemView {
  id: string;
  title: string;
  url: string;
  login: string;
  isCollection?: true;
}
interface ItemRowProps {
  rowIndex: number;
  sortedItem: SharedItem;
  entity: UserRecipient | GroupRecipient;
  isCredentialCompromised?: boolean;
  isItemInSharedCollection?: boolean;
  isCollectionList?: boolean;
}
const ItemRowInternal = ({
  rowIndex,
  sortedItem,
  entity,
  isCredentialCompromised = false,
  isItemInSharedCollection = false,
  isCollectionList = false,
}: ItemRowProps) => {
  const { translate } = useTranslate();
  const { pathname } = useLocation();
  const [showEditPermissionDialog, setShowEditPermissionDialog] =
    useState(false);
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const { routes } = useRouterGlobalSettingsContext();
  const history = useHistory();
  const { data: preferencesData } = useModuleQuery(
    autofillSettingsApi,
    "getPreferencesForCredentials",
    {
      credentialIds: [sortedItem.item.id],
    }
  );
  const { data: sharingData } = useModuleQuery(
    sharingItemsApi,
    "getSharingStatusForItem",
    {
      itemId: sortedItem.item.id,
    }
  );
  const { data: sharingPermission } = useModuleQuery(
    sharingItemsApi,
    "getPermissionForItem",
    {
      itemId: sortedItem.item.id,
    }
  );
  const {
    data: sharingPermissionForItemData,
    status: sharingPermissionForItemStatus,
  } = useModuleQuery(sharingItemsApi, "sharedAccessForItem", {
    itemId: sortedItem.item.id,
  });
  if (sharingPermissionForItemStatus !== DataStatus.Success) {
    return null;
  }
  const sharingPermissionFiltered =
    entity.type === "user"
      ? sharingPermissionForItemData?.users?.filter(
          (user) => user.recipientId === entity.alias
        ) ?? []
      : sharingPermissionForItemData?.groups?.filter(
          (group) => group.recipientId === entity.groupId
        ) ?? [];
  const permissionForItem = sharingPermissionFiltered[0]?.permission;
  const isEditPermissionDisabled =
    sharingData?.isShared &&
    sharingPermission?.permission === Permission.Limited;
  const isItemNoteAndLocked =
    sortedItem.type === VaultItemType.SecureNote &&
    (sortedItem.item as SecureNote).isSecured &&
    !areProtectedItemsUnlocked;
  const TitleTag = () => {
    const PERMISSIONS = {
      CREDENTIAL_USER_GROUP_NOT_ADMIN: {
        isCredential: true,
        isUserGroup: true,
        isAdmin: false,
      },
      CREDENTIAL_USER_GROUP_ADMIN: {
        isCredential: true,
        isUserGroup: true,
        isAdmin: true,
      },
      CREDENTIAL_USER_NOT_ADMIN: {
        isCredential: true,
        isUserGroup: false,
        isAdmin: false,
      },
      CREDENTIAL_USER_ADMIN: {
        isCredential: true,
        isUserGroup: false,
        isAdmin: true,
      },
      NOTE_USER_GROUP_NOT_ADMIN: {
        isCredential: false,
        isUserGroup: true,
        isAdmin: false,
      },
      NOTE_USER_GROUP_ADMIN: {
        isCredential: false,
        isUserGroup: true,
        isAdmin: true,
      },
      NOTE_USER_NOT_ADMIN: {
        isCredential: true,
        isUserGroup: true,
        isAdmin: false,
      },
      NOTE_USER_ADMIN: {
        isCredential: false,
        isUserGroup: false,
        isAdmin: true,
      },
    };
    const meta = {
      isCredential: sortedItem.type === VaultItemType.Credential,
      isUserGroup: isUserGroup(entity),
      isAdmin: permissionForItem === Permission.Admin,
    };
    let tooltipText = translate(I18N_KEYS.LIMITED_ACCESS_USER_ITEM);
    switch (true) {
      case equals(PERMISSIONS.CREDENTIAL_USER_GROUP_ADMIN, meta):
        tooltipText = translate(I18N_KEYS.FULL_ACCESS_GROUP_PASSWORD);
        break;
      case equals(PERMISSIONS.CREDENTIAL_USER_GROUP_NOT_ADMIN, meta):
        tooltipText = translate(I18N_KEYS.LIMITED_ACCESS_GROUP_PASSWORD);
        break;
      case equals(PERMISSIONS.CREDENTIAL_USER_ADMIN, meta):
        tooltipText = translate(I18N_KEYS.FULL_ACCESS_USER_PASSWORD);
        break;
      case equals(PERMISSIONS.CREDENTIAL_USER_NOT_ADMIN, meta):
        tooltipText = translate(I18N_KEYS.LIMITED_ACCESS_USER_PASSWORD);
        break;
      case equals(PERMISSIONS.NOTE_USER_GROUP_ADMIN, meta):
        tooltipText = translate(I18N_KEYS.FULL_ACCESS_GROUP_ITEM);
        break;
      case equals(PERMISSIONS.NOTE_USER_GROUP_NOT_ADMIN, meta):
        tooltipText = translate(I18N_KEYS.LIMITED_ACCESS_GROUP_ITEM);
        break;
      case equals(PERMISSIONS.NOTE_USER_ADMIN, meta):
        tooltipText = translate(I18N_KEYS.FULL_ACCESS_USER_ITEM);
        break;
      case equals(PERMISSIONS.NOTE_USER_NOT_ADMIN, meta):
        tooltipText = translate(I18N_KEYS.LIMITED_ACCESS_USER_ITEM);
        break;
      default:
        break;
    }
    return (
      <PermissionBadge
        level={permissionForItem}
        tooltipText={tooltipText}
        tooltipPlacement={rowIndex === 0 ? "bottom" : "right"}
      />
    );
  };
  const getRowData = () => {
    return [
      {
        key: "name",
        content: (
          <Flex justifyContent="space-between" alignItems="center">
            {sortedItem.type === VaultItemType.Credential ? (
              <CredentialTitle
                credential={sortedItem.item as Credential}
                requiresMP={Boolean(
                  preferencesData?.[0]?.requireMasterPassword
                )}
                showTitleIcons={false}
                tag={<TitleTag />}
                isCompromised={isCredentialCompromised}
                isShared={true}
              />
            ) : null}
            {sortedItem.type === VaultItemType.SecureNote ? (
              <NoteTitle
                note={sortedItem.item as SecureNote}
                showTitleIcons={false}
                tag={<TitleTag />}
              />
            ) : null}
            {sortedItem.type === VaultItemType.Secret ? (
              <SecretTitle
                secret={sortedItem.item as Secret}
                isShared={!!sharingPermission?.permission}
                showTitleIcons={false}
                tag={<TitleTag />}
              />
            ) : null}
            {isCollectionList && sortedItem.type === "collection" ? (
              <CollectionTitle
                item={sortedItem.item as CollectionItemView}
                isInGroupList={entity.type !== "user"}
              />
            ) : null}
          </Flex>
        ),
        sxProps: { width: "auto", minHeight: "60px" },
      },
    ];
  };
  const getRowActions = () => {
    let tooltipTitle = "";
    if (isItemInSharedCollection || isCollectionList) {
      tooltipTitle = translate(I18N_KEYS.ITEM_IN_COLLECTION_TOOLTIP);
    } else if (isEditPermissionDisabled) {
      tooltipTitle =
        sortedItem.type === VaultItemType.Credential
          ? translate(I18N_KEYS.LIMITED_ACCESS_YOU_PASSWORD)
          : translate(I18N_KEYS.LIMITED_ACCESS_YOU_ITEM);
    }
    const recipientToMember = (
      recipient: UserRecipient | GroupRecipient
    ): SharedAccessMember => {
      return {
        permission: permissionForItem,
        recipientType:
          recipient.type === "userGroup"
            ? RecipientTypes.Group
            : RecipientTypes.User,
        recipientId:
          recipient.type === "user" ? recipient.alias : recipient.groupId,
        recipientName:
          recipient.type === "user"
            ? recipient.alias
            : recipient.name ?? recipient.groupId,
      };
    };
    return (
      <div sx={{ display: "flex", alignItems: "center", minHeight: "60px" }}>
        <EditPermissionButton
          onClick={() => {
            setShowEditPermissionDialog(true);
          }}
          isDisabled={
            isEditPermissionDisabled ||
            isItemInSharedCollection ||
            isCollectionList
          }
          tooltipTitle={tooltipTitle}
          tooltipPlacement={rowIndex === 0 ? "bottom" : "top"}
        />
        <EditPermission
          isOpen={showEditPermissionDialog}
          onDismiss={() => setShowEditPermissionDialog(false)}
          vaultItemId={sortedItem.item.id}
          recipient={recipientToMember(entity)}
        />
      </div>
    );
  };
  const redirectToPanel = () => {
    const isCredential = sortedItem.type === VaultItemType.Credential;
    const isSecureNote = sortedItem.type === VaultItemType.SecureNote;
    const isSecret = sortedItem.type === VaultItemType.Secret;
    const link = isCollectionList
      ? routes.userCollection(sortedItem.item.id)
      : routes.userVaultItem(
          sortedItem.item.id,
          isCredential
            ? VaultItemType.Credential
            : isSecureNote
            ? VaultItemType.SecureNote
            : VaultItemType.Secret,
          pathname
        );
    if (isCredential) {
      logSelectCredential(sortedItem.item.id);
    } else if (isSecureNote) {
      logSelectSecureNote(sortedItem.item.id);
    } else if (isSecret) {
    }
    if (isItemNoteAndLocked) {
      openProtectedItemsUnlocker({
        action: UnlockerAction.Show,
        itemType: LockedItemType.SecureNote,
        successCallback: () => {
          history.push({
            pathname: link,
            state: {
              previousPage: entity,
            },
          });
        },
      });
    } else {
      history.push({
        pathname: link,
        state: {
          previousPage: entity,
        },
      });
    }
  };
  return (
    <Row
      onClick={redirectToPanel}
      data={getRowData()}
      actions={getRowActions()}
      key={sortedItem.item.id}
      style={{ padding: "0" }}
    />
  );
};
const CredentialRow = (props: ItemRowProps) => {
  const isCredentialCompromised =
    useCompromisedCredentialsAtRisk([props.sortedItem.item.id]).length === 1;
  return (
    <ItemRowInternal
      {...props}
      isCredentialCompromised={isCredentialCompromised}
    />
  );
};
export const ItemRow = (props: ItemRowProps) => {
  return props.sortedItem.type === VaultItemType.Credential ? (
    <CredentialRow {...props} />
  ) : (
    <ItemRowInternal {...props} />
  );
};
