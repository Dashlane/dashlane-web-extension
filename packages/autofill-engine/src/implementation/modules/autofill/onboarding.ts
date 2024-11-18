import { WebOnboardingLeelooStep } from "@dashlane/communication";
import { v4 as uuidv4 } from "uuid";
import { WebcardType } from "../../../Api/types/webcards/webcard-data-base";
import {
  OnboardingNotificationConfiguration,
  OnboardingNotificationWebcardData,
} from "../../../Api/types/webcards/onboarding-notification-webcard";
import { showPersistentWebcard } from "../../../implementation/abstractions/webcardPersistence/persistent-webcards";
import { AutofillEngineActionsWithOptions } from "../../../implementation/abstractions/messaging/action-serializer";
import { AutofillEngineContext } from "../../../Api/server/context";
const DASHLANE_WEBSITE_REGEXP = "__REDACTED__";
const TRY_AUTOFILL_DEMO_PAGE = "try-autofill-demo";
const buildOnboardingNotificationWebcardData = (
  configuration: OnboardingNotificationConfiguration
): OnboardingNotificationWebcardData => {
  return {
    webcardId: uuidv4(),
    webcardType: WebcardType.OnboardingNotification,
    configuration,
    formType: "",
  };
};
export const handleOnboardingSavePasswordFlow = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  hasUserSavedCredential: boolean
): Promise<boolean> => {
  const webOnboardingMode =
    await context.connectors.carbon.getWebOnboardingMode();
  if (
    webOnboardingMode.flowSaveCredentialOnWeb &&
    !webOnboardingMode.completedSteps?.saveCredentialOnWeb
  ) {
    await showPersistentWebcard(
      context,
      actions,
      buildOnboardingNotificationWebcardData(
        hasUserSavedCredential
          ? OnboardingNotificationConfiguration.AfterSave
          : OnboardingNotificationConfiguration.AfterCancel
      )
    );
    const saveCredentialOnWeb = hasUserSavedCredential
      ? { saveCredentialOnWeb: hasUserSavedCredential }
      : null;
    const saveClickedLeelooStep =
      (webOnboardingMode.completedSteps &&
        !webOnboardingMode.completedSteps.saveCredentialOnWeb) ||
      webOnboardingMode.leelooStep ===
        WebOnboardingLeelooStep.SHOW_PASSWORD_SAVE_SUCCESS
        ? WebOnboardingLeelooStep.SHOW_PASSWORD_SAVE_SUCCESS
        : null;
    await context.connectors.legacyCarbon.updateWebOnboardingMode({
      flowCredentialInApp: false,
      flowLoginCredentialOnWeb: false,
      flowSaveCredentialOnWeb: !hasUserSavedCredential,
      leelooStep: hasUserSavedCredential
        ? saveClickedLeelooStep
        : WebOnboardingLeelooStep.SHOW_SAVE_SITES_DIALOG,
      popoverStep: null,
      completedSteps: {
        ...webOnboardingMode.completedSteps,
        ...saveCredentialOnWeb,
      },
    });
    return true;
  }
  return false;
};
export const isOnboardingSavePasswordFlowComplete = async (
  context: AutofillEngineContext
): Promise<boolean> => {
  const webOnboardingMode =
    await context.connectors.carbon.getWebOnboardingMode();
  return !(
    webOnboardingMode.flowSaveCredentialOnWeb &&
    !webOnboardingMode.completedSteps?.saveCredentialOnWeb
  );
};
export const handleOnboardingLoginFlow = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions
) => {
  const webOnboardingMode =
    await context.connectors.carbon.getWebOnboardingMode();
  if (
    webOnboardingMode.flowLoginCredentialOnWeb &&
    !webOnboardingMode.completedSteps?.loginCredentialOnWeb
  ) {
    await showPersistentWebcard(
      context,
      actions,
      buildOnboardingNotificationWebcardData(
        OnboardingNotificationConfiguration.AfterLogin
      )
    );
    await context.connectors.legacyCarbon.updateWebOnboardingMode({
      flowCredentialInApp: false,
      flowLoginCredentialOnWeb: false,
      flowSaveCredentialOnWeb: false,
      leelooStep: WebOnboardingLeelooStep.SHOW_WEB_SAVE_AND_AUTOLOGIN_COMPLETED,
      popoverStep: null,
      completedSteps: {
        ...webOnboardingMode.completedSteps,
        loginCredentialOnWeb: true,
      },
    });
  }
};
const isTryAutofillDemoPage = (url: string) =>
  new RegExp(`${DASHLANE_WEBSITE_REGEXP}${TRY_AUTOFILL_DEMO_PAGE}`).test(url);
export const handleOnboardingAutofillFlow = async (
  context: AutofillEngineContext,
  tabUrl: string
) => {
  if (!isTryAutofillDemoPage(tabUrl)) {
    return;
  }
  const webOnboardingMode =
    await context.connectors.carbon.getWebOnboardingMode();
  if (
    webOnboardingMode.flowTryAutofillOnWeb &&
    !webOnboardingMode.completedSteps?.tryAutofillOnWeb
  ) {
    await context.connectors.legacyCarbon.updateWebOnboardingMode({
      flowTryAutofillOnWeb: false,
      completedSteps: {
        ...webOnboardingMode.completedSteps,
        tryAutofillOnWeb: true,
      },
    });
  }
};
