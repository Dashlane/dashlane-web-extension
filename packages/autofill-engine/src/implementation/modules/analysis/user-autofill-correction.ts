import { v4 as uuidv4 } from "uuid";
import { getQueryValue } from "@dashlane/framework-application";
import { isSuccess } from "@dashlane/framework-types";
import { ParsedURL } from "@dashlane/url-parser";
import {
  AutofillDataSourceOrNone,
  isArrayOfUserAutofillCorrections,
  UserAutofillCorrection,
} from "@dashlane/autofill-contracts";
import { AutofillEngineContext } from "../../../Api/server/context";
export const getUserAutofillCorrections = async (
  context: AutofillEngineContext
): Promise<UserAutofillCorrection[]> => {
  try {
    const userAutofillCorrectionsQueryResult = await getQueryValue(
      context.grapheneClient.autofillSettings.queries.getUserAutofillCorrections()
    );
    return isSuccess(userAutofillCorrectionsQueryResult) &&
      isArrayOfUserAutofillCorrections(userAutofillCorrectionsQueryResult.data)
      ? userAutofillCorrectionsQueryResult.data
      : [];
  } catch (exception) {
    context.logException(exception, {
      message: "Error when retrieving user autofill corrections",
      fileName: "user-autofill-correction.ts",
      funcName: "getUserAutofillCorrections",
    });
    return [];
  }
};
export const createAndSaveUserAutofillCorrection = async (
  context: AutofillEngineContext,
  url: string,
  identifier: string,
  correctedDataSource: AutofillDataSourceOrNone
) => {
  const fullDomain = new ParsedURL(url).getHostname();
  const newUserAutofillCorrection: UserAutofillCorrection = {
    id: uuidv4(),
    fieldIdentifier: identifier,
    domain: fullDomain,
    correctedDataSource,
  };
  const userAutofillCorrections = await getUserAutofillCorrections(context);
  const indexOfExistingUserAutofillCorrectionForSpecificElement =
    userAutofillCorrections.findIndex(
      (correction) =>
        correction.domain === newUserAutofillCorrection.domain &&
        correction.fieldIdentifier === newUserAutofillCorrection.fieldIdentifier
    );
  if (indexOfExistingUserAutofillCorrectionForSpecificElement >= 0) {
    userAutofillCorrections[
      indexOfExistingUserAutofillCorrectionForSpecificElement
    ] = newUserAutofillCorrection;
  } else {
    userAutofillCorrections.push(newUserAutofillCorrection);
  }
  void context.grapheneClient.autofillSettings.commands.setUserAutofillCorrections(
    { corrections: userAutofillCorrections }
  );
};
