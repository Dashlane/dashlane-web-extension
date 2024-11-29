import { logEvent } from "../../libs/logs/logEvent";
import {
  Field,
  ItemType,
  UserCopyVaultItemFieldEvent,
  UserDownloadVpnClientEvent,
} from "@dashlane/hermes";
const logUserCopyVaultItemFieldEvent =
  (field: Field.Email | Field.Password, credentialId: string) => () =>
    logEvent(
      new UserCopyVaultItemFieldEvent({
        field,
        itemId: credentialId,
        itemType: ItemType.Credential,
        isProtected: false,
      })
    );
export const logUserCopyEmailEvent = (credentialId: string) =>
  logUserCopyVaultItemFieldEvent(Field.Email, credentialId);
export const logUserCopyPasswordEvent = (credentialId: string) =>
  logUserCopyVaultItemFieldEvent(Field.Password, credentialId);
export const logUserDownloadVpnClient = () =>
  logEvent(new UserDownloadVpnClientEvent({}));
