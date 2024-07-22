import { Identity } from "@dashlane/communication";
export const identityToName = (identity: Identity | undefined) =>
  identity
    ? [
        identity.FirstName,
        identity.MiddleName,
        identity.LastName,
        identity.LastName2,
      ]
        .filter(Boolean)
        .join(" ")
    : "";
