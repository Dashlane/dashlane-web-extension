import generateRandomSessionId from "Utils/generateRandomSessionId";
import { StoreService } from "Store";
import { appSessionIdSelector } from "Application/Store/application/selectors";
import { appSessionIdInitialized } from "Application/Store/application/actions";
export function initializeAppSessionId(storeService: StoreService) {
  const appSessionId = getApplicationSessionId(storeService);
  if (!appSessionId) {
    setApplicationSessionId(storeService, generateRandomSessionId());
  }
}
export function getApplicationSessionId(storeService: StoreService) {
  return appSessionIdSelector(storeService.getState());
}
function setApplicationSessionId(
  storeService: StoreService,
  applicationSessionId: number
) {
  storeService.dispatch(appSessionIdInitialized(applicationSessionId));
}
