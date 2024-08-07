import { VaultSourceType } from "@dashlane/autofill-contracts";
import { Features, PaymentUpdateToken } from "@dashlane/communication";
import { FeatureFlips } from "@dashlane/framework-contracts";
import {
  AutofillCredentialsAtRisk,
  AutofillOperations,
  AutofillRecipesByFormId,
  UnrecognizedField,
  VaultIngredient,
} from "./autofill";
import { WebcardPerformanceMetrics } from "./performance";
import {
  AssertionCredentialJSON,
  ExtendedWebauthnCreateResult,
  PublicKeyCredentialRequestOptionsJSON,
  WebauthnGetConditionalUiRequest,
  WebauthnResult,
  WebAuthnStatus,
} from "./webauthn";
import { WebcardData } from "./webcards/webcard-data";
import { WebcardItem, WebcardItemProperties } from "./webcards/webcard-item";
export interface UserDetails {
  isLoggedIn: boolean;
  features: Features;
}
export class AutofillEngineActions {
  showWebcard(
    webcardData: WebcardData,
    performanceMetrics?: WebcardPerformanceMetrics
  ): void {}
  updateWebcard(webcardData: WebcardData): void {}
  updateWebcardItems(webcardItems: WebcardItem[]): void {}
  updateWebcardItemDetails<T extends VaultSourceType>(
    itemId: string,
    itemType: T,
    itemProperties: WebcardItemProperties<T>
  ): void {}
  updateWebcardCredentialsAtRisk(
    credentialsAtRisk: AutofillCredentialsAtRisk
  ): void {}
  closeWebcard(webcardId: string): void {}
  updateAutofillRecipes(autofillRecipes: AutofillRecipesByFormId): void {}
  updateUnrecognizedElements(unrecognizedElements: UnrecognizedField[]): void {}
  computeContextMenuTargetInfo(frameId: number): void {}
  updateClientFrameId(frameId: number): void {}
  updateDomainAnalysisStatus(isAnalysisEnabled: boolean): void {}
  applyAutofillOperations(operations: AutofillOperations): void {}
  applyAutofillOperationsAndTriggerDataCapture(
    operations: AutofillOperations
  ): void {}
  setMasterPasswordValidationResult(isPasswordValidated: boolean): void {}
  updateTabActiveInfo(isTabActive: boolean): void {}
  updateUserLoginStatus(isLoggedIn: boolean): void {}
  updateUserFeatureFlips(features: FeatureFlips): void {}
  updateNewPassword(password: string, strength: number): void {}
  updateSavePasswordTargetCredential(
    spaceInfo: {
      space: string;
      showSpacesList: boolean;
    },
    credentialInfo?: {
      id: string;
      subdomain: string;
      onlyForThisSubdomain: boolean;
      isProtected: boolean;
    }
  ): void {}
  updateSavePasswordCapturedData(
    webcardId: string,
    passwordToSave: string,
    emailOrLogin: string,
    capturedUsernames: {
      email: string;
      login: string;
      secondaryLogin: string;
    }
  ): void {}
  disableDashlaneOnField(fieldId: string): void {}
  subscribeLiveValuesUpdate(formId: string, webcardId: string): void {}
  updateUserSubscriptionCode(subscriptionCode: string): void {}
  updateWebAuthnChallenge(webAuthnParameters: {
    login: string;
    publicKeyOptions: PublicKeyCredentialRequestOptionsJSON;
  }): void {}
  updateWebAuthnStatus(status: WebAuthnStatus): void {}
  updatePaymentUpdateAuthenticationToken(token: PaymentUpdateToken): void {}
  webauthnCreateResponse(
    requestId: number,
    result: ExtendedWebauthnCreateResult
  ): void {}
  webauthnGetResponse(
    requestId: number,
    result: WebauthnResult<AssertionCredentialJSON>
  ): void {}
  webauthnUseFallback(requestId: number): void {}
  webauthnStoreConditionalUiRequest(
    request: WebauthnGetConditionalUiRequest
  ): void {}
  webauthnConditionalUiSupported(value: boolean): void {}
  dataCopiedAlert(
    dataHash: string,
    itemId: string,
    vaultIngredient: VaultIngredient,
    hostnameHash?: string
  ): void {}
  copyValueToClipboard(value: string): void {}
  resendAnalysisResults(): void {}
  permissionToPaste(permission: boolean): void {}
  storeFollowUpNotificationItemId(itemId: string): void {}
}
