import { SetReactivationStatusRequest } from "@dashlane/communication";
import { reactivationStatusUpdated } from "Authentication/Store/localAccounts/actions";
import { CoreServices } from "Services";
export function setReactivationStatusHandler(
  { storeService }: CoreServices,
  { reactivationStatus }: SetReactivationStatusRequest
): Promise<void> {
  storeService.dispatch(reactivationStatusUpdated(reactivationStatus));
  return Promise.resolve();
}
