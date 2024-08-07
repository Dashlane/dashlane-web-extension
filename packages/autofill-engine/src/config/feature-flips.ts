import { AutofillFeatureFlips } from "@dashlane/autofill-contracts";
import { FeatureFlips } from "@dashlane/framework-contracts";
import { getSuccess, isFailure } from "@dashlane/framework-types";
import { PASSWORD_LIMIT_FEATURE_FLIPS } from "@dashlane/vault-contracts";
import { firstValueFrom } from "rxjs";
import { AutofillEngineConnectors } from "../server";
export async function fetchFeatureFlips(
  connectors: AutofillEngineConnectors
): Promise<FeatureFlips> {
  const result = await firstValueFrom(
    connectors.grapheneClient.featureFlips.queries.userFeatureFlips()
  );
  if (isFailure(result)) {
    throw new Error("error in `fetchFeatureFlips`: " + result.error);
  }
  return getSuccess(result);
}
async function hasFeatureFlip(
  connectors: AutofillEngineConnectors,
  key: string
): Promise<boolean> {
  const result = await firstValueFrom(
    connectors.grapheneClient.featureFlips.queries.userFeatureFlip({
      featureFlip: key,
    })
  );
  if (isFailure(result)) {
    throw new Error("error in `hasFeatureFlip`: " + result.error);
  }
  return getSuccess(result) ?? false;
}
export async function checkHasPhishingPrevention(
  connectors: AutofillEngineConnectors
): Promise<boolean> {
  return (
    (await hasFeatureFlip(
      connectors,
      AutofillFeatureFlips.PhishingPreventionOnPasteDev
    )) ||
    (await hasFeatureFlip(
      connectors,
      AutofillFeatureFlips.PhishingPreventionOnPaste
    ))
  );
}
export async function checkHasOneClickFormFill(
  connectors: AutofillEngineConnectors
): Promise<boolean> {
  return await hasFeatureFlip(
    connectors,
    AutofillFeatureFlips.AutofillWebOneClickFormFill
  );
}
export async function checkHasPasskeySupport(
  connectors: AutofillEngineConnectors
): Promise<boolean> {
  return await hasFeatureFlip(connectors, AutofillFeatureFlips.PasskeySupport);
}
export async function checkHasAskBeforeAutologin(
  connectors: AutofillEngineConnectors
): Promise<boolean> {
  return await hasFeatureFlip(
    connectors,
    AutofillFeatureFlips.AutofillWebAskBeforeAutologin
  );
}
export async function checkHasNewSubdomainManagement(
  connectors: AutofillEngineConnectors
): Promise<boolean> {
  return await hasFeatureFlip(
    connectors,
    AutofillFeatureFlips.AutofillWebNewSubdomainManagement
  );
}
export async function checkHasDisableAutologinSetting(
  connectors: AutofillEngineConnectors
): Promise<boolean> {
  return await hasFeatureFlip(
    connectors,
    AutofillFeatureFlips.DisableAutologin
  );
}
export async function checkHasDisabledPasswordWarning(
  connectors: AutofillEngineConnectors
): Promise<boolean> {
  return (
    (await hasFeatureFlip(
      connectors,
      AutofillFeatureFlips.DisableEmailPasswordWarning
    )) ||
    (await hasFeatureFlip(
      connectors,
      AutofillFeatureFlips.DisableEmailPasswordWarningDev
    ))
  );
}
export async function checkHasFrozenAccountFF(
  connectors: AutofillEngineConnectors
) {
  return await hasFeatureFlip(
    connectors,
    PASSWORD_LIMIT_FEATURE_FLIPS.B2CFreeUserFrozenState
  );
}
export async function checkHasLinkedWebsitesInContext(
  connectors: AutofillEngineConnectors
) {
  return await hasFeatureFlip(
    connectors,
    AutofillFeatureFlips.LinkedWebsitesInContextDev
  );
}
export async function checkHasGrapheneMigrationV3Dev(
  connectors: AutofillEngineConnectors
) {
  return await hasFeatureFlip(
    connectors,
    AutofillFeatureFlips.GrapheneMigrationV3Dev
  );
}
export async function checkHasInAppPasswordHealth(
  connectors: AutofillEngineConnectors
) {
  return await hasFeatureFlip(
    connectors,
    AutofillFeatureFlips.InAppPasswordHealthBadges
  );
}
export async function checkHasNewUserVerificationForItemUnlock(
  connectors: AutofillEngineConnectors
) {
  return await hasFeatureFlip(
    connectors,
    AutofillFeatureFlips.NewUserVerificationForItemUnlock
  );
}
export const checkHasSharedCollectionInSaveWebcard = async (
  connectors: AutofillEngineConnectors
) =>
  await hasFeatureFlip(
    connectors,
    AutofillFeatureFlips.SharedCollectionInSaveWebcard
  );
export async function checkHasAutofillAuditLogs(
  connectors: AutofillEngineConnectors
) {
  return await hasFeatureFlip(
    connectors,
    AutofillFeatureFlips.AutofillAuditLogs
  );
}
