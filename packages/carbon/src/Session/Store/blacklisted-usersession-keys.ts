import { BlacklistedSliceKeys } from "Store/types";
import { UserSessionState } from "Session/Store/types";
export const blacklistedUserSessionKeys: BlacklistedSliceKeys<UserSessionState> =
  ["iconsCache", "personalData", "teamAdminData", "sharingSync", "sharingData"];
