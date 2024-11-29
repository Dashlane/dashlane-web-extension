import {
  AutofillEngineDispatcher,
  DispatcherMessages,
} from "@dashlane/autofill-engine/dispatcher";
export const useWebcardVisibilityChecker =
  (options: {
    autofillEngineDispatcher?: AutofillEngineDispatcher;
    closeWebcard: () => void;
    webcardId: string;
  }) =>
  async (): Promise<boolean | undefined> => {
    const result = Boolean(
      await options.autofillEngineDispatcher?.sendMessage(
        {
          targetFrameId: 0,
          message: DispatcherMessages.VisibilityCheckRequest,
        },
        options.webcardId
      )
    );
    if (result === false) {
      options.closeWebcard();
    }
    return result;
  };
