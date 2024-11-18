import {
  generateCredential,
  GetVpnCredentialBusinessErrors,
  isApiError,
} from "Libs/DashlaneApi";
import { StoreService } from "Store";
import { VpnCredentialGenerator, VpnErrorType } from "./types";
export const openDashlaneVpnAPI = (
  store: StoreService
): VpnCredentialGenerator => ({
  generateCredential: async (login: string, email: string) => {
    const response = await generateCredential(store, login, {
      email,
    });
    if (isApiError(response)) {
      return {
        success: false,
        error:
          response.code ===
          GetVpnCredentialBusinessErrors.USER_ALREADY_HAS_AN_ACCOUNT_FOR_PROVIDER
            ? VpnErrorType.AccountAlreadyExistError
            : VpnErrorType.ServerError,
      };
    }
    return { success: true, password: response.password };
  },
});
