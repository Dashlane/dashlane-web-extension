import { getSuccess, isFailure } from "@dashlane/framework-types";
import { firstValueFrom } from "rxjs";
import { AutofillEngineContext } from "../../../../Api/server/context";
import { UserVerificationMethods } from "@dashlane/authentication-contracts";
export async function getAvailableUserVerificationMethods(
  context: AutofillEngineContext
): Promise<UserVerificationMethods[]> {
  const availableMethodsResult = await firstValueFrom(
    context.connectors.grapheneClient.userVerification.queries.userVerificationMethods()
  );
  if (isFailure(availableMethodsResult)) {
    throw new Error("Failure getting the user verification methods");
  }
  return getSuccess(availableMethodsResult);
}
