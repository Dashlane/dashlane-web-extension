import { StoreService } from "Store";
import { userAuthenticationDataSelector } from "Authentication/selectors";
import { LocalStorageService } from "Libs/Storage/Local/types";
import { CurrentUserAuthenticationState } from "Authentication/Store/currentUser/types";
import { rehydrateUserAuthenticationData } from "Authentication/Store/currentUser/actions";
import {
  FailedToReadParseOrValidateAuthenticationData,
  FailedToRehydrateAuthenticationData,
  LoadUserAuthenticationDataResult,
} from "Authentication/Storage/types";
export const loadUserAuthenticationData = async (
  localStorageService: LocalStorageService,
  storeService: StoreService
): Promise<LoadUserAuthenticationDataResult> => {
  let userAuthenticationData: CurrentUserAuthenticationState;
  try {
    const userLocalDataService = localStorageService.getInstance();
    const hasPersistedAuthenticationData =
      await userLocalDataService.hasAuthenticationData();
    if (!hasPersistedAuthenticationData) {
      return Promise.resolve({ type: "success" });
    }
    userAuthenticationData = await userLocalDataService.getAuthenticationData();
  } catch (error) {
    return Promise.resolve({
      type: "failed",
      message: FailedToReadParseOrValidateAuthenticationData,
      error,
    });
  }
  try {
    storeService.dispatch(
      rehydrateUserAuthenticationData(userAuthenticationData)
    );
  } catch (error) {
    return Promise.resolve({
      type: "failed",
      message: FailedToRehydrateAuthenticationData,
      error,
    });
  }
  return Promise.resolve({ type: "success" });
};
export const persistUserAuthenticationData = async (
  localStorageService: LocalStorageService,
  storeService: StoreService
) => {
  const data = userAuthenticationDataSelector(storeService.getState());
  const userLocalDataService = localStorageService.getInstance();
  await userLocalDataService.storeAuthenticationData(data);
};
