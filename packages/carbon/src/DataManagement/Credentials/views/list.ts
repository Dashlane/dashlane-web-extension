import { curry, defaultTo } from "ramda";
import {
  Credential,
  CredentialCategory,
  CredentialItemView,
  IconDataStructure,
} from "@dashlane/communication";
import { dataModelItemView } from "DataManagement/views";
import { detailView as categoryDetailView } from "DataManagement/Credentials/views/category";
import { getDomainForCredential } from "DataManagement/Credentials/get-domain-for-credential";
const defaultToEmptyString = defaultTo("");
export const itemView = curry(
  (
    getCategory: (categoryId: string) => CredentialCategory | undefined,
    getIcon: (credentialUrl: string) => IconDataStructure | undefined,
    credential: Credential
  ): CredentialItemView => {
    const category = getCategory(credential.Category);
    return {
      ...dataModelItemView(credential),
      autoProtected: defaultTo(false, credential.AutoProtected),
      category: categoryDetailView(category),
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
  getCategory: (categoryId: string) => CredentialCategory | undefined,
  getIcon: (credentialUrl: string) => IconDataStructure | undefined,
  credentials: Credential[]
) => {
  const view = itemView(getCategory, getIcon);
  return credentials.map(view);
};
