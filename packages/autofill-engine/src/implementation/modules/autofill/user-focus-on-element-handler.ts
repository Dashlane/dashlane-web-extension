import {
  AutofillDataSourceType,
  CredentialAutofillView,
  EmailAutofillView,
  isVaultSourceType,
  OtherSourceType,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import {
  PremiumStatusSpaceItemView,
  ReactivationStatus,
  VaultAutofillView,
} from "@dashlane/communication";
import { getShortcutValues as getOpenPopupShortcutValues } from "@dashlane/framework-infra/spi";
import { ParsedURL } from "@dashlane/url-parser";
import { v4 as uuidv4 } from "uuid";
import { AutofillEngineContext } from "../../../Api/server/context";
import {
  AutofillRecipe,
  FocusInformations,
  isVaultIngredient,
  VaultIngredient,
} from "../../../Api/types/autofill";
import {
  AccountFrozenDropdownWebcardData,
  AutofillDropdownWebcardConfiguration,
  AutofillDropdownWebcardData,
  AutofillDropdownWebcardWarningType,
  ClassicDropdownWebcardData,
  GeneratePasswordWebcardData,
  isClassicDropdownWebcard,
  ReactivationWebcardData,
  WarningData,
  WebAuthnReactivationWebcardData,
} from "../../../Api/types/webcards/autofill-dropdown-webcard";
import {
  WebcardMetadataStore,
  WebcardMetadataType,
  WebcardType,
} from "../../../Api/types/webcards/webcard-data-base";
import { WebcardItem } from "../../../Api/types/webcards/webcard-item";
import { parseFormClassifications } from "../../../config/helpers/parser";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import {
  checkIsAccountFrozen,
  getAllAutofillDataFromVault,
  getParsedDateForIngredient,
  getPasswordLimitStatus,
  searchAllAutofillDataFromVault,
} from "../../abstractions/vault/get";
import { pushWebcardMetadataInStore } from "../../commands/private-types";
import {
  putRequestOriginInState,
  validateWebauthnRequestSender,
} from "../authentication/webauthn/webauthn-common";
import { buildWebcardItemsForWebauthnConditionalUi } from "../authentication/webauthn/webauthn-conditional-ui";
import { getValueToFillFromVaultItem } from "./apply-autofill-recipe-handler";
import { getFormattedWebcardItem } from "./get-formatted-webcard-item";
import { MAPPED_DOMAINS } from "./urls-lists";
import {
  asyncArrayFilterHelper,
  extractSilentDeploy,
  getEmailDomain,
  isCredentialAllowedOnThisUrl,
  isLabelInFormClassification,
  isUrlUnsecure,
} from "./utils";
export const MAX_NUMBER_OF_ITEMS_IN_DROPDOWN = 20;
export const fetchAutofillableVaultViewsForIngredient = async (
  context: AutofillEngineContext,
  tabUrl: string,
  vaultIngredient: VaultIngredient,
  searchValue?: string,
  limit?: number
): Promise<VaultAutofillView[]> => {
  let items: VaultAutofillView[] = [];
  const vaultType = vaultIngredient.type;
  const tabRootDomain = new ParsedURL(tabUrl).getRootDomain();
  if (vaultType === VaultSourceType.GeneratedPassword) {
    items = await getAllAutofillDataFromVault({
      context,
      url: tabUrl,
      vaultType,
      queryOptions: {
        sortCriteria: [
          {
            field: "generatedDate",
            direction: "descend",
          },
        ],
        filterCriteria: [
          { field: "domain", type: "equals", value: tabRootDomain },
        ],
      },
      limit: 1,
    });
  } else if (searchValue) {
    items = (
      await searchAllAutofillDataFromVault({
        context,
        searchQuery: searchValue,
        domain: tabUrl,
        itemTypes: [vaultType],
        sorting: { property: "lastUse", direction: "descend" },
        limit,
      })
    ).items as VaultAutofillView[];
  } else {
    items = await getAllAutofillDataFromVault({
      context,
      url: tabUrl,
      vaultType,
      queryOptions: {
        sortCriteria: [
          {
            field: "lastUse",
            direction: "descend",
          },
        ],
        filterCriteria: [],
      },
      limit,
    });
  }
  return asyncArrayFilterHelper(items, async (item) => {
    const isCredential = vaultType === VaultSourceType.Credential;
    const isAllowedOnThisUrl = isCredential
      ? isCredentialAllowedOnThisUrl(item as CredentialAutofillView, tabUrl)
      : true;
    return (
      isAllowedOnThisUrl &&
      (Boolean(
        await getValueToFillFromVaultItem(context, {
          ingredient: vaultIngredient,
          vaultItem: item,
        })
      ) ||
        Boolean(getParsedDateForIngredient(vaultIngredient, item)))
    );
  });
};
async function buildReactivationWebcardData(
  context: AutofillEngineContext,
  tabRootDomain: string,
  focusInformations: FocusInformations,
  webcardId?: string
): Promise<
  ReactivationWebcardData | WebAuthnReactivationWebcardData | undefined
> {
  const reactivationStatus =
    await context.connectors.carbon.getReactivationStatus();
  if (reactivationStatus === ReactivationStatus.DISABLED) {
    return undefined;
  }
  if (
    OtherSourceType.WebauthnConditionalUI in focusInformations.autofillRecipes
  ) {
    return undefined;
  }
  const reactivationWebcardData: ReactivationWebcardData = {
    webcardId: webcardId ?? uuidv4(),
    webcardType: WebcardType.AutofillDropdown,
    configuration: AutofillDropdownWebcardConfiguration.Reactivation,
    formType: focusInformations.formClassification,
    srcElement: focusInformations,
    autofillRecipes: focusInformations.autofillRecipes,
    tabRootDomain,
    extensionShortcuts: await getOpenPopupShortcutValues(),
  };
  const localAccounts = await context.connectors.carbon.getLocalAccounts();
  const lastSuccessfulLoginAccount = localAccounts.find(
    (account) => account.isLastSuccessfulLogin
  );
  if (
    lastSuccessfulLoginAccount?.rememberMeType === "webauthn" &&
    !lastSuccessfulLoginAccount.shouldAskMasterPassword
  ) {
    const webauthnReactivationWebcardData: WebAuthnReactivationWebcardData = {
      ...reactivationWebcardData,
      configuration: AutofillDropdownWebcardConfiguration.WebAuthnReactivation,
    };
    return webauthnReactivationWebcardData;
  }
  return reactivationWebcardData;
}
const getClassicDropdownWarning = async (
  context: AutofillEngineContext,
  tabUrl: string,
  tabRootDomain: string,
  frameUrl: string,
  frameSandboxed: boolean,
  webcardItems: WebcardItem[]
): Promise<WarningData> => {
  const defaultValues: WarningData = {
    warningType: AutofillDropdownWebcardWarningType.None,
    warningContext: "",
  };
  if (isUrlUnsecure(tabUrl)) {
    return {
      warningType: AutofillDropdownWebcardWarningType.UnsecureProtocol,
      warningContext: "",
    };
  }
  if (
    frameSandboxed &&
    webcardItems.some((item) => item.itemType === VaultSourceType.Credential)
  ) {
    return {
      warningType: AutofillDropdownWebcardWarningType.UnsecureIframe,
      warningContext: `UIF@sandbox`.slice(0, 50),
    };
  }
  const frameRootDomain = new ParsedURL(frameUrl).getRootDomain();
  if (tabRootDomain && frameRootDomain && tabRootDomain !== frameRootDomain) {
    const credentialsIdForFrame = (
      await getAllAutofillDataFromVault({
        context,
        vaultType: VaultSourceType.Credential,
        url: frameUrl,
      })
    ).map((cred) => cred.id);
    if (
      !webcardItems.some(
        (item) =>
          item.itemType === VaultSourceType.Credential &&
          credentialsIdForFrame.includes(item.itemId)
      )
    ) {
      return {
        warningType: AutofillDropdownWebcardWarningType.UnsecureIframe,
        warningContext: `UIF@${frameUrl}`.slice(0, 50),
      };
    }
  }
  return defaultValues;
};
export const getPremiumStatusSpaceItemView = (
  item: VaultAutofillView,
  premiumStatusSpacesList: PremiumStatusSpaceItemView[]
) => {
  if ("spaceId" in item) {
    return premiumStatusSpacesList.find(
      (space) => space.spaceId === item.spaceId
    );
  }
  return undefined;
};
async function buildWebcardItemsForVaultSource(
  context: AutofillEngineContext,
  tabUrl: string,
  focusInformations: FocusInformations,
  vaultType: VaultSourceType,
  autofillRecipe: AutofillRecipe,
  premiumStatusSpaces: PremiumStatusSpaceItemView[],
  limit: number,
  searchValue?: string
): Promise<
  {
    webcardItem: WebcardItem;
    vaultItem: VaultAutofillView;
  }[]
> {
  const vaultIngredient = autofillRecipe.ingredients.find(
    ({ frameId, srcElementId }) =>
      frameId === focusInformations.frameId &&
      srcElementId === focusInformations.elementId
  )?.ingredient;
  if (
    !vaultIngredient ||
    !isVaultIngredient(vaultIngredient) ||
    vaultType !== vaultIngredient.type
  ) {
    return [];
  }
  const formLabels = parseFormClassifications(
    focusInformations.formClassification
  );
  return (
    await fetchAutofillableVaultViewsForIngredient(
      context,
      tabUrl,
      vaultIngredient,
      searchValue,
      limit
    )
  )
    .filter((item) => {
      if (
        formLabels.includes("change_password") &&
        item.vaultType === VaultSourceType.Credential
      ) {
        return (
          !item.sharingStatus.isShared || item.sharingStatus.hasAdminPermission
        );
      }
      return true;
    })
    .map((item) => ({
      webcardItem: getFormattedWebcardItem({
        vaultType,
        vaultItem: item,
        premiumStatusSpace: getPremiumStatusSpaceItemView(
          item,
          premiumStatusSpaces
        ),
      }),
      vaultItem: item,
    }));
}
interface WebcardItemsByTypeAndMetadata {
  readonly webcardItemsByType: {
    [K in VaultSourceType]?: {
      readonly webcardItem: WebcardItem;
      readonly vaultItem: VaultAutofillView;
    }[];
  };
  readonly metadata: WebcardMetadataStore;
}
async function buildWebcardItemsAndMetadata(
  context: AutofillEngineContext,
  tabUrl: string,
  sender: chrome.runtime.MessageSender,
  focusInformations: FocusInformations,
  searchValue?: string
): Promise<WebcardItemsByTypeAndMetadata> {
  const autofillRecipes = focusInformations.autofillRecipes;
  let premiumStatusSpaces = await context.connectors.carbon.getSpaces();
  premiumStatusSpaces =
    premiumStatusSpaces.length > 1 ? premiumStatusSpaces : [];
  const webcardItemsByType: {
    [K in VaultSourceType]?: {
      webcardItem: WebcardItem;
      vaultItem: VaultAutofillView;
    }[];
  } = {};
  let metadata: WebcardMetadataStore = {};
  const autofillRecipesEntries = Object.entries(autofillRecipes) as [
    AutofillDataSourceType,
    AutofillRecipe
  ][];
  await Promise.all(
    autofillRecipesEntries.map(async ([sourceType, autofillRecipe]) => {
      const webcardItemsCount = Object.keys(webcardItemsByType).reduce(
        (acc, items) => acc + items.length,
        0
      );
      if (
        webcardItemsCount >= MAX_NUMBER_OF_ITEMS_IN_DROPDOWN &&
        isVaultSourceType(sourceType)
      ) {
        return;
      }
      if (
        sourceType === OtherSourceType.WebauthnConditionalUI &&
        focusInformations.conditionalUiRequest
      ) {
        const conditionalUiItems =
          await buildWebcardItemsForWebauthnConditionalUi(
            context,
            sender,
            focusInformations,
            premiumStatusSpaces,
            searchValue
          );
        if (conditionalUiItems.length > 0) {
          webcardItemsByType[VaultSourceType.Passkey] = conditionalUiItems;
        }
        metadata = pushWebcardMetadataInStore(metadata, {
          type: WebcardMetadataType.WebauthnRequest,
          request: focusInformations.conditionalUiRequest,
        });
      }
      if (isVaultSourceType(sourceType)) {
        if (
          sourceType === VaultSourceType.Passkey &&
          webcardItemsByType[VaultSourceType.Passkey]
        ) {
          context.logException(
            new Error(
              "Can not create webcard items for both conditional UI and passkey autofill at the same time"
            ),
            {
              fileName: `userFocusOnElementHandler.ts`,
              funcName: `buildAutofillDropdownWebcardItems`,
            }
          );
          return;
        }
        const items = await buildWebcardItemsForVaultSource(
          context,
          tabUrl,
          focusInformations,
          sourceType,
          autofillRecipe,
          premiumStatusSpaces,
          MAX_NUMBER_OF_ITEMS_IN_DROPDOWN - webcardItemsCount + 1,
          searchValue
        );
        webcardItemsByType[sourceType] = items;
      }
    })
  );
  return {
    webcardItemsByType,
    metadata,
  };
}
export async function buildAutofillDropdownWebcardItems(
  context: AutofillEngineContext,
  tabUrl: string,
  sender: chrome.runtime.MessageSender,
  focusInformations: FocusInformations,
  searchValue?: string
): Promise<{
  webcardItems: WebcardItem[];
  metadata: WebcardMetadataStore;
}> {
  const items = await buildWebcardItemsAndMetadata(
    context,
    tabUrl,
    sender,
    focusInformations,
    searchValue
  );
  let { webcardItemsByType } = items;
  const formLabels = parseFormClassifications(
    focusInformations.formClassification
  );
  if (
    formLabels.includes("login") &&
    (webcardItemsByType[VaultSourceType.Credential]?.length ||
      webcardItemsByType[VaultSourceType.Passkey]?.length)
  ) {
    webcardItemsByType = {
      [VaultSourceType.Credential]:
        webcardItemsByType[VaultSourceType.Credential] ?? [],
      [VaultSourceType.Passkey]:
        webcardItemsByType[VaultSourceType.Passkey] ?? [],
    };
  }
  if (
    webcardItemsByType[VaultSourceType.Credential]?.length &&
    webcardItemsByType[VaultSourceType.Email]?.length
  ) {
    const credEmails = webcardItemsByType[VaultSourceType.Credential].map(
      ({ vaultItem }) => (vaultItem as CredentialAutofillView).email
    );
    const filteredEmails = webcardItemsByType[VaultSourceType.Email].filter(
      ({ vaultItem }) =>
        !credEmails.includes((vaultItem as EmailAutofillView).email)
    );
    webcardItemsByType[VaultSourceType.Email] = filteredEmails;
  }
  const webcardItems = Object.values(webcardItemsByType)
    .flatMap((item) => item)
    .map((item) => item.webcardItem);
  return {
    webcardItems,
    metadata: items.metadata,
  };
}
async function buildClassicDropdownWebcardData(
  context: AutofillEngineContext,
  tabUrl: string,
  frameUrl: string,
  sender: chrome.runtime.MessageSender,
  focusInformations: FocusInformations,
  webcardId = uuidv4()
): Promise<ClassicDropdownWebcardData> {
  const autofillRecipes = focusInformations.autofillRecipes;
  const tabRootDomain = new ParsedURL(tabUrl).getRootDomain();
  const { webcardItems, metadata } = await buildAutofillDropdownWebcardItems(
    context,
    tabUrl,
    sender,
    focusInformations
  );
  const sourceTypes = Object.keys(autofillRecipes) as AutofillDataSourceType[];
  const fieldType = sourceTypes.filter(isVaultSourceType);
  const frameSandboxed = focusInformations.frameSandboxed;
  const webauthnRequest = focusInformations.conditionalUiRequest;
  const withSearch = !metadata[WebcardMetadataType.WebauthnRequest];
  const withNonDashlaneKeyButton =
    !!metadata[WebcardMetadataType.WebauthnRequest];
  const { warningType, warningContext } = await getClassicDropdownWarning(
    context,
    tabUrl,
    tabRootDomain,
    frameUrl,
    frameSandboxed,
    webcardItems
  );
  return {
    webcardId,
    webcardType: WebcardType.AutofillDropdown,
    configuration: AutofillDropdownWebcardConfiguration.Classic,
    items: webcardItems,
    moreItemsAvailable: webcardItems.length > MAX_NUMBER_OF_ITEMS_IN_DROPDOWN,
    formType: focusInformations.formClassification,
    srcElement: focusInformations,
    autofillRecipes,
    warningType,
    context: warningContext,
    fieldType,
    tabRootDomain,
    tabUrl,
    metadata,
    withSearch,
    withNonDashlaneKeyButton,
    webauthnRequest,
  };
}
async function getGeneratePasswordWarning(
  tabUrl: string,
  formType: string,
  context: AutofillEngineContext,
  isB2BDiscontinued: boolean
): Promise<WarningData> {
  const defaultValues: WarningData = {
    warningType: AutofillDropdownWebcardWarningType.None,
    warningContext: "",
  };
  if (isB2BDiscontinued) {
    return {
      warningType: AutofillDropdownWebcardWarningType.B2BDiscontinued,
      warningContext: "",
    };
  }
  if (isUrlUnsecure(tabUrl)) {
    return {
      warningType: AutofillDropdownWebcardWarningType.UnsecureProtocol,
      warningContext: "",
    };
  }
  if (isLabelInFormClassification(formType, "change_password")) {
    const userLoginStatus =
      await context.connectors.carbon.getUserLoginStatus();
    const [loginDomainName, rootDomainName] = [
      new ParsedURL(getEmailDomain(userLoginStatus.login)).getRootDomainName(),
      new ParsedURL(tabUrl).getRootDomainName(),
    ];
    const mappedEmailDomain = MAPPED_DOMAINS[rootDomainName] ?? [];
    if (
      loginDomainName &&
      (mappedEmailDomain.includes(loginDomainName) ||
        loginDomainName === rootDomainName)
    ) {
      return {
        warningType:
          AutofillDropdownWebcardWarningType.PasswordGenerationDashlaneLogin,
        warningContext: "",
      };
    }
  }
  if (isLabelInFormClassification(formType, "register")) {
    const credentialsForThisDomain = await getAllAutofillDataFromVault({
      context,
      url: tabUrl,
      vaultType: VaultSourceType.Credential,
      queryOptions: {
        sortCriteria: [
          {
            field: "lastUse",
            direction: "descend",
          },
        ],
        filterCriteria: [],
      },
    });
    return credentialsForThisDomain.length > 0
      ? {
          warningType:
            AutofillDropdownWebcardWarningType.PossibleDuplicateRegistration,
          warningContext: credentialsForThisDomain[0].id,
        }
      : defaultValues;
  }
  return defaultValues;
}
async function buildGeneratePasswordWebcardData(
  context: AutofillEngineContext,
  focusInformations: FocusInformations,
  tabUrl: string,
  webcardId?: string
): Promise<GeneratePasswordWebcardData> {
  const formType = focusInformations.formClassification;
  const tabRootDomain = new ParsedURL(tabUrl).getRootDomain();
  const passwordLimitStatus = await getPasswordLimitStatus(context);
  const showAccountFrozenStatus = await checkIsAccountFrozen(context);
  const carbon = context.connectors.carbon;
  const settings = await carbon.getPasswordGenerationSettings();
  const { warningType, warningContext } = await getGeneratePasswordWarning(
    tabUrl,
    formType,
    context,
    showAccountFrozenStatus.isB2BDiscontinued
  );
  return {
    webcardId: webcardId ?? uuidv4(),
    webcardType: WebcardType.AutofillDropdown,
    configuration: AutofillDropdownWebcardConfiguration.GeneratePassword,
    passwordLimitStatus,
    passwordGenerationSettings: settings,
    formType,
    srcElement: focusInformations,
    autofillRecipes: focusInformations.autofillRecipes,
    warningType,
    context: warningContext,
    tabRootDomain,
    showAccountFrozenStatus,
  };
}
export async function buildDropdownWebcardData(
  context: AutofillEngineContext,
  tabUrl: string,
  frameUrl: string,
  sender: chrome.runtime.MessageSender,
  focusInformations: FocusInformations,
  webcardId?: string
): Promise<AutofillDropdownWebcardData> {
  const classicWebcardData = await buildClassicDropdownWebcardData(
    context,
    tabUrl,
    frameUrl,
    sender,
    focusInformations,
    webcardId
  );
  if (
    classicWebcardData.items.length === 0 &&
    focusInformations.autofillRecipes[OtherSourceType.NewPassword]
  ) {
    return buildGeneratePasswordWebcardData(
      context,
      focusInformations,
      tabUrl,
      webcardId
    );
  }
  return classicWebcardData;
}
const buildAccountFrozenDropdownWebcardData = async (
  context: AutofillEngineContext,
  sender: chrome.runtime.MessageSender,
  tabUrl: string,
  focusInformations: FocusInformations,
  passwordLimit: number
): Promise<AccountFrozenDropdownWebcardData> => {
  const sourceTypes = Object.keys(
    focusInformations.autofillRecipes
  ) as AutofillDataSourceType[];
  const fieldType = sourceTypes.filter(isVaultSourceType);
  const { webcardItems } = await buildAutofillDropdownWebcardItems(
    context,
    tabUrl,
    sender,
    focusInformations
  );
  let cardTitleSourceType = undefined;
  if (webcardItems.length) {
    cardTitleSourceType = webcardItems[0].itemType;
  } else if (fieldType.length) {
    cardTitleSourceType = fieldType[0];
  } else if (focusInformations.autofillRecipes[OtherSourceType.NewPassword]) {
    cardTitleSourceType = OtherSourceType.NewPassword;
  }
  return {
    formType: focusInformations.formClassification,
    srcElement: focusInformations,
    autofillRecipes: focusInformations.autofillRecipes,
    webcardId: uuidv4(),
    webcardType: WebcardType.AutofillDropdown,
    configuration: AutofillDropdownWebcardConfiguration.AccountFrozen,
    cardTitleSourceType,
    passwordLimit,
  };
};
export const userFocusOnElementHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  focusInformations: FocusInformations
) => {
  const userFocusReceivingTime = Date.now();
  const userFocusSendingTime = context.command?.timestamp ?? 0;
  if (!sender.tab?.url || !sender.url) {
    return;
  }
  const tabRootDomain = new ParsedURL(sender.tab.url).getRootDomain();
  const userLoginStatus = await context.connectors.carbon.getUserLoginStatus();
  const silentDeploy = await extractSilentDeploy();
  let webcardData;
  if (userLoginStatus.loggedIn) {
    webcardData = await buildDropdownWebcardData(
      context,
      sender.tab.url,
      sender.url,
      sender,
      focusInformations
    );
    const shouldShowFrozenWebcard =
      (await checkIsAccountFrozen(context)).isB2CFrozen &&
      isClassicDropdownWebcard(webcardData) &&
      !webcardData.metadata?.[WebcardMetadataType.WebauthnRequest] &&
      webcardData.items.every(
        (item) => item.itemType !== VaultSourceType.Passkey
      );
    const { limit: passwordLimit } = await getPasswordLimitStatus(context);
    if (shouldShowFrozenWebcard && !passwordLimit) {
      context.logException(
        new Error("User is frozen but there is no known password limit")
      );
    }
    if (shouldShowFrozenWebcard && !!passwordLimit) {
      webcardData = await buildAccountFrozenDropdownWebcardData(
        context,
        sender,
        sender.tab.url,
        focusInformations,
        passwordLimit
      );
    }
  } else if (!silentDeploy) {
    webcardData = await buildReactivationWebcardData(
      context,
      tabRootDomain,
      focusInformations
    );
  }
  if (webcardData) {
    const request = focusInformations.conditionalUiRequest;
    if (
      webcardData.metadata?.[WebcardMetadataType.WebauthnRequest] &&
      request
    ) {
      const { requestOrigin } = validateWebauthnRequestSender(sender, request);
      await putRequestOriginInState(
        context,
        webcardData.webcardId,
        requestOrigin
      );
    }
    actions.showWebcard(
      AutofillEngineActionTarget.MainFrame,
      webcardData,
      userLoginStatus.loggedIn && userFocusSendingTime
        ? {
            userFocus: {
              sendingTime: userFocusSendingTime,
              receivingTime: userFocusReceivingTime,
              processingEndTime: Date.now(),
            },
          }
        : undefined
    );
  }
};
