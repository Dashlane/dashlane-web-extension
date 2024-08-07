import { ParsedURL } from "@dashlane/url-parser";
import {
  CredentialOperationType,
  FeedbackNotificationWebcardData,
} from "../../../Api/types/webcards/feedback-notification-webcard";
import { AutofillEngineContext } from "../../../Api/server/context";
import { WebcardType } from "../../../types";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import { forgetPersistentWebcard } from "../../abstractions/webcardPersistence/persistent-webcards";
import {
  handleOnboardingSavePasswordFlow,
  isOnboardingSavePasswordFlowComplete,
} from "../autofill/onboarding";
import { saveCredential, updateCredential } from "./utils";
export const saveCredentialHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  _sender: chrome.runtime.MessageSender,
  webcardId: string,
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
  }
) => {
  const loginStatus = await context.connectors.carbon.getUserLoginStatus();
  if (!loginStatus.loggedIn) {
    return;
  }
  const state = await context.state.tab.get();
  const { url } = credentialInformation;
  const fullDomain = new ParsedURL(url).getHostname();
  await forgetPersistentWebcard(context, webcardId);
  const { credentialId } = await saveCredential(context, credentialInformation);
  const feedbackNotificationData: FeedbackNotificationWebcardData = {
    webcardType: WebcardType.FeedbackNotification,
    operation: {
      type: CredentialOperationType.SaveCredential,
      credentialId,
      fullDomain,
    },
    webcardId,
    formType: "",
  };
  if (!(await isOnboardingSavePasswordFlowComplete(context))) {
    actions.closeWebcard(AutofillEngineActionTarget.SenderFrame, webcardId);
    await handleOnboardingSavePasswordFlow(context, actions, true);
  } else {
    await context.state.tab.set({
      ...state,
      persistentWebcards: {
        ...state.persistentWebcards,
        [feedbackNotificationData.webcardId]: feedbackNotificationData,
      },
    });
    actions.updateWebcard(
      AutofillEngineActionTarget.SenderFrame,
      feedbackNotificationData
    );
  }
};
export const updateCredentialHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  webcardId: string,
  credentialInformation: {
    id: string;
    newPassword: string;
    onlyForThisSubdomain: boolean;
    spaceId?: string;
  }
) => {
  const state = await context.state.tab.get();
  const loginStatus = await context.connectors.carbon.getUserLoginStatus();
  if (!loginStatus.loggedIn) {
    return;
  }
  const fullDomain = new ParsedURL(sender.tab?.url ?? "").getHostname();
  const { id, newPassword, onlyForThisSubdomain, spaceId } =
    credentialInformation;
  await forgetPersistentWebcard(context, webcardId);
  await updateCredential(context, {
    id,
    passwordToSave: newPassword,
    onlyForThisSubdomain,
    spaceId,
  });
  const feedbackNotificationData: FeedbackNotificationWebcardData = {
    webcardType: WebcardType.FeedbackNotification,
    operation: {
      type: CredentialOperationType.UpdateCredential,
      fullDomain,
      credentialId: id,
    },
    webcardId,
    formType: "",
  };
  await context.state.tab.set({
    ...state,
    persistentWebcards: {
      ...state.persistentWebcards,
      [feedbackNotificationData.webcardId]: feedbackNotificationData,
    },
  });
  actions.updateWebcard(
    AutofillEngineActionTarget.SenderFrame,
    feedbackNotificationData
  );
};
