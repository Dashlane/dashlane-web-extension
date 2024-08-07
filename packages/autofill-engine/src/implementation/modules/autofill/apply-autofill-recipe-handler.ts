import {
  AddressAutofillView,
  AutofillDataSourceType,
  AutofillViews,
  BankAccountAutofillView,
  CredentialAutofillView,
  GeneratedPasswordAutofillView,
  isVaultSourceType,
  OtherSourceType,
  PaymentCardAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import {
  AutofillDataSource,
  VaultAutofillView,
  vaultSourceTypeToDataModelTypeMap,
} from "@dashlane/communication";
import { getQueryValue } from "@dashlane/framework-application";
import { isSuccess } from "@dashlane/framework-types";
import { MatchType } from "@dashlane/hermes";
import { ParsedURL } from "@dashlane/url-parser";
import { firstValueFrom } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import {
  AutofillEngineContext,
  MultiStepsLogin,
} from "../../../Api/server/context";
import {
  AutofillDetails,
  AutofillDetailsForOtherDataSource,
  AutofillDetailsForVaultDataSource,
  AutofillIngredient,
  AutofillOperations,
  AutofillOperationType,
  AutofillRecipe,
  AutofillRequestOrigin,
  AutofillRequestOriginType,
  IngredientAndVaultItem,
  isAutofillDetailsForOtherDataSource,
  isAutofillDetailsForVaultDataSource,
  isVaultIngredient,
  SomeVaultIngredient,
  VaultIngredient,
} from "../../../Api/types/autofill";
import {
  checkHasDisabledPasswordWarning,
  checkHasLinkedWebsitesInContext,
  checkHasOneClickFormFill,
} from "../../../config/feature-flips";
import {
  LinkedWebsiteUpdateConfirmationData,
  PendingOperationType,
  WebcardType,
} from "../../../types";
import { isAddressLocaleFromGBorIE } from "../../abstractions/formatting/formatters/Address/helpers";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import {
  fetchSpecialFormatterForVaultIngredient,
  getAllAutofillDataFromVault,
  getAutofillDataFromVault,
  getParsedDateForIngredient,
} from "../../abstractions/vault/get";
import { showPersistentWebcard } from "../../abstractions/webcardPersistence/persistent-webcards";
import {
  askUserToConfirmAuthenticationForAutofill,
  getAutofillProtectionContext,
} from "../authentication/password-protection";
import { checkRecipeForAutologin } from "./autologin";
import {
  handleOnboardingAutofillFlow,
  handleOnboardingLoginFlow,
} from "./onboarding";
import { askUserToConfirmPasswordGeneration } from "./password-generation";
import {
  areWeOnTheUserMailProviderWebsite,
  getMatchType,
  isIngredientValidForAddress,
  isIngredientValidForCredential,
  isPropertyInVaultItem,
} from "./utils";
import { DateFormat, DateSeparator } from "../../../client";
interface AutofillOperationInsertionArgs {
  context: AutofillEngineContext;
  operations: AutofillOperations;
  frameId: string;
  fieldId: string;
  ingredient: AutofillIngredient;
  dataSource: AutofillDataSource;
  focusedElement?: {
    elementId: string;
    frameId: string;
  };
  requestOrigin: AutofillRequestOrigin;
  selectedVaultItem?: VaultAutofillView;
}
const getCredentialOtpCode = async (
  context: AutofillEngineContext,
  credentialId: string
): Promise<string | undefined> => {
  const otpCode = await getQueryValue(
    context.grapheneClient.otp.queries.otpCode({ credentialId })
  );
  return isSuccess(otpCode) ? otpCode.data?.code : undefined;
};
const getValueToFillFromCredentialItem = async (
  context: AutofillEngineContext,
  ingredient: SomeVaultIngredient<VaultSourceType.Credential>,
  selectedVaultItem: CredentialAutofillView
): Promise<string | undefined> => {
  let value = selectedVaultItem[ingredient.property];
  if (ingredient.property === "email" || ingredient.property === "login") {
    value ||= selectedVaultItem.email || selectedVaultItem.login;
  }
  if (ingredient.property === "otpSecret") {
    value = selectedVaultItem.hasOtp
      ? await getCredentialOtpCode(context, selectedVaultItem.id)
      : undefined;
    const specialFormatterForVaultIngredient =
      fetchSpecialFormatterForVaultIngredient(ingredient);
    if (
      specialFormatterForVaultIngredient &&
      typeof value === "string" &&
      value.length
    ) {
      return specialFormatterForVaultIngredient(
        {
          ...selectedVaultItem,
          otpSecret: value,
        },
        ingredient.format
      );
    }
  }
  return value?.toString();
};
const getValueToFillFromAddressItem = (
  ingredient: SomeVaultIngredient<VaultSourceType.Address>,
  selectedVaultItem: AddressAutofillView
): string | undefined => {
  let value = selectedVaultItem[ingredient.property];
  if (
    ingredient.property === "addressFull" &&
    isAddressLocaleFromGBorIE(selectedVaultItem)
  ) {
    value = `${selectedVaultItem.streetNumber} ${selectedVaultItem.addressFull}`;
  }
  return value?.toString();
};
export const getValueToFillFromVaultItem = async (
  context: AutofillEngineContext,
  args: IngredientAndVaultItem
): Promise<string | undefined> => {
  const specialFormatterForVaultIngredient =
    fetchSpecialFormatterForVaultIngredient(args.ingredient);
  if (
    specialFormatterForVaultIngredient &&
    args.ingredient.property !== "otpSecret"
  ) {
    return specialFormatterForVaultIngredient(
      args.vaultItem,
      args.ingredient.format
    );
  }
  if (!isPropertyInVaultItem(args.ingredient.property, args.vaultItem)) {
    return undefined;
  }
  if (isIngredientValidForCredential(args)) {
    return await getValueToFillFromCredentialItem(
      context,
      args.ingredient,
      args.vaultItem
    );
  }
  if (isIngredientValidForAddress(args)) {
    return getValueToFillFromAddressItem(args.ingredient, args.vaultItem);
  }
  const value = args.vaultItem[args.ingredient.property];
  return value ? value.toString() : undefined;
};
const insertFillOperationsInAutofillOperationsForVaultIngredient = async ({
  context,
  operations,
  frameId,
  fieldId,
  ingredient,
  dataSource,
  focusedElement,
  selectedVaultItem,
}: {
  context: AutofillEngineContext;
  operations: AutofillOperations;
  frameId: string;
  fieldId: string;
  ingredient: VaultIngredient;
  dataSource: AutofillDataSource;
  focusedElement?: {
    elementId: string;
    frameId: string;
  };
  selectedVaultItem: VaultAutofillView;
}) => {
  if (ingredient.type !== dataSource.type) {
    return;
  }
  const value = await getValueToFillFromVaultItem(context, {
    ingredient,
    vaultItem: selectedVaultItem,
  });
  const parsedDate = getParsedDateForIngredient(ingredient, selectedVaultItem);
  if (value || parsedDate?.date) {
    if (operations.matchType === MatchType.Regular) {
      operations.matchType = getMatchType(selectedVaultItem);
    }
    if (
      ingredient.type === VaultSourceType.Credential &&
      ingredient.property === "password"
    ) {
      const { id, email, login, url } =
        selectedVaultItem as CredentialAutofillView;
      operations.itemInfos = {
        id,
        login: login ? login : email,
        domain: new ParsedURL(url).getHostname(),
        type: VaultSourceType.Credential,
      };
    }
    if (
      ingredient.type === VaultSourceType.BankAccount ||
      ingredient.type === VaultSourceType.PaymentCard
    ) {
      const { name } = selectedVaultItem as
        | BankAccountAutofillView
        | PaymentCardAutofillView;
      operations.itemInfos = {
        type: ingredient.type,
        item_name: name,
      };
    }
    operations[AutofillOperationType.Fill].push({
      operationType: AutofillOperationType.Fill,
      frameId,
      srcElementId: fieldId,
      dataSource: parsedDate?.date
        ? {
            type: dataSource.type,
            date: parsedDate.date,
            format:
              (ingredient.format?.dateFormat as DateFormat | undefined) ??
              parsedDate.defaultFormat,
            separator:
              (ingredient.format?.dateSeparator as DateSeparator | undefined) ??
              parsedDate.defaultSeparator,
          }
        : {
            type: dataSource.type,
            value: value!,
          },
      forceAutofill:
        (focusedElement?.elementId === fieldId &&
          focusedElement.frameId === frameId) ||
        dataSource.type === VaultSourceType.Credential,
      hasLimitedRights:
        selectedVaultItem.vaultType === VaultSourceType.Credential
          ? selectedVaultItem.sharingStatus.isShared &&
            !selectedVaultItem.sharingStatus.hasAdminPermission
          : false,
    });
  }
};
const insertFillOperationsInAutofillOperations = async ({
  context,
  operations,
  frameId,
  fieldId,
  ingredient,
  dataSource,
  focusedElement,
  selectedVaultItem,
}: AutofillOperationInsertionArgs) => {
  if (ingredient.type !== dataSource.type) {
    return;
  }
  if (dataSource.type === OtherSourceType.WebauthnConditionalUI) {
    throw new Error("Cannot build fill operation for webauthn conditional UI");
  } else if (dataSource.type === OtherSourceType.NewPassword) {
    operations[AutofillOperationType.Fill].push({
      operationType: AutofillOperationType.Fill,
      frameId,
      srcElementId: fieldId,
      dataSource: {
        type: VaultSourceType.GeneratedPassword,
        value: dataSource.value,
      },
      forceAutofill: true,
      hasLimitedRights: false,
    });
  } else if (isVaultIngredient(ingredient) && selectedVaultItem) {
    await insertFillOperationsInAutofillOperationsForVaultIngredient({
      context,
      operations,
      frameId,
      fieldId,
      ingredient,
      dataSource,
      focusedElement,
      selectedVaultItem,
    });
  }
};
const insertClickOperationsInAutofillOperations = async ({
  context,
  operations,
  frameId,
  fieldId,
  ingredient,
  dataSource,
  requestOrigin,
  selectedVaultItem,
}: AutofillOperationInsertionArgs) => {
  const state = await context.state.tab.get();
  const isAutologinSelection =
    requestOrigin.type === AutofillRequestOriginType.Webcard &&
    requestOrigin.webcardType === WebcardType.AutologinSelection;
  const isAutomaticAutologin =
    requestOrigin.type === AutofillRequestOriginType.Automatic &&
    state.lastAutologin?.domain !== operations.tabRootDomain;
  const isAutomaticMultiStepsAutologin =
    requestOrigin.type === AutofillRequestOriginType.Automatic &&
    state.lastAutologin?.domain === operations.tabRootDomain &&
    !!state.lastAutologin.isMultiSteps &&
    !!state.lastAutologin.step &&
    state.lastAutologin.step !== MultiStepsLogin.FINAL &&
    !operations.formClassification.includes(MultiStepsLogin.STEP) &&
    !operations.formClassification.includes(state.lastAutologin.step);
  if (
    !isAutologinSelection &&
    !isAutomaticAutologin &&
    !isAutomaticMultiStepsAutologin
  ) {
    return;
  }
  if (
    ingredient.type === OtherSourceType.SubmitButton &&
    dataSource.type === VaultSourceType.Credential &&
    selectedVaultItem &&
    "autoLogin" in selectedVaultItem &&
    selectedVaultItem.autoLogin
  ) {
    operations[AutofillOperationType.Click].push({
      operationType: AutofillOperationType.Click,
      frameId,
      srcElementId: fieldId,
    });
  }
};
const buildAutofillOperations = async (
  context: AutofillEngineContext,
  sender: chrome.runtime.MessageSender,
  autofillDetails: AutofillDetails,
  selectedVaultItem?: VaultAutofillView
): Promise<AutofillOperations> => {
  const operations: AutofillOperations = {
    formClassification: autofillDetails.formClassification,
    requestOrigin: autofillDetails.requestOrigin,
    tabRootDomain: new ParsedURL(sender.tab?.url ?? "").getRootDomain(),
    [AutofillOperationType.Fill]: [],
    [AutofillOperationType.Click]: [],
    matchType: MatchType.Regular,
  };
  const recipe = autofillDetails.autofillRecipe;
  const baseAutofillOperationInsertionArgument = {
    context,
    operations,
    requestOrigin: autofillDetails.requestOrigin,
    dataSource: autofillDetails.dataSource,
    focusedElement: autofillDetails.focusedElement,
    selectedVaultItem,
  };
  for (const { frameId, srcElementId, ingredient } of recipe.ingredients) {
    await insertFillOperationsInAutofillOperations({
      ...baseAutofillOperationInsertionArgument,
      frameId,
      fieldId: srcElementId,
      ingredient,
    });
  }
  const allSubmitButtonsIngredient = recipe.ingredients.filter(
    (ingredient) => ingredient.ingredient.type === OtherSourceType.SubmitButton
  );
  const selectedSubmitButton =
    allSubmitButtonsIngredient.find((ingredient) =>
      ingredient.fieldClassification.includes("login")
    ) ??
    allSubmitButtonsIngredient.find((ingredient) =>
      ingredient.fieldClassification.includes("next")
    ) ??
    allSubmitButtonsIngredient[0];
  if (
    baseAutofillOperationInsertionArgument.operations[
      AutofillOperationType.Fill
    ].length > 0 &&
    selectedSubmitButton
  ) {
    await insertClickOperationsInAutofillOperations({
      ...baseAutofillOperationInsertionArgument,
      frameId: selectedSubmitButton.frameId,
      fieldId: selectedSubmitButton.srcElementId,
      ingredient: selectedSubmitButton.ingredient,
    });
  }
  return operations;
};
const addAutofillOperationsForPostfillRecipes = async (
  context: AutofillEngineContext,
  operations: AutofillOperations,
  autofillDetails: AutofillDetails,
  url: string
) => {
  const postfillRecipes = autofillDetails.autofillRecipe.postfillRecipes;
  if (!postfillRecipes) {
    return;
  }
  const postfillRecipesEntries = Object.entries(postfillRecipes) as [
    AutofillDataSourceType,
    AutofillRecipe
  ][];
  for (const [sourceType, recipe] of postfillRecipesEntries) {
    if (isVaultSourceType(sourceType)) {
      const items = await getAllAutofillDataFromVault({
        context,
        url,
        vaultType: sourceType,
        queryOptions: {
          sortCriteria: [{ field: "lastUse", direction: "descend" }],
          filterCriteria: [],
          maxNumberOfItems: 1,
        },
      });
      if (
        items.length > 0 &&
        !(
          await getAutofillProtectionContext(
            context,
            items[0].id,
            items[0].vaultType
          )
        ).isProtected
      ) {
        const item = items[0];
        for (const {
          frameId,
          srcElementId,
          ingredient,
        } of recipe.ingredients) {
          await insertFillOperationsInAutofillOperations({
            context,
            operations,
            frameId,
            fieldId: srcElementId,
            ingredient,
            dataSource: { type: sourceType, vaultId: item.id },
            requestOrigin: autofillDetails.requestOrigin,
            selectedVaultItem: item,
          });
        }
      }
    }
  }
};
export const applyAutofillRecipeForOtherDataSourceHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  autofillDetails: AutofillDetailsForOtherDataSource
): Promise<void> => {
  if (!sender.tab?.url) {
    return;
  }
  switch (autofillDetails.dataSource.type) {
    case OtherSourceType.WebauthnConditionalUI:
      break;
    case OtherSourceType.NewPassword:
      {
        void context.connectors.carbon.saveGeneratedPassword({
          password: autofillDetails.dataSource.value,
          url: new ParsedURL(sender.tab.url).getRootDomain(),
        });
        const operations = await buildAutofillOperations(
          context,
          sender,
          autofillDetails
        );
        actions.applyAutofillOperationsAndTriggerDataCapture(
          AutofillEngineActionTarget.AllFrames,
          operations
        );
      }
      break;
  }
};
const isSubdomainOfExistingCredential = (
  existingCredentialUrl: ParsedURL,
  capturedUrl: ParsedURL
) => {
  const existingCredentialRootDomain = existingCredentialUrl.getRootDomain();
  return (
    existingCredentialRootDomain === capturedUrl.getRootDomain() &&
    capturedUrl.getSubdomain() !== ""
  );
};
const addAsLinkedWebsiteIfNeeded = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  autofillDetails: AutofillDetailsForVaultDataSource,
  selectedVaultItem: AutofillViews | GeneratedPasswordAutofillView | undefined,
  parsedURL: ParsedURL
) => {
  const tabHostName = parsedURL.getHostname();
  if (
    selectedVaultItem?.vaultType === VaultSourceType.Credential &&
    (await checkHasLinkedWebsitesInContext(context.connectors)) &&
    new ParsedURL(selectedVaultItem.url).getHostname() !== tabHostName
  ) {
    const credentialPreferences = await firstValueFrom(
      context.grapheneClient.autofillSettings.queries.getPreferencesForCredentials(
        {
          credentialIds: [selectedVaultItem.id],
        }
      )
    );
    const linkedWebsite = await firstValueFrom(
      context.grapheneClient.linkedWebsites.queries.getDashlaneDefinedLinkedWebsites(
        {
          url: selectedVaultItem.url,
        }
      )
    );
    const isSubdomain = isSubdomainOfExistingCredential(
      new ParsedURL(selectedVaultItem.url),
      parsedURL
    );
    const isValidSubdomainIfApplicable =
      isSuccess(credentialPreferences) && isSubdomain
        ? parsedURL.getSubdomain() !== "www" &&
          credentialPreferences.data[0]?.onlyAutofillExactDomain
        : true;
    if (
      isValidSubdomainIfApplicable &&
      !selectedVaultItem.userAddedLinkedWebsites.includes(tabHostName) &&
      isSuccess(linkedWebsite) &&
      !linkedWebsite.data.includes(tabHostName)
    ) {
      const webcardData: LinkedWebsiteUpdateConfirmationData = {
        webcardId: uuidv4(),
        webcardType: WebcardType.LinkedWebsiteUpdateConfirmation,
        formType: "",
        operation: {
          credentialId: autofillDetails.dataSource.vaultId,
          credentialName: selectedVaultItem.title,
          linkedWebsite: tabHostName,
        },
      };
      const addLinkedWebsiteResult =
        await context.connectors.grapheneClient.linkedWebsites.commands.addLinkedWebsite(
          {
            credentialId: autofillDetails.dataSource.vaultId,
            linkedWebsite: tabHostName,
          }
        );
      if (isSuccess(addLinkedWebsiteResult)) {
        await showPersistentWebcard(context, actions, webcardData);
      }
    }
  }
};
export const applyAutofillRecipeForVaultDataSourceHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  autofillDetails: AutofillDetailsForVaultDataSource
): Promise<void> => {
  if (!sender.tab?.url) {
    return;
  }
  if (!isAutofillDetailsForVaultDataSource(autofillDetails)) {
    throw new Error(
      `Error: applyAutofillRecipeForVaultDataSourceHandler called without a VaultDataSource '${autofillDetails}'`
    );
  }
  const protectionContext = await getAutofillProtectionContext(
    context,
    autofillDetails.dataSource.vaultId,
    autofillDetails.dataSource.type
  );
  if (protectionContext.isProtected) {
    throw new Error(
      `Error: applyAutofillRecipeForVaultDataSourceHandler called with password protected items`
    );
  }
  const parsedUrl = new ParsedURL(sender.tab.url);
  const tabRootDomain = parsedUrl.getRootDomain();
  await context.connectors.legacyCarbon.filledDataItem({
    dataType:
      vaultSourceTypeToDataModelTypeMap[autofillDetails.dataSource.type],
    id: autofillDetails.dataSource.vaultId,
    url: sender.tab.url,
  });
  const selectedVaultItem = await getAutofillDataFromVault(
    context,
    autofillDetails.dataSource.type,
    autofillDetails.dataSource.vaultId,
    sender.tab.url
  );
  const operations = await buildAutofillOperations(
    context,
    sender,
    autofillDetails,
    selectedVaultItem
  );
  if (operations[AutofillOperationType.Fill].length > 0) {
    if (
      autofillDetails.autofillRecipe.postfillRecipes &&
      (await checkHasOneClickFormFill(context.connectors))
    ) {
      await addAutofillOperationsForPostfillRecipes(
        context,
        operations,
        autofillDetails,
        tabRootDomain
      );
    }
    const state = await context.state.tab.get();
    const { isRecipeForAutologin, isMultiSteps, step } =
      checkRecipeForAutologin(
        autofillDetails.autofillRecipe,
        autofillDetails.formClassification
      );
    if (
      isRecipeForAutologin &&
      operations[AutofillOperationType.Click].length > 0
    ) {
      await context.state.tab.set({
        ...state,
        lastAutologin: {
          domain: tabRootDomain,
          isMultiSteps,
          step,
        },
      });
    }
    actions.applyAutofillOperations(
      AutofillEngineActionTarget.AllFrames,
      operations
    );
    await addAsLinkedWebsiteIfNeeded(
      context,
      actions,
      autofillDetails,
      selectedVaultItem,
      parsedUrl
    );
  }
  if (
    autofillDetails.dataSource.type === VaultSourceType.Credential &&
    operations[AutofillOperationType.Click].length > 0
  ) {
    await handleOnboardingLoginFlow(context, actions);
  }
};
export const applyAutofillRecipeHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  autofillDetails: AutofillDetails
): Promise<void> => {
  if (!sender.tab?.url) {
    return;
  }
  if (isAutofillDetailsForVaultDataSource(autofillDetails)) {
    const protectionContext = await getAutofillProtectionContext(
      context,
      autofillDetails.dataSource.vaultId,
      autofillDetails.dataSource.type
    );
    if (protectionContext.isProtected) {
      await askUserToConfirmAuthenticationForAutofill(
        context,
        actions,
        protectionContext.neverAskAgainMode,
        {
          type: PendingOperationType.ApplyAutofillDetails,
          data: autofillDetails,
        }
      );
    } else {
      await applyAutofillRecipeForVaultDataSourceHandler(
        context,
        actions,
        sender,
        autofillDetails
      );
    }
  } else if (isAutofillDetailsForOtherDataSource(autofillDetails)) {
    const hasDisabledPasswordWarning = await checkHasDisabledPasswordWarning(
      context.connectors
    );
    const userShouldConfirmBeforeGenerating =
      !hasDisabledPasswordWarning &&
      areWeOnTheUserMailProviderWebsite(
        (await context.connectors.carbon.getUserLogin()) ?? "",
        new ParsedURL(sender.tab.url).getRootDomain()
      );
    if (userShouldConfirmBeforeGenerating) {
      askUserToConfirmPasswordGeneration(context, actions, autofillDetails);
    } else {
      await applyAutofillRecipeForOtherDataSourceHandler(
        context,
        actions,
        sender,
        autofillDetails
      );
    }
  } else {
  }
  await handleOnboardingAutofillFlow(context, sender.tab.url);
};
