import { ParsedURL } from "@dashlane/url-parser";
import {
  CredentialAutofillView,
  OtherSourceType,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { AutofillEngineContext } from "../../../Api/server/context";
import { AutofillableElementValues, AutofillIngredient } from "../../../types";
import {
  getAllAutofillDataFromVault,
  getAutofillDataFromVault,
} from "../../abstractions/vault/get";
import { isSuccess } from "@dashlane/framework-types";
import { Credential, VaultItemType } from "@dashlane/vault-contracts";
import { firstValueFrom } from "rxjs";
export const isNewPasswordIngredient = (ingredient: AutofillIngredient) => {
  return ingredient.type === OtherSourceType.NewPassword;
};
export const isExistingPasswordIngredient = (
  ingredient: AutofillIngredient
) => {
  return (
    ingredient.type === VaultSourceType.Credential &&
    ingredient.property === "password"
  );
};
export const isCredentialEmailIngredient = (ingredient: AutofillIngredient) => {
  return (
    (ingredient.type === VaultSourceType.Email ||
      ingredient.type === VaultSourceType.Credential) &&
    ingredient.property === "email"
  );
};
export const isCredentialLoginIngredient = (ingredient: AutofillIngredient) => {
  return (
    (ingredient.type === VaultSourceType.Credential &&
      ingredient.property === "login") ||
    (ingredient.type === VaultSourceType.Identity &&
      ingredient.property === "pseudo")
  );
};
export const isCredentialLoginSecondaryIngredient = (
  ingredient: AutofillIngredient
) => {
  return (
    ingredient.type === VaultSourceType.Credential &&
    ingredient.property === "secondaryLogin"
  );
};
export interface CapturedCredentialData {
  capturedPassword: string;
  capturedEmail?: string;
  capturedLogin?: string;
  capturedSecondaryLogin?: string;
  capturedEmailOrLogin?: string;
}
export const findCapturedCredentialData = async (
  elementValues: AutofillableElementValues,
  url: string,
  context: AutofillEngineContext
): Promise<CapturedCredentialData | undefined> => {
  const allEltValues = Object.values(elementValues);
  const state = await context.state.tab.get();
  const dataCaptureStepData = state.dataCaptureStepData;
  const capturedNewPwds = allEltValues.filter(({ ingredients }) =>
    ingredients.some(isNewPasswordIngredient)
  );
  const capturedExistingPwd = allEltValues.find(({ ingredients }) =>
    ingredients.some(isExistingPasswordIngredient)
  )?.value;
  if (!capturedNewPwds.every((pwd) => pwd.value === capturedNewPwds[0].value)) {
    return undefined;
  }
  const capturedPassword = capturedNewPwds[0]?.value ?? capturedExistingPwd;
  const capturedEmail =
    allEltValues.find(({ ingredients }) =>
      ingredients.some(isCredentialEmailIngredient)
    )?.value ?? dataCaptureStepData?.capturedData.capturedEmail;
  const capturedLogin =
    allEltValues.find(({ ingredients }) =>
      ingredients.some(isCredentialLoginIngredient)
    )?.value ?? dataCaptureStepData?.capturedData.capturedLogin;
  const capturedSecondaryLogin =
    allEltValues.find(({ ingredients }) =>
      ingredients.some(isCredentialLoginSecondaryIngredient)
    )?.value ?? dataCaptureStepData?.capturedData.capturedSecondaryLogin;
  const capturedEmailOrLogin = capturedEmail ?? capturedLogin;
  const rootDomain = new ParsedURL(url).getRootDomain();
  if (!capturedPassword) {
    await context.state.tab.set({
      ...state,
      dataCaptureStepData: {
        domain: rootDomain,
        capturedData: {
          capturedEmail,
          capturedLogin,
          capturedSecondaryLogin,
        },
        firstStepUrl: url,
      },
    });
    return undefined;
  }
  return {
    capturedPassword,
    capturedEmail,
    capturedLogin,
    capturedSecondaryLogin,
    capturedEmailOrLogin,
  };
};
export const compareCapturedAndExistingCredential = (
  captured: CapturedCredentialData,
  existing: Credential
): boolean => {
  const {
    capturedPassword,
    capturedEmailOrLogin,
    capturedLogin,
    capturedEmail,
  } = captured;
  const { password, username, email } = existing;
  const hasCorrespondingEmailOrLogin =
    (capturedEmail &&
      (username.trim() === capturedEmail.trim() ||
        email.trim() === capturedEmail.trim())) ||
    (capturedLogin &&
      (username.trim() === capturedLogin.trim() ||
        email.trim() === capturedLogin.trim())) ||
    false;
  return (
    capturedPassword === password &&
    (capturedEmailOrLogin === undefined || hasCorrespondingEmailOrLogin)
  );
};
export const isCapturedCredentialAlreadyInVaultById = async (
  context: AutofillEngineContext,
  capturedCredentialData: CapturedCredentialData,
  credentialId: string
): Promise<boolean> => {
  const credentialResult = await firstValueFrom(
    context.grapheneClient.vaultItemsCrud.queries.query({
      vaultItemTypes: [VaultItemType.Credential],
      ids: [credentialId],
    })
  );
  if (
    isSuccess(credentialResult) &&
    credentialResult.data.credentialsResult.matchCount > 0
  ) {
    const existingCredential = credentialResult.data.credentialsResult.items[0];
    return compareCapturedAndExistingCredential(
      capturedCredentialData,
      existingCredential
    );
  }
  return false;
};
export const isCapturedCredentialAlreadyInVault = async (
  context: AutofillEngineContext,
  url: string,
  capturedCredentialData: CapturedCredentialData
): Promise<boolean> => {
  const {
    capturedPassword,
    capturedEmailOrLogin,
    capturedLogin,
    capturedEmail,
  } = capturedCredentialData;
  return (
    await getAllAutofillDataFromVault({
      context,
      url,
      vaultType: VaultSourceType.Credential,
      queryOptions: {
        sortCriteria: [],
        filterCriteria: [],
      },
    })
  ).some(
    (credential) =>
      credential.password === capturedPassword &&
      (capturedEmailOrLogin === undefined ||
        (capturedEmail &&
          (credential.login.trim() === capturedEmail.trim() ||
            credential.email.trim() === capturedEmail.trim())) ||
        (capturedLogin &&
          (credential.login.trim() === capturedLogin.trim() ||
            credential.email.trim() === capturedLogin.trim())))
  );
};
export const forgetDataCaptureStepData = async (
  context: AutofillEngineContext
) => {
  const state = await context.state.tab.get();
  if (state.dataCaptureStepData) {
    await context.state.tab.set({
      ...state,
      dataCaptureStepData: undefined,
    });
  }
};
export const getValidUrlForCredentialCapture = (url: string): string => {
  const siteName = new ParsedURL(url).getRootDomainName();
  if (siteName === "amazon") {
    return new ParsedURL(url).getRootDomain();
  } else if (siteName === "microsoftonline") {
    return new ParsedURL(url).getHostname();
  } else {
    return url;
  }
};
