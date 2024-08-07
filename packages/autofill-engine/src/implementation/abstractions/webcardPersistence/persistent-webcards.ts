import { AutofillEngineContext } from "../../../Api/server/context";
import { WebcardData, WebcardType } from "../../../types";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../messaging/action-serializer";
export const hasPersistentWebcardDisplayed = async (
  context: AutofillEngineContext
): Promise<boolean> =>
  Object.keys((await context.state.tab.get()).persistentWebcards ?? {}).length >
  0;
export const canDisplayNewPersistentWebcard = async (
  context: AutofillEngineContext,
  newWebcardType: WebcardType
): Promise<boolean> => {
  const persistentWebcards =
    (await context.state.tab.get()).persistentWebcards ?? {};
  return !Object.keys(persistentWebcards).some(
    (webcardId) => persistentWebcards[webcardId].webcardType === newWebcardType
  );
};
export const showPersistentWebcard = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  webcard: WebcardData
): Promise<boolean> => {
  const state = await context.state.tab.get();
  if (!(await canDisplayNewPersistentWebcard(context, webcard.webcardType))) {
    return false;
  }
  await context.state.tab.set({
    ...state,
    persistentWebcards: {
      ...state.persistentWebcards,
      [webcard.webcardId]: webcard,
    },
  });
  actions.showWebcard(AutofillEngineActionTarget.MainFrame, webcard);
  return true;
};
export const restorePersistentWebcard = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions
) => {
  const tabState = await context.state.tab.get();
  if (tabState.persistentWebcards) {
    const { persistentWebcards, ...rest } = tabState;
    const loginStatus = await context.connectors.carbon.getUserLoginStatus();
    if (loginStatus.loggedIn) {
      for (const webcardId in persistentWebcards) {
        persistentWebcards[webcardId].isRestoredWebcard = true;
        actions.showWebcard(
          AutofillEngineActionTarget.MainFrame,
          persistentWebcards[webcardId]
        );
      }
    } else {
      await context.state.tab.set({
        ...rest,
      });
    }
  }
};
export const forgetPersistentWebcard = async (
  context: AutofillEngineContext,
  webcardId: string
) => {
  const tabState = await context.state.tab.get();
  if (tabState.persistentWebcards) {
    const { persistentWebcards, ...rest } = tabState;
    const { [webcardId]: match, ...otherWebcards } = persistentWebcards;
    if (match) {
      await context.state.tab.set({
        ...rest,
        persistentWebcards: { ...otherWebcards },
      });
    }
  }
};
export const getPersistentWebcard = async (
  context: AutofillEngineContext,
  webcardId: string
): Promise<WebcardData | undefined> => {
  const tabState = await context.state.tab.get();
  const { [webcardId]: match } = tabState.persistentWebcards ?? {};
  return match;
};
export const updatePersistentWebcard = async (
  context: AutofillEngineContext,
  webcard: WebcardData
) => {
  const state = await context.state.tab.get();
  if (
    state.persistentWebcards &&
    webcard.webcardId in state.persistentWebcards
  ) {
    await context.state.tab.set({
      ...state,
      persistentWebcards: {
        ...state.persistentWebcards,
        [webcard.webcardId]: webcard,
      },
    });
  }
};
