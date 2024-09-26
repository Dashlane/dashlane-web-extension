import { Credential } from "@dashlane/communication";
import { getDomainForCredential } from "DataManagement/Credentials/get-domain-for-credential";
export function getCredentialsDisplayTitles(
  credentials: Credential[]
): Map<string, string> {
  const reducer = (
    displayTitles: [string, string][],
    credential: Credential
  ) => {
    const { Id, Title } = credential;
    const title = Title || getDomainForCredential(credential);
    return displayTitles.concat([[Id, title]]);
  };
  const data = credentials.reduce(reducer, []);
  return new Map(data);
}
