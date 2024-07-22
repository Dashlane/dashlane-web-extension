import { Credential, Note, Secret } from "@dashlane/communication";
export function getSharingItemTypeFromKW(
  item?: Credential | Note | Secret
): "AUTHENTIFIANT" | "SECURENOTE" | "SECRET" {
  switch (item?.kwType) {
    case "KWAuthentifiant":
      return "AUTHENTIFIANT";
    case "KWSecureNote":
      return "SECURENOTE";
    default:
      return "SECRET";
  }
}
export function convertSharingItemTypeToEmailType(
  itemType: "AUTHENTIFIANT" | "SECURENOTE" | "SECRET"
): "password" | "note" | "secret" {
  switch (itemType) {
    case "AUTHENTIFIANT":
      return "password";
    case "SECURENOTE":
      return "note";
    default:
      return "secret";
  }
}
