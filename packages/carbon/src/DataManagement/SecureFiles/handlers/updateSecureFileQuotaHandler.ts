import type {
  UpdateSecureFileQuotaRequest,
  UpdateSecureFileQuotaResult,
} from "@dashlane/communication";
import type { CoreServices } from "Services";
import { secureFileSetStorageInfoAction } from "Session/Store/secureFileStorage";
export const updateSecureFileQuotaHandler = (
  { storeService }: CoreServices,
  params: UpdateSecureFileQuotaRequest
): Promise<UpdateSecureFileQuotaResult> => {
  storeService.dispatch(secureFileSetStorageInfoAction(params.quota));
  return Promise.resolve({
    success: true,
  });
};
