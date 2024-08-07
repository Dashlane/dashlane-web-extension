import { ParsedURL } from "@dashlane/url-parser";
import {
  CredentialAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { GetLoginStatus } from "@dashlane/communication";
import { getQueryValue } from "@dashlane/framework-application";
import { isSuccess } from "@dashlane/framework-types";
import { getShortcutValues as getOpenPopupShortcutValues } from "@dashlane/framework-infra/spi";
import { v4 as uuidv4 } from "uuid";
import { AnalysisResults } from "../../../Api/types/analysis";
import {
  AutofillDetails,
  AutofillIngredient,
  AutofillRecipe,
  AutofillRecipesByFormId,
  AutofillRequestOriginType,
} from "../../../Api/types/autofill";
import {
  AutofillEngineContext,
  MultiStepsLogin,
} from "../../../Api/server/context";
import {
  checkHasAskBeforeAutologin,
  checkHasDisableAutologinSetting,
  checkHasNewSubdomainManagement,
} from "../../../config/feature-flips";
import { AutologinSelectionWebcardData, WebcardType } from "../../../types";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import { hasPersistentWebcardDisplayed } from "../../abstractions/webcardPersistence/persistent-webcards";
import {
  checkIsAccountFrozen,
  getAllAutofillDataFromVault,
} from "../../abstractions/vault/get";
import { getAutofillProtectionContext } from "../authentication/password-protection";
import { getFormattedWebcardItem } from "./get-formatted-webcard-item";
import { applyAutofillRecipeHandler } from "./apply-autofill-recipe-handler";
import {
  isCredentialAllowedOnThisUrl,
  isLabelInFormClassification,
  isUrlUnsecure,
} from "./utils";
const isLoginIngredientForAutologin = (
  ingredient: AutofillIngredient
): boolean => {
  return (
    ingredient.type === VaultSourceType.Credential &&
    ["email", "login", "secondaryLogin"].includes(ingredient.property)
  );
};
const isPasswordIngredientForAutologin = (
  ingredient: AutofillIngredient
): boolean => {
  return (
    ingredient.type === VaultSourceType.Credential &&
    ingredient.property === "password"
  );
};
export const checkRecipeForAutologin = (
  recipe: AutofillRecipe,
  formClassification: string
): {
  isRecipeForAutologin: boolean;
  isMultiSteps: boolean;
  step?: MultiStepsLogin;
} => {
  let hasLogin = false;
  let hasPassword = false;
  for (const { ingredient } of recipe.ingredients) {
    hasLogin = hasLogin || isLoginIngredientForAutologin(ingredient);
    hasPassword = hasPassword || isPasswordIngredientForAutologin(ingredient);
    if (hasLogin && hasPassword) {
      return { isRecipeForAutologin: true, isMultiSteps: false };
    }
  }
  if (
    hasLogin &&
    !hasPassword &&
    formClassification.includes(MultiStepsLogin.STEP)
  ) {
    return {
      isRecipeForAutologin: true,
      isMultiSteps: true,
      step: MultiStepsLogin.STEP,
    };
  }
  if (
    hasPassword &&
    !hasLogin &&
    formClassification.includes(MultiStepsLogin.FINAL)
  ) {
    return {
      isRecipeForAutologin: true,
      isMultiSteps: true,
      step: MultiStepsLogin.FINAL,
    };
  }
  return { isRecipeForAutologin: false, isMultiSteps: false };
};
export const getCredentialsAllowedOnThisUrl = async (
  context: AutofillEngineContext,
  url: string
): Promise<CredentialAutofillView[]> => {
  const credentialsUnfiltered = await getAllAutofillDataFromVault({
    context,
    url,
    vaultType: VaultSourceType.Credential,
    queryOptions: {
      sortCriteria: [{ field: "lastUse", direction: "descend" }],
      filterCriteria: [],
    },
  });
  const hasNewSubdomainManagementFeatureEnabled =
    await checkHasNewSubdomainManagement(context.connectors);
  return credentialsUnfiltered.filter((cred) =>
    isCredentialAllowedOnThisUrl(
      cred,
      url,
      hasNewSubdomainManagementFeatureEnabled
    )
  );
};
export const findFirstRecipeForAutologin = (
  autofillRecipes: AutofillRecipesByFormId
):
  | {
      formId: string;
      fieldId: string;
      recipe: AutofillRecipe;
      isMultiSteps: boolean;
      step?: MultiStepsLogin;
    }
  | undefined => {
  for (const formId of Object.keys(autofillRecipes)) {
    const { recipesByField, formClassification } = autofillRecipes[formId];
    for (const fieldId of Object.keys(recipesByField)) {
      const recipeForCredential =
        recipesByField[fieldId].recipesBySourceType[VaultSourceType.Credential];
      if (recipeForCredential) {
        const { isRecipeForAutologin, isMultiSteps, step } =
          checkRecipeForAutologin(recipeForCredential, formClassification);
        if (isRecipeForAutologin) {
          return {
            formId,
            fieldId,
            recipe: recipeForCredential,
            isMultiSteps,
            step,
          };
        }
      }
    }
  }
  return undefined;
};
export const isAutologinAllowedOnTheTab = async (
  tabUrl: string,
  analysisResults: AnalysisResults,
  context: AutofillEngineContext
) => {
  if (isUrlUnsecure(tabUrl)) {
    return false;
  }
  const { loggedIn }: GetLoginStatus =
    await context.connectors.carbon.getUserLoginStatus();
  if (!loggedIn) {
    return false;
  }
  const hasDisableAutologinSettingFF = await checkHasDisableAutologinSetting(
    context.connectors
  );
  const autofillSettingsQuery = await getQueryValue(
    context.grapheneClient.autofillSettings.queries.getAutofillSettings()
  );
  if (
    hasDisableAutologinSettingFF &&
    isSuccess(autofillSettingsQuery) &&
    autofillSettingsQuery.data.isAutologinDisabled
  ) {
    return false;
  }
  if ((await checkIsAccountFrozen(context)).isB2CFrozen) {
    return false;
  }
  const allLoginForms = analysisResults.formElements.filter((form) =>
    isLabelInFormClassification(form.classification, "login")
  );
  if (allLoginForms.length !== 1) {
    return false;
  }
  const loginForm = allLoginForms[0];
  const formFrameFullDomain = new ParsedURL(loginForm.iframeUrl).getHostname();
  const tabFullDomain = new ParsedURL(tabUrl).getHostname();
  if (
    formFrameFullDomain !== tabFullDomain ||
    loginForm.hasCaptcha ||
    loginForm.sandboxed
  ) {
    return false;
  }
  return true;
};
export const findAndApplyAutologinRecipe = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  autofillRecipes: AutofillRecipesByFormId
) => {
  if (!sender.tab?.url) {
    return;
  }
  const tabUrl = sender.tab.url;
  const tabRootDomain = new ParsedURL(tabUrl).getRootDomain();
  const autologinRecipeDetails = findFirstRecipeForAutologin(autofillRecipes);
  if (!autologinRecipeDetails) {
    return;
  }
  const validCredentials = await getCredentialsAllowedOnThisUrl(
    context,
    tabUrl
  );
  if (
    validCredentials.length === 0 ||
    (await hasPersistentWebcardDisplayed(context))
  ) {
    return;
  }
  let premiumStatusSpaces = await context.connectors.carbon.getSpaces();
  premiumStatusSpaces =
    premiumStatusSpaces.length > 1 ? premiumStatusSpaces : [];
  const webcardData: AutologinSelectionWebcardData = {
    webcardId: uuidv4(),
    webcardType: WebcardType.AutologinSelection,
    webcards: validCredentials.map((credential) =>
      getFormattedWebcardItem({
        vaultType: VaultSourceType.Credential,
        vaultItem: credential,
        premiumStatusSpace: premiumStatusSpaces.find(
          (space) => space.spaceId === credential.spaceId
        ),
      })
    ),
    formType: autofillRecipes[autologinRecipeDetails.formId].formClassification,
    tabRootDomain: tabRootDomain,
    extensionShortcuts: await getOpenPopupShortcutValues(),
    autofillRecipes: {
      [VaultSourceType.Credential]: autologinRecipeDetails.recipe,
    },
  };
  const askBeforeAutologinFF = await checkHasAskBeforeAutologin(
    context.connectors
  );
  const state = await context.state.tab.get();
  if (validCredentials.length === 1 && !askBeforeAutologinFF) {
    const protectionContext = await getAutofillProtectionContext(
      context,
      validCredentials[0].id,
      VaultSourceType.Credential
    );
    if (protectionContext.isProtected) {
      return;
    }
    const autofillDetails: AutofillDetails = {
      autofillRecipe: autologinRecipeDetails.recipe,
      dataSource: {
        type: VaultSourceType.Credential,
        vaultId: webcardData.webcards[0].itemId,
      },
      formClassification: webcardData.formType,
      requestOrigin: {
        type: AutofillRequestOriginType.Automatic,
      },
    };
    await applyAutofillRecipeHandler(context, actions, sender, autofillDetails);
  } else if (state.lastAutologin?.domain !== tabRootDomain) {
    actions.showWebcard(AutofillEngineActionTarget.MainFrame, webcardData);
    await context.state.tab.set({
      ...state,
      lastAutologin: {
        domain: tabRootDomain,
        isMultiSteps: autologinRecipeDetails.isMultiSteps,
        step: autologinRecipeDetails.step,
      },
    });
  }
};
