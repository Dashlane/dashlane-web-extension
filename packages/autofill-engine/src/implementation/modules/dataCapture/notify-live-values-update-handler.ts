import { AutofillEngineContext } from "../../../Api/server/context";
import {
  AutofillableFormsValues,
  SavePasswordWebcardData,
  WebcardType,
} from "../../../types";
import {
  getPersistentWebcard,
  updatePersistentWebcard,
} from "../../abstractions/webcardPersistence/persistent-webcards";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import {
  findCapturedCredentialData,
  forgetDataCaptureStepData,
} from "./credential-capture-helpers";
export const notifyLiveValuesUpdateHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  formValues: AutofillableFormsValues,
  webcardId: string
): Promise<void> => {
  if (Object.keys(formValues).length < 1) {
    return;
  }
  const formId = Object.keys(formValues)[0];
  const elementValues = formValues[formId].elementValues;
  const persistentWebcard = await getPersistentWebcard(context, webcardId);
  if (
    persistentWebcard &&
    persistentWebcard.webcardType === WebcardType.SavePassword &&
    sender.tab?.url
  ) {
    const capturedCredentialData = await findCapturedCredentialData(
      elementValues,
      sender.tab.url,
      context
    );
    if (capturedCredentialData) {
      const updatedPassword = capturedCredentialData.capturedPassword;
      const updatedEmailOrLogin =
        capturedCredentialData.capturedEmailOrLogin ??
        persistentWebcard.emailOrLogin;
      const updatedLogin =
        capturedCredentialData.capturedLogin ??
        persistentWebcard.capturedUsernames.login;
      const updatedSecondaryLogin =
        capturedCredentialData.capturedSecondaryLogin ??
        persistentWebcard.capturedUsernames.secondaryLogin;
      const updatedEmail =
        capturedCredentialData.capturedEmail ??
        persistentWebcard.capturedUsernames.email;
      const updatedCapturedUsernames = {
        email: updatedEmail,
        login: updatedLogin,
        secondaryLogin: updatedSecondaryLogin,
      };
      if (
        persistentWebcard.passwordToSave !== updatedPassword ||
        persistentWebcard.emailOrLogin !== updatedEmailOrLogin ||
        persistentWebcard.capturedUsernames.login !== updatedLogin ||
        persistentWebcard.capturedUsernames.email !== updatedEmail ||
        persistentWebcard.capturedUsernames.secondaryLogin !==
          updatedSecondaryLogin
      ) {
        const updatedWebcard: SavePasswordWebcardData = {
          ...persistentWebcard,
          passwordToSave: updatedPassword,
          emailOrLogin: updatedEmailOrLogin,
          capturedUsernames: {
            email: updatedEmail,
            login: updatedLogin,
            secondaryLogin: updatedSecondaryLogin,
          },
        };
        await updatePersistentWebcard(context, updatedWebcard);
        actions.updateSavePasswordCapturedData(
          AutofillEngineActionTarget.AllFrames,
          webcardId,
          updatedPassword,
          updatedEmailOrLogin,
          updatedCapturedUsernames
        );
      }
      void forgetDataCaptureStepData(context);
    }
  }
};
