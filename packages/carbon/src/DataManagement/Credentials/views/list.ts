import { curry, defaultTo } from "ramda";
import {
  Credential,
  CredentialItemView,
  IconDataStructure,
} from "@dashlane/communication";
import { dataModelItemView } from "DataManagement/views";
import { getDomainForCredential } from "DataManagement/Credentials/get-domain-for-credential";
const defaultToEmptyString = defaultTo("");
export const itemView = curry(
  (
    getIcon: (credentialUrl: string) => IconDataStructure | undefined,
    credential: Credential
  ): CredentialItemView => {
    return {
      ...dataModelItemView(credential),
      autoProtected: defaultTo(false, credential.AutoProtected),
      domainIcon: getIcon(credential.Url),
      email: defaultToEmptyString(credential.Email),
      login: defaultToEmptyString(credential.Login),
      password: defaultToEmptyString(credential.Password),
      title: defaultToEmptyString(
        credential.Title || getDomainForCredential(credential)
      ),
      url: defaultToEmptyString(credential.Url || credential.UserSelectedUrl),
    };
  }
);
export const listView = (
  getIcon: (credentialUrl: string) => IconDataStructure | undefined,
  credentials: Credential[]
) => {
  const view = itemView(getIcon);
  return credentials.map(view);
};
