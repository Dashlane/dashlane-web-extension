import {
  CredentialAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { ActivityLogType } from "@dashlane/risk-monitoring-contracts";
import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { isSuccess } from "@dashlane/framework-types";
import { ParsedURL } from "@dashlane/url-parser";
import { firstValueFrom } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { VaultItemType } from "@dashlane/vault-contracts";
import { AutofillEngineContext } from "../../../Api/server/context";
import {
  AutofillableFormsValues,
  AutofillableFormValues,
  FormDetails,
} from "../../../Api/types/autofill";
import { DataCaptureWebcardItem } from "../../../Api/types/data-capture";
import { B2CFrozenDialogWebcardData } from "../../../Api/types/webcards/b2c-frozen-dialog-webcard";
import { DataCaptureWebcardData } from "../../../Api/types/webcards/data-capture-webcard";
import { LinkedWebsiteUpdateConfirmationData } from "../../../Api/types/webcards/linked-website-update-confirmation-webcard";
import { SavePasswordWebcardData } from "../../../Api/types/webcards/save-password-webcard";
import { WebcardType } from "../../../Api/types/webcards/webcard-data-base";
import {
  checkHasLinkedWebsitesInContext,
  checkHasSharedCollectionInSaveWebcard,
} from "../../../config/feature-flips";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import {
  checkIsAccountFrozen,
  getAllAutofillDataFromVault,
  getNumberOfItemsFromVault,
  getPasswordLimitStatus,
} from "../../abstractions/vault/get";
import {
  canDisplayNewPersistentWebcard,
  showPersistentWebcard,
} from "../../abstractions/webcardPersistence/persistent-webcards";
import { getFormattedWebcardItem } from "../autofill/get-formatted-webcard-item";
import { getSavePasswordBusinessSpaceData } from "./business-space-helpers";
import {
  CapturedCredentialData,
  compareCapturedAndExistingCredential,
  findCapturedCredentialData,
  forgetDataCaptureStepData,
  getValidUrlForCredentialCapture,
  isCapturedCredentialAlreadyInVault,
} from "./credential-capture-helpers";
import { getDataCaptureWebcardItem } from "./get";
import {
  CapturedPersonalData,
  findCapturedPersonalData,
  minimumNumberOfDataCaptureFieldsMap,
  shouldShowDataCaptureForVaultTypeMap,
} from "./personal-data-capture-helpers";
import { retriveLocalAndSharedCollections } from "./collections-helper";
const getExistingCredentialsForUrl = (
  context: AutofillEngineContext,
  url: string
): Promise<CredentialAutofillView[]> => {
  return getAllAutofillDataFromVault({
    context,
    url,
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
};
const getEmailItemsForUrl = (context: AutofillEngineContext, url: string) => {
  return getAllAutofillDataFromVault({
    context,
    url,
    vaultType: VaultSourceType.Email,
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
};
const getDropdownLoginOptions = async (
  context: AutofillEngineContext,
  url: string
) => {
  return (await getEmailItemsForUrl(context, url)).map((item) => item.email);
};
const getDefaultEmailOrLogin = async (
  context: AutofillEngineContext,
  url: string,
  capturedEmailOrLogin?: string
) => {
  if (capturedEmailOrLogin) {
    return capturedEmailOrLogin;
  }
  const emails = await getEmailItemsForUrl(context, url);
  return emails.length === 1 ? emails[0].email : "";
};
export const buildSavePasswordWebcardData = async (
  context: AutofillEngineContext,
  formClassification: string,
  savePasswordInfos: {
    newPassword: string;
    url: string;
    capturedEmailOrLogin?: string;
    capturedSecondaryLogin?: string;
    capturedEmail?: string;
    capturedLogin?: string;
  },
  webcardId?: string
): Promise<SavePasswordWebcardData> => {
  const state = await context.state.tab.get();
  const userLoginStatus = await context.connectors.carbon.getUserLoginStatus();
  const parsedURL = new ParsedURL(savePasswordInfos.url);
  const domain = parsedURL.getRootDomain();
  const subdomain = parsedURL.getSubdomain();
  const fulldomain = parsedURL.getHostname();
  let premiumStatusSpaces = await context.connectors.carbon.getSpaces();
  premiumStatusSpaces =
    premiumStatusSpaces.length > 1 ? premiumStatusSpaces : [];
  const existingCredentials = await getExistingCredentialsForUrl(
    context,
    savePasswordInfos.url
  );
  const passwordLimitStatus = await getPasswordLimitStatus(context);
  const showAccountFrozenStatus = await checkIsAccountFrozen(context);
  const formattedExistingCredentialsFullRights = existingCredentials
    .filter(
      ({ sharingStatus }) =>
        !sharingStatus.isShared || sharingStatus.hasAdminPermission
    )
    .map((credential) =>
      getFormattedWebcardItem({
        vaultType: VaultSourceType.Credential,
        vaultItem: credential,
        premiumStatusSpace: premiumStatusSpaces.find(
          (space: PremiumStatusSpaceItemView) =>
            space.spaceId === credential.spaceId
        ),
      })
    );
  const defaultEmailOrLogin = await getDefaultEmailOrLogin(
    context,
    savePasswordInfos.url,
    savePasswordInfos.capturedEmailOrLogin
  );
  const dropdownLoginOptions = await getDropdownLoginOptions(
    context,
    savePasswordInfos.url
  );
  const isSSOUser = await context.connectors.carbon.getIsSSOUser();
  const accountAuthenticationType =
    await context.connectors.carbon.getAccountAuthenticationType();
  const allowMasterPasswordProtection =
    !isSSOUser && accountAuthenticationType === "masterPassword";
  const { showSpacesList, spaces, defaultSpace } =
    getSavePasswordBusinessSpaceData(
      await context.connectors.carbon.getSpaces(),
      defaultEmailOrLogin,
      fulldomain
    );
  const isSharedCollectionInSaveWebcardEnabled =
    await checkHasSharedCollectionInSaveWebcard(context.connectors);
  const allCollections = isSharedCollectionInSaveWebcardEnabled
    ? await retriveLocalAndSharedCollections(context)
    : [];
  const { capturedEmail, capturedLogin, capturedSecondaryLogin } =
    savePasswordInfos;
  const credentialUrl =
    state.dataCaptureStepData?.firstStepUrl ?? savePasswordInfos.url;
  void forgetDataCaptureStepData(context);
  return {
    webcardId: webcardId ?? uuidv4(),
    webcardType: WebcardType.SavePassword,
    formType: formClassification,
    capturedUsernames: {
      email: capturedEmail ?? "",
      login: capturedLogin ?? "",
      secondaryLogin: capturedSecondaryLogin ?? "",
    },
    emailOrLogin: defaultEmailOrLogin,
    existingCredentialsForDomain: formattedExistingCredentialsFullRights,
    dropdownLoginOptions: dropdownLoginOptions,
    domain,
    subdomain,
    fullDomain: fulldomain,
    url: getValidUrlForCredentialCapture(credentialUrl),
    loggedIn: userLoginStatus.loggedIn,
    allowMasterPasswordProtection,
    showSubdomainOpt: Boolean(subdomain),
    space: defaultSpace,
    showSpacesList,
    spaces,
    passwordToSave: savePasswordInfos.newPassword,
    passwordLimitStatus,
    showAccountFrozenStatus,
    collections: allCollections,
    showCollectionList:
      isSharedCollectionInSaveWebcardEnabled && allCollections.length > 0,
  };
};
export const buildB2CFrozenDialogWebcardData = (
  context: AutofillEngineContext,
  tabUrl: string,
  formClassification: string,
  passwordLimit: number,
  webcardId?: string
): B2CFrozenDialogWebcardData => {
  const parsedURL = new ParsedURL(tabUrl);
  const savePasswordDisplayUrl = parsedURL.getHostname();
  return {
    webcardId: webcardId ?? uuidv4(),
    webcardType: WebcardType.B2CFrozenDialog,
    savePasswordDisplayUrl,
    formType: formClassification,
    passwordLimit,
  };
};
const isSubdomainOfExistingCredential = (
  existingCredentialUrl: ParsedURL,
  capturedUrl: ParsedURL
) => {
  return (
    existingCredentialUrl.getRootDomain() === capturedUrl.getRootDomain() &&
    capturedUrl.getSubdomain() !== ""
  );
};
const checkIfShouldBeAddedAsLinkedWebsite = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  url: string,
  capturedCredentialData: CapturedCredentialData,
  lastFollowUpNotificationItemId: string | undefined
): Promise<boolean> => {
  if (lastFollowUpNotificationItemId) {
    const credentialResult = await firstValueFrom(
      context.grapheneClient.vaultItemsCrud.queries.query({
        vaultItemTypes: [VaultItemType.Credential],
        ids: [lastFollowUpNotificationItemId],
      })
    );
    const credentialPreferences = await firstValueFrom(
      context.grapheneClient.autofillSettings.queries.getPreferencesForCredentials(
        {
          credentialIds: [lastFollowUpNotificationItemId],
        }
      )
    );
    if (
      isSuccess(credentialResult) &&
      isSuccess(credentialPreferences) &&
      credentialResult.data.credentialsResult.matchCount > 0
    ) {
      const existingCredential =
        credentialResult.data.credentialsResult.items[0];
      const dashlaneLinkedWebsite = await firstValueFrom(
        context.grapheneClient.linkedWebsites.queries.getDashlaneDefinedLinkedWebsites(
          {
            url: existingCredential.URL,
          }
        )
      );
      const parsedExistingCredentialUrl = new ParsedURL(existingCredential.URL);
      const parsedCurrentUrl = new ParsedURL(url);
      const currentTabHostname = parsedCurrentUrl.getHostname();
      const isSubdomain = isSubdomainOfExistingCredential(
        parsedExistingCredentialUrl,
        parsedCurrentUrl
      );
      const isValidSubdomainIfApplicable = isSubdomain
        ? parsedCurrentUrl.getSubdomain() !== "www" &&
          credentialPreferences.data[0]?.onlyAutofillExactDomain
        : true;
      if (
        isValidSubdomainIfApplicable &&
        compareCapturedAndExistingCredential(
          capturedCredentialData,
          existingCredential
        ) &&
        !existingCredential.linkedURLs.includes(currentTabHostname) &&
        isSuccess(dashlaneLinkedWebsite) &&
        !dashlaneLinkedWebsite.data.includes(currentTabHostname)
      ) {
        const linkedWebsiteConfirmationWebcard: LinkedWebsiteUpdateConfirmationData =
          {
            webcardType: WebcardType.LinkedWebsiteUpdateConfirmation,
            webcardId: uuidv4(),
            formType: "",
            operation: {
              credentialId: lastFollowUpNotificationItemId,
              credentialName: existingCredential.itemName,
              linkedWebsite: currentTabHostname,
            },
          };
        const addLinkedWebsiteResult =
          await context.grapheneClient.linkedWebsites.commands.addLinkedWebsite(
            {
              credentialId: lastFollowUpNotificationItemId,
              linkedWebsite: currentTabHostname,
            }
          );
        if (isSuccess(addLinkedWebsiteResult)) {
          await showPersistentWebcard(
            context,
            actions,
            linkedWebsiteConfirmationWebcard
          );
        }
        return true;
      }
    }
  }
  return false;
};
const capturePasswordFromPage = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  url: string,
  capturedCredentialData: CapturedCredentialData,
  formDetails: FormDetails,
  lastFollowUpNotificationItemId: string | undefined
) => {
  if (
    !(await canDisplayNewPersistentWebcard(
      context,
      WebcardType.FeedbackNotification
    ))
  ) {
    return;
  }
  if (await checkHasLinkedWebsitesInContext(context.connectors)) {
    if (
      await checkIfShouldBeAddedAsLinkedWebsite(
        context,
        actions,
        url,
        capturedCredentialData,
        lastFollowUpNotificationItemId
      )
    ) {
      return;
    }
  }
  const credentialAlreadyInVault = await isCapturedCredentialAlreadyInVault(
    context,
    url,
    capturedCredentialData
  );
  if (!credentialAlreadyInVault) {
    const savePasswordWebcard = await buildSavePasswordWebcardData(
      context,
      formDetails.formClassification,
      {
        newPassword: capturedCredentialData.capturedPassword,
        url,
        capturedEmailOrLogin: capturedCredentialData.capturedEmailOrLogin,
        capturedEmail: capturedCredentialData.capturedEmail,
        capturedLogin: capturedCredentialData.capturedLogin,
        capturedSecondaryLogin: capturedCredentialData.capturedSecondaryLogin,
      }
    );
    if (await showPersistentWebcard(context, actions, savePasswordWebcard)) {
      actions.subscribeLiveValuesUpdate(
        AutofillEngineActionTarget.AllFrames,
        formDetails.formId,
        savePasswordWebcard.webcardId
      );
    }
  }
};
const showB2CFrozenWarning = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  tabUrl: string,
  formDetails: FormDetails,
  passwordLimit: number
) => {
  const b2cFrozenWebcard = buildB2CFrozenDialogWebcardData(
    context,
    tabUrl,
    formDetails.formClassification,
    passwordLimit
  );
  await showPersistentWebcard(context, actions, b2cFrozenWebcard);
};
const capturePasswordOrShowFrozenWarning = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  tabUrl: string,
  capturedCredentialData: CapturedCredentialData,
  formValues: AutofillableFormValues,
  lastFollowUpNotificationItemId?: string
) => {
  const { limit: passwordLimit } = await getPasswordLimitStatus(context);
  const isAccountFrozen = (await checkIsAccountFrozen(context)).isB2CFrozen;
  if (isAccountFrozen && !passwordLimit) {
    context.logException(
      new Error("User is frozen but there is no known password limit")
    );
  }
  if (isAccountFrozen && !!passwordLimit) {
    await showB2CFrozenWarning(
      context,
      actions,
      tabUrl,
      formValues,
      passwordLimit
    );
  } else {
    await capturePasswordFromPage(
      context,
      actions,
      tabUrl,
      capturedCredentialData,
      formValues,
      lastFollowUpNotificationItemId
    );
  }
};
const buildDataCaptureWebcardData = async (
  context: AutofillEngineContext,
  capturedPersonalData: CapturedPersonalData,
  formDetails: FormDetails
): Promise<DataCaptureWebcardData> => {
  const carbon = context.connectors.carbon;
  const userLoginStatus = await carbon.getUserLoginStatus();
  const dataCaptureData = (
    Object.keys(capturedPersonalData) as Array<VaultSourceType>
  ).reduce(
    (acc: DataCaptureWebcardItem[], vaultSourceType: VaultSourceType) => {
      const capturedData = capturedPersonalData[vaultSourceType];
      if (
        shouldShowDataCaptureForVaultTypeMap[vaultSourceType] &&
        capturedData
      ) {
        const dataCaptureWebcardItem = getDataCaptureWebcardItem(
          vaultSourceType,
          capturedData
        );
        if (dataCaptureWebcardItem) {
          acc.push(dataCaptureWebcardItem);
        }
      }
      return acc;
    },
    []
  );
  return {
    webcardId: uuidv4(),
    webcardType: WebcardType.DataCapture,
    loggedIn: userLoginStatus.loggedIn,
    data: dataCaptureData,
    formType: formDetails.formClassification,
  };
};
const getVaultSourceTypesWithoutItems = async (
  unfilteredVaultSourceTypes: VaultSourceType[],
  context: AutofillEngineContext
): Promise<VaultSourceType[]> => {
  const numberOfItemsFromVaultPromises = unfilteredVaultSourceTypes.map((n) =>
    getNumberOfItemsFromVault({
      context,
      vaultType: n,
    })
  );
  const vaultResults = await Promise.all(numberOfItemsFromVaultPromises);
  return unfilteredVaultSourceTypes.filter(
    (_item, index) => vaultResults[index] === 0
  );
};
const filterValidCapturedPersonalData = async (
  context: AutofillEngineContext,
  capturedPersonalData: CapturedPersonalData
) => {
  const vaultTypes = Object.keys(capturedPersonalData) as VaultSourceType[];
  const capturableVaultTypes = vaultTypes.filter((key) => {
    const definedVaultTypes = capturedPersonalData[key] ?? [];
    return (
      shouldShowDataCaptureForVaultTypeMap[key] &&
      definedVaultTypes.length >= minimumNumberOfDataCaptureFieldsMap[key]
    );
  });
  const emptyVaultTypes = await getVaultSourceTypesWithoutItems(
    capturableVaultTypes,
    context
  );
  const allValidResults: CapturedPersonalData = {};
  emptyVaultTypes.forEach((type) => {
    allValidResults[type] = capturedPersonalData[type];
  });
  return allValidResults;
};
const capturePersonalDataFromPage = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  capturedPersonalData: CapturedPersonalData,
  formDetails: FormDetails
) => {
  if ((await checkIsAccountFrozen(context)).isB2CFrozen) {
    return;
  }
  const validCapturedPersonalData = await filterValidCapturedPersonalData(
    context,
    capturedPersonalData
  );
  if (Object.keys(validCapturedPersonalData).length > 0) {
    const dataCaptureWebcard = await buildDataCaptureWebcardData(
      context,
      validCapturedPersonalData,
      formDetails
    );
    await showPersistentWebcard(context, actions, dataCaptureWebcard);
  }
};
export const captureDataFromPageHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  formValues: AutofillableFormsValues,
  lastFollowUpNotificationItemId?: string
): Promise<void> => {
  const loginStatus = await context.connectors.carbon.getUserLoginStatus();
  let isLoggedOutMonitoringEnabled = false;
  if (!loginStatus.loggedIn) {
    try {
      const isLoggedOutMonitoringEnabledResult = await firstValueFrom(
        context.connectors.grapheneClient.loggedOutMonitoring.queries.isLoggedOutMonitoringEnabledForDevice()
      );
      isLoggedOutMonitoringEnabled =
        isSuccess(isLoggedOutMonitoringEnabledResult) &&
        isLoggedOutMonitoringEnabledResult.data.isEnabled;
    } catch {
      isLoggedOutMonitoringEnabled = false;
    }
  }
  if (!loginStatus.loggedIn && !isLoggedOutMonitoringEnabled) {
    return;
  }
  if (Object.keys(formValues).length < 1) {
    return;
  }
  const formId = Object.keys(formValues)[0];
  const elementValues = formValues[formId].elementValues;
  if (!sender.tab?.url || formValues[formId].preventDataCapture) {
    return;
  }
  const capturedCredentialData = await findCapturedCredentialData(
    elementValues,
    sender.tab.url,
    context
  );
  if (loginStatus.loggedIn) {
    if (capturedCredentialData) {
      await capturePasswordOrShowFrozenWarning(
        context,
        actions,
        sender.tab.url,
        capturedCredentialData,
        formValues[formId],
        lastFollowUpNotificationItemId
      );
    } else {
      const capturedPersonalData = findCapturedPersonalData(elementValues);
      await capturePersonalDataFromPage(
        context,
        actions,
        capturedPersonalData,
        formValues[formId]
      );
    }
  } else {
    if (isLoggedOutMonitoringEnabled && capturedCredentialData) {
      const passwordRisks = await firstValueFrom(
        context.connectors.grapheneClient.loggedOutMonitoring.queries.analysePasswordForRisks(
          { password: capturedCredentialData.capturedPassword }
        )
      );
      if (
        isSuccess(passwordRisks) &&
        (passwordRisks.data.isCompromised || passwordRisks.data.isWeak)
      ) {
        context.connectors.grapheneClient.loggedOutMonitoring.commands.sendRiskyPasswordLoggedOutLog(
          {
            risk: passwordRisks.data.isCompromised
              ? ActivityLogType.UserTypedCompromisedPassword
              : ActivityLogType.UserTypedWeakPassword,
            domain: new ParsedURL(sender.tab.url).getRootDomain(),
            dateTime: new Date().getTime(),
            uuid: uuidv4().toUpperCase(),
          }
        );
      }
    }
  }
};
