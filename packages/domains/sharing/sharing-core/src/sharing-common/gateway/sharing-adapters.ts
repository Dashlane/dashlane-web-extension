import { convertSharingItemTypeToEmailType } from "../../utils/get-sharing-item-type";
import { ItemEmailView, UserInvite } from "../sharing.types";
export function makeItemForEmailing(
  itemType: "AUTHENTIFIANT" | "SECURENOTE" | "SECRET",
  title: string
): ItemEmailView {
  const type = convertSharingItemTypeToEmailType(itemType);
  const name = title || `Untitled ${type}`;
  return { type, name };
}
export const convertToUserInvitesPayload = (users: UserInvite[]) =>
  users.map(
    ({
      id,
      resourceKey,
      proposeSignature,
      proposeSignatureUsingAlias,
      acceptSignature,
      alias,
      permission,
    }) => ({
      userId: id,
      groupKey: resourceKey,
      proposeSignature,
      proposeSignatureUsingAlias,
      acceptSignature,
      alias,
      permission,
    })
  );
