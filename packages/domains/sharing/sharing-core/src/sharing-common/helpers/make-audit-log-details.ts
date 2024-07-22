import { AuditLogDetails } from "@dashlane/server-sdk/v1";
import { ShareableItemType } from "@dashlane/sharing-contracts";
import { AuditLogData } from "..";
const getItemType = (
  type: ShareableItemType
): "AUTHENTIFIANT" | "SECRET" | "SECURENOTE" => {
  switch (type) {
    case ShareableItemType.Credential:
      return "AUTHENTIFIANT";
    case ShareableItemType.Secret:
      return "SECRET";
    default:
      return "SECURENOTE";
  }
};
export const makeAuditLogDetails = ({
  domain,
  type,
}: AuditLogData): AuditLogDetails => ({
  captureLog: true,
  domain,
  type: getItemType(type),
});
