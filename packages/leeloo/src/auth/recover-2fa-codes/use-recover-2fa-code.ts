import {
  Request2FaCodesByPhoneErrorCodes,
  userVerificationApi,
} from "@dashlane/authentication-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
import { isSuccess } from "@dashlane/framework-types";
export type Recover2FAErrors =
  | Request2FaCodesByPhoneErrorCodes
  | "UnknownError";
interface UseRecover2FaCodesParams {
  onSuccess: () => void;
  onError: (error: Recover2FAErrors) => void;
}
export const useRecover2faCodes = ({
  onSuccess,
  onError,
}: UseRecover2FaCodesParams) => {
  const { request2FaCodesByPhone } = useModuleCommands(userVerificationApi);
  return {
    recoverOtpCodes: async (email: string) => {
      try {
        const result = await request2FaCodesByPhone({ email });
        if (isSuccess(result)) {
          return onSuccess();
        }
        return onError(result.error.tag);
      } catch (_e) {
        return onError("UnknownError");
      }
    },
  };
};
