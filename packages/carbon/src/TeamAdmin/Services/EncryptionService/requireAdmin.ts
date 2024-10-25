import { AuthenticationCode } from "@dashlane/communication";
import { StoreService } from "Store";
import { hasTACAccessInCurrentSpace } from "Store/helpers/spaceData";
export const requireAdmin = (storeService: StoreService) => {
  const isAdmin = hasTACAccessInCurrentSpace(storeService);
  if (!isAdmin) {
    throw new Error(AuthenticationCode[AuthenticationCode.USER_UNAUTHORIZED]);
  }
};
