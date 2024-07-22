import {
  Credential,
  DataModelType,
  Note,
  Secret,
} from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import {
  ShareableItemType,
  SharedItem,
  ShareItemFailureReason,
} from "@dashlane/sharing-contracts";
import { ShareItemErrorCode } from "../../common/sharing-items.gateway";
import { ShareItemErrorDetails } from "../../../store/share-items-errors.store";
const mapToShareItemFailureReason = (error: ShareItemErrorCode) => {
  switch (error) {
    case ShareItemErrorCode.SHARED_ITEM_IS_NOT_FOUND:
      return ShareItemFailureReason.ITEM_DOESNT_EXIST;
    case ShareItemErrorCode.INVALID_REVISION:
      return ShareItemFailureReason.INVALID_REVISION;
    default:
      return ShareItemFailureReason.SHARING_FAILED;
  }
};
export const mapToShareItemErrorDetails = (
  error: ShareItemErrorCode,
  vaultItemId: string,
  allVaultItems: Array<Credential | Note | Secret>
): ShareItemErrorDetails => {
  const vaultItem = allVaultItems.find((item) => item.Id === vaultItemId);
  if (!vaultItem) {
    throw new Error("Vault item not found when trying to share");
  }
  const { Id, kwType, Title } = vaultItem;
  const base = {
    id: Id,
    title: Title,
    error: mapToShareItemFailureReason(error),
  };
  if (kwType === DataModelType.KWAuthentifiant) {
    const credential = vaultItem as Credential;
    const domain = new ParsedURL(credential.Url).getRootDomain();
    return {
      ...base,
      type: ShareableItemType.Credential,
      domain,
      text: credential.Email || credential.Login,
    };
  } else if (kwType === DataModelType.KWSecureNote) {
    return {
      ...base,
      type: ShareableItemType.SecureNote,
      color: (vaultItem as Note).Type,
    };
  } else {
    return { ...base, type: ShareableItemType.Secret };
  }
};
export const mapToNoteAttachementsError = (
  note: Note
): ShareItemErrorDetails => {
  const { Id, Title } = note;
  return {
    id: Id,
    title: Title,
    error: ShareItemFailureReason.ITEM_HAS_ATTACHMENTS,
    type: ShareableItemType.SecureNote,
    color: note.Type,
  };
};
export const mapToShareItemModel = (
  sharedItem: SharedItem,
  allVaultItems: Array<Credential | Note | Secret>
) => {
  const vaultItem = allVaultItems.find((item) => item.Id === sharedItem.itemId);
  if (!vaultItem) {
    throw new Error("Vault item not found when trying to share");
  }
  const { kwType } = vaultItem;
  const type =
    kwType === DataModelType.KWAuthentifiant
      ? ShareableItemType.Credential
      : kwType === DataModelType.KWSecureNote
      ? ShareableItemType.SecureNote
      : ShareableItemType.Secret;
  const domain =
    kwType === DataModelType.KWAuthentifiant
      ? new ParsedURL((vaultItem as Credential).Url).getRootDomain()
      : undefined;
  const auditLogData =
    type === ShareableItemType.Credential ? { type, domain } : undefined;
  return {
    itemType: type,
    sharedItemId: sharedItem.sharedItemId,
    revision: sharedItem.revision,
    title: vaultItem.Title,
    auditLogData,
  };
};
export const mapToShareItemLimitedAccessError = (
  vaultItemId: string,
  allVaultItems: Array<Credential | Note | Secret>
): ShareItemErrorDetails => {
  return mapToShareItemErrorDetails(
    ShareItemErrorCode.INSUFFICIENT_PERMISSION_PRIVILEGES,
    vaultItemId,
    allVaultItems
  );
};
