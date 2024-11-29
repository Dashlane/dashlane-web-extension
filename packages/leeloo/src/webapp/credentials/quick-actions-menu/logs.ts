import {
  AnonymousCopyVaultItemFieldEvent,
  DomainType,
  Field,
  hashDomain,
  ItemType,
  UserCopyVaultItemFieldEvent,
} from "@dashlane/hermes";
import { logEvent } from "../../../libs/logs/logEvent";
import { ParsedURL } from "@dashlane/url-parser";
export const sendLogsForCopyVaultItem = async (
  id: string,
  URL: string,
  field: Field,
  isProtected: boolean
) => {
  const credentialURL = new ParsedURL(URL).getRootDomain();
  logEvent(
    new UserCopyVaultItemFieldEvent({
      itemType: ItemType.Credential,
      field,
      itemId: id,
      isProtected,
    })
  );
  logEvent(
    new AnonymousCopyVaultItemFieldEvent({
      itemType: ItemType.Credential,
      field,
      domain: {
        id: await hashDomain(credentialURL),
        type: DomainType.Web,
      },
    })
  );
};
