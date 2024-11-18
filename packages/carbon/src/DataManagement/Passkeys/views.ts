import {
  AllFieldsPasskey,
  isCloudPasskey,
  Passkey,
  PasskeyDetailView,
  PasskeyItemView,
} from "@dashlane/communication";
import { dataModelDetailView, dataModelItemView } from "DataManagement/views";
const getPasskeyViewsProperties = (passkey: Passkey): AllFieldsPasskey => {
  const commonPart = {
    credentialId: passkey.CredentialId,
    counter: passkey.Counter,
    itemName: passkey.ItemName,
    note: passkey.Note,
    spaceId: passkey.SpaceId,
    rpId: passkey.RpId,
    rpName: passkey.RpName,
    userDisplayName: passkey.UserDisplayName,
    userHandle: passkey.UserHandle,
  };
  if (isCloudPasskey(passkey)) {
    return {
      ...commonPart,
      keyAlgorithm: passkey.KeyAlgorithm,
      cloudCipheringKey: passkey.CloudCipheringKey,
    };
  }
  return {
    ...commonPart,
    keyAlgorithm: passkey.KeyAlgorithm,
    privateKey: passkey.PrivateKey,
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
