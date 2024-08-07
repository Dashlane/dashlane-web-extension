import {
  AutofillDataSourceOrNone,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { AdditionalInfo } from "@dashlane/communication";
import type { OpenParams } from "@dashlane/framework-infra/spi";
import { BrowseComponent, Event, PageView } from "@dashlane/hermes";
import { QueryVaultItemsOptions } from "../../implementation/modules/autofill/query-vault-items-handler";
import { AnalysisResults } from "./analysis";
import {
  AutofillableFormsValues,
  AutofillDetails,
  AutofillDetailsForOtherDataSource,
  AutofillPerformedInfos,
  DisableDashlaneOnFieldOption,
  FocusInformations,
  FormInformation,
  FormSubmitLogOptions,
  RightClickInformations,
  UserPasteDecision,
  VaultIngredient,
} from "./autofill";
import { AutofillEngineClientType } from "./client-type";
import { DataCaptureWebcardItem } from "./data-capture";
import { PendingOperation } from "./pending-operation";
import {
  AssertionCredentialJSON,
  WebauthnCreationRequest,
  WebauthnGetRequest,
  WebauthnRequest,
} from "./webauthn";
import {
  AutofillDropdownWebcardDataBase,
  AutofillDropdownWebcardPasswordGenerationSettings,
} from "./webcards/autofill-dropdown-webcard";
import {
  AbstractWebcardMetadata,
  WebcardCollectionData,
  WebcardMetadataStore,
  WebcardMetadataType,
} from "./webcards/webcard-data-base";
import { WebcardItem } from "./webcards/webcard-item";
export enum UserVerificationResult {
  Success = "success",
  Failure = "failure",
}
export class AutofillEngineCommands {
  analysisResultsAvailable(results: AnalysisResults): void {}
  documentComplete(): void {}
  userFocusOnElement(focusInformations: FocusInformations): void {}
  userRightClickOnElement(
    rightClickInformation: RightClickInformations
  ): void {}
  applyAutofillRecipe(autofillDetails: AutofillDetails): void {}
  applyAutofillRecipeForOtherDataSource(
    autofillDetails: AutofillDetailsForOtherDataSource
  ): void {}
  logAutofillPerformedEvent(credentialInfos: AutofillPerformedInfos): void {}
  disableReactivationWebcards(): void {}
  startWebAuthnLoginFlow(): void {}
  completeWebAuthnLoginFlow(
    login: string,
    credential: AssertionCredentialJSON
  ): void {}
  startWebAuthnUserVerificationFlow(): void {}
  validateWebAuthnUserVerificationFlow(
    assertion: AssertionCredentialJSON
  ): void {}
  generateNewPassword(
    settings: AutofillDropdownWebcardPasswordGenerationSettings
  ): void {}
  validateMasterPassword(password: string): void {}
  resetProtectedItemsTimerAndApplyRecipe(
    autofillDetails: AutofillDetails
  ): void {}
  disableAccessProtectionForVaultItem(id: string): void {}
  userVerificationComplete(
    pendingOperation: AbstractWebcardMetadata<WebcardMetadataType.PendingOperation>,
    result: UserVerificationResult,
    options: {
      neverAgain?: boolean;
    },
    webcardId: string
  ): void {}
  webcardClosed(webcardId: string): void {}
  saveCredential(
    wedcardId: string,
    credentialInformation: {
      emailOrLogin: string;
      capturedUsernames: {
        email: string;
        login: string;
        secondaryLogin: string;
      };
      password: string;
      url: string;
      onlyForThisSubdomain: boolean;
      protectWithMasterPassword: boolean;
      spaceId?: string;
      selectedCollection?: WebcardCollectionData;
    }
  ): void {}
  updateCredential(
    webcardId: string,
    credentialInformation: {
      id: string;
      newPassword: string;
      onlyForThisSubdomain: boolean;
      spaceId?: string;
    }
  ): void {}
  savePersonalData(personalDataInfo: DataCaptureWebcardItem[]): void {}
  cancelSaveCredential(): void {}
  findSavePasswordTargetCredential(emailOrLogin: string, url: string): void {}
  captureDataFromPage(
    formValues: AutofillableFormsValues,
    lastFollowUpNotificationItemId?: string
  ): void {}
  applySelfCorrectingAutofill(
    webcardInfos: AutofillDropdownWebcardDataBase,
    correction: {
      dataSource: AutofillDataSourceOrNone;
      selectedItem?: WebcardItem;
    }
  ): void {}
  disableDashlaneOnField(
    webcardInfos: AutofillDropdownWebcardDataBase,
    option: DisableDashlaneOnFieldOption
  ): void {}
  notifyLiveValuesUpdate(
    formValues: AutofillableFormsValues,
    webcardId: string
  ): void {}
  logEvent(event: Event): void {}
  logPageView(pageViewEvent: {
    pageView: PageView;
    browseComponent: BrowseComponent;
  }): void {}
  logException(
    source: AutofillEngineClientType,
    data: {
      message: string;
      precisions?: string;
      additionalInfo?: AdditionalInfo;
    }
  ): void {}
  getUserSubscriptionCode(): void {}
  getUserFeatureFlips(): void {}
  openNewTabWithUrl(url: string): void {}
  openWebapp(params: OpenParams): void {}
  logFormSubmit(
    logInformation: FormSubmitLogOptions,
    formInformation: FormInformation
  ): void {}
  requestPaymentUpdateAuthenticationToken(): void {}
  webauthnCreate(request: WebauthnCreationRequest): void {}
  webauthnCreateUserConfirmed(
    request: WebauthnCreationRequest,
    confirmationWebcardId: string
  ): void {}
  webauthnGet(request: WebauthnGetRequest): void {}
  webauthnGetUserConfirmed(
    request: WebauthnGetRequest,
    passkeyItemId: string,
    confirmationWebcardId: string
  ): void {}
  webauthnUseOtherAuthenticator(
    request:
      | WebauthnRequest
      | AbstractWebcardMetadata<WebcardMetadataType.WebauthnRequest>
  ): void {}
  webauthnUserCanceled(
    request:
      | WebauthnRequest
      | AbstractWebcardMetadata<WebcardMetadataType.WebauthnRequest>
  ): void {}
  webauthnIsConditionalUiSupported(): void {}
  logRightClickMenu(logInfo: {
    isFieldDetectedByAnalysisEngine: boolean;
    domain: string;
  }): void {}
  queryVaultItems(
    queryString: string,
    options?: QueryVaultItemsOptions
  ): void {}
  getVaultItemDetails(itemId: string, itemType: VaultSourceType): void {}
  getCredentialsAtRiskByIds(credentialIds: string[]): void {}
  dataCopiedToClipboardDetected(
    dataHash: string,
    itemId: string,
    vaultIngredient: VaultIngredient
  ): void {}
  dataPasteDetected(
    itemId: string,
    vaultIngredient: VaultIngredient,
    action: {
      pasteBlocked: boolean;
      noPhishingAlertLimitFlagPresent?: boolean;
    }
  ): void {}
  copyToClipboard(
    itemId: string,
    vaultIngredient: VaultIngredient,
    webcardId: string,
    previouslyCopiedProperties: VaultIngredient["property"][]
  ): void {}
  signalPasteDecision(
    userDecision: UserPasteDecision,
    metadata?: WebcardMetadataStore
  ): void {}
  webcardItemSelected(
    selectedItem: WebcardItem,
    metadata: WebcardMetadataStore,
    webcardId: string
  ): void {}
  userValidatedMasterPassword(
    pendingOperationData: PendingOperation,
    webcardId: string
  ): void {}
  removeLinkedWebsite(credentialId: string, linkedWebsite: string): void {}
}
