import { ExceptionCriticality } from "@dashlane/communication";
import { getAndEvaluateForUser } from "Libs/DashlaneApi/services/abtesting/get-and-evaluate-for-user";
import { sendExceptionLog } from "Logs/Exception";
import { StoreService } from "Store";
import { abTestsNamesSelector } from "Application/Store/applicationSettings/selectors";
import { isApiError } from "Libs/DashlaneApi";
import { refreshedUserABTests } from "Session/Store/abTests/actions";
import { mapGetUserABServerResponse as mapGetUserABTestsServerResponse } from "ABTests/mapGetUserABTestsServerResponse";
import { UserLocalDataService } from "Libs/Storage/User";
import { persistUserTests } from "ABTests/persistAbTests";
export async function refreshUserABTest(
  storeService: StoreService,
  storage: UserLocalDataService,
  login: string
): Promise<void> {
  try {
    const userABTestNames = abTestsNamesSelector(storeService.getState());
    if (userABTestNames.length === 0) {
      return;
    }
    const result = await getAndEvaluateForUser(storeService, login, {
      abtests: userABTestNames,
    });
    if (isApiError(result)) {
      throw new Error(`Failed to refresh user AB tests: ${result}`);
    }
    const mappedABTests = mapGetUserABTestsServerResponse(
      userABTestNames,
      result.abtests
    );
    storeService.dispatch(refreshedUserABTests(mappedABTests));
    persistUserTests(storage, storeService);
  } catch (error) {
    const message = `[ABTests] - refreshUserABTest: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({
      error: augmentedError,
      code: ExceptionCriticality.WARNING,
    });
  }
}
