import { isNil } from "ramda";
import { Secret } from "@dashlane/communication";
export const createdAt = (secret: Secret) =>
  isNil(secret.CreationDatetime) ? 0 : secret.CreationDatetime;
export const updatedAt = (secret: Secret) =>
  isNil(secret.UserModificationDatetime) ? 0 : secret.UserModificationDatetime;
