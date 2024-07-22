import {
  Credential,
  isCredential,
  Note,
  Secret,
} from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import type { AuditLogDetails, ItemGroupDownload } from "@dashlane/sharing";
import type { SharedCollectionUserGroup } from "@dashlane/sharing-contracts";
import { getSharingItemTypeFromKW } from "../../utils/get-sharing-item-type";
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
