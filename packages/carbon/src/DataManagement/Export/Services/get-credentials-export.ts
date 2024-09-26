import { Credential, DataModelType } from "@dashlane/communication";
import { handleSpecialCharacter } from "./handle-special-character";
import {
  formatDataToCSV,
  formatHeader,
  getCollectionsByItemId,
  getItemCollections,
} from "./helpers";
import { PersonalDataVaultItems } from "DataManagement/types";
export function getCredentialsExport(
  personalData: PersonalDataVaultItems
): string {
  const credentialData = personalData.credentials;
  const collections = personalData.collections;
  const collectionsByCredentialId = getCollectionsByItemId(
    collections,
    DataModelType.KWAuthentifiant
  );
  const metaData = [
    { headerKey: "username", dataKey: "Email" },
    { headerKey: "username2", dataKey: "Login" },
    { headerKey: "username3", dataKey: "SecondaryLogin" },
    { headerKey: "title", dataKey: "Title" },
    { headerKey: "password", dataKey: "Password" },
    { headerKey: "note", dataKey: "Note" },
    { headerKey: "url", dataKey: "Url" },
    { headerKey: "category", dataKey: "Category" },
    { headerKey: "otpSecret", dataKey: "OtpSecret" },
  ];
  const filterCredentialData = (credentials: Credential[]) => {
    return credentials.map((credential) => {
      const validUsernames = [
        credential.Email,
        credential.Login,
        credential.SecondaryLogin,
      ].filter((username) => username !== undefined && username !== "");
      const [usernameVal = "", usernameVal2 = "", usernameVal3 = ""] =
        validUsernames;
      return metaData
        .map((data) => {
          const filteredValue = credential[data.dataKey] ?? "";
          if (data.dataKey === "Category") {
            return handleSpecialCharacter(
              getItemCollections(collectionsByCredentialId, credential.Id)
            );
          } else if (data.dataKey === "Email") {
            return handleSpecialCharacter(usernameVal);
          } else if (data.dataKey === "Login") {
            return handleSpecialCharacter(usernameVal2);
          } else if (data.dataKey === "SecondaryLogin") {
            return handleSpecialCharacter(usernameVal3);
          } else if (data.dataKey === "Note" && filteredValue !== "") {
            return handleSpecialCharacter(filteredValue);
          } else if (data.dataKey === "Password") {
            const value = `${filteredValue}`;
            return handleSpecialCharacter(value);
          } else {
            const value = `${filteredValue}`;
            return handleSpecialCharacter(value);
          }
        })
        .join(",");
    });
  };
  return formatDataToCSV([
    formatHeader(metaData),
    filterCredentialData(credentialData).join("\r\n"),
  ]);
}
