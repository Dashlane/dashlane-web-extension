import { userABTestSelector } from "Session/Store/abTests/selector";
import { NOT_PARTICIPATING } from "ABTests/mapGetUserABTestsServerResponse";
import { CoreServices } from "Services";
import { persistUserTests } from "ABTests/persistAbTests";
export async function participateToUserABTest(
  coreServices: CoreServices,
  testName: string
): Promise<void> {
  const test = userABTestSelector(
    coreServices.storeService.getState(),
    testName
  );
  if (!test || NOT_PARTICIPATING === test.variant) {
    return;
  }
  persistUserTests(
    coreServices.localStorageService.getInstance(),
    coreServices.storeService
  );
}
