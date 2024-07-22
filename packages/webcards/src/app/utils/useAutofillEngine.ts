import {
  AutofillEngineActions,
  AutofillEngineCommands,
  WebExtensionApiManager,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/client";
import { AutofillEngineClientType } from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import * as React from "react";
import { UtilsInterface } from ".";
export const useAutofillEngine = (
  utils: UtilsInterface
): [
  AutofillEngineCommands | undefined,
  (handlers: Partial<AutofillEngineActions>) => void
] => {
  const [commands, setCommands] = React.useState<AutofillEngineCommands>();
  const [actionHandlers] = React.useState<Partial<AutofillEngineActions>>({});
  React.useEffect(() => {
    const messageLogger = (
      message: string,
      details: Record<string, unknown>
    ): void => {
      utils.log(
        `[AutofillEngine] ${message}\n${JSON.stringify(details, null, 2)}`
      );
    };
    setCommands(
      utils.connectToAutofillEngine(
        new WebExtensionApiManager().getBrowserApi(),
        actionHandlers,
        AutofillEngineClientType.Webcards,
        messageLogger
      )
    );
  }, [actionHandlers, utils]);
  const setActionsHandlers = (newHandlers: Partial<AutofillEngineActions>) => {
    Object.keys(newHandlers).forEach((key) => {
      actionHandlers[key] && delete actionHandlers[key];
      actionHandlers[key] = newHandlers[key];
    });
  };
  return [commands, setActionsHandlers];
};
