import { AutofillEngineContext } from "../Api/server/context";
export async function hasAbTest(
  context: AutofillEngineContext,
  key: string,
  variantName: string
): Promise<boolean> {
  try {
    const aBTestResult = await context.connectors.carbon.getUserABTestVariant(
      key
    );
    if (aBTestResult === variantName) {
      void context.connectors.carbon.participateToUserABTest(key);
      return true;
    }
    return false;
  } catch (exception) {
    context.logException(exception, {
      message: "Failed to retrieve AB test",
      fileName: "ab-tests.ts",
      funcName: "hasAbTest",
    });
    return false;
  }
}
