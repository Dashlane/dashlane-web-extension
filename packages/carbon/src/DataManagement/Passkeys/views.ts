import {
  Passkey,
  PasskeyDetailView,
  PasskeyItemView,
} from "@dashlane/communication";
import { dataModelDetailView, dataModelItemView } from "DataManagement/views";
const getPasskeyViewsProperties = (passkey: Passkey) => {
  return {
    credentialId: passkey.CredentialId,
    counter: passkey.Counter,
    itemName: passkey.ItemName,
    keyAlgorithm: passkey.KeyAlgorithm,
    note: passkey.Note,
    privateKey: passkey.PrivateKey,
    rpId: passkey.RpId,
    rpName: passkey.RpName,
    userDisplayName: passkey.UserDisplayName,
    userHandle: passkey.UserHandle,
  };
};
export const detailView = (passkey: Passkey): PasskeyDetailView => ({
  ...dataModelDetailView(passkey),
  ...getPasskeyViewsProperties(passkey),
});
export const itemView = (passkey: Passkey): PasskeyItemView => ({
  ...dataModelItemView(passkey),
  ...getPasskeyViewsProperties(passkey),
});
export const listView = (passkeys: Passkey[]): PasskeyItemView[] =>
  passkeys.map(itemView);
