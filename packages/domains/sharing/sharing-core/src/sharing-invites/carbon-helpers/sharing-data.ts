import {
  Credential,
  isCredential,
  Note,
  Secret,
} from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import type { AuditLogDetails, ItemGroupDownload } from "@dashlane/sharing";
import {
  PendingCredentialInvite,
  PendingSharedItemInvite,
  ShareableItemType,
  SharedCollectionUserGroup,
} from "@dashlane/sharing-contracts";
import {
  getSharingItemTypeFromKW,
  getSharingItemTypeShareableItemType,
} from "../../utils/get-sharing-item-type";
export interface ItemGroupDownloadWithCollections extends ItemGroupDownload {
  collections?: SharedCollectionUserGroup[];
}
export const createAuditLogDetails = (
  collectSensitiveDataAuditLogsEnabled: boolean,
  item?: Credential | Note | Secret
): AuditLogDetails | undefined => {
  const captureLog = !!item?.SpaceId && collectSensitiveDataAuditLogsEnabled;
  const isItemCredential = item && isCredential(item);
  const url = isItemCredential ? new ParsedURL(item.Url).getRootDomain() : "";
  const validatedUrl = url ? url : "";
  const domain = isItemCredential ? validatedUrl : undefined;
  const type = getSharingItemTypeFromKW(item);
  return captureLog ? { captureLog, domain, type } : undefined;
};
export const createPendingItemAuditLogDetails = (
  collectSensitiveDataAuditLogsEnabled: boolean,
  item: PendingSharedItemInvite
): AuditLogDetails | undefined => {
  const captureLog = !!item.spaceId && collectSensitiveDataAuditLogsEnabled;
  const isItemCredential = item.itemType === ShareableItemType.Credential;
  let domain;
  if (isItemCredential) {
    const credential: PendingCredentialInvite = {
      ...item,
      itemType: ShareableItemType.Credential,
    };
    domain = new ParsedURL(credential.url).getRootDomain() || "";
  }
  const type = getSharingItemTypeShareableItemType(item.itemType);
  return captureLog ? { captureLog, domain, type } : undefined;
};
