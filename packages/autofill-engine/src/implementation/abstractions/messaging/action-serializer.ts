import { AutofillEngineActions } from "../../../Api/types/actions";
import { AutofillEngineMessageType, getMethodNamesFromClass } from "./common";
export enum AutofillEngineActionTarget {
  SenderFrame = "SenderFrame",
  MainFrame = "MainFrame",
  AllFrames = "AllFrames",
}
export type AutofillEngineActionsWithOptions = {
  [K in keyof AutofillEngineActions]: (
    target: AutofillEngineActionTarget,
    ...args: Parameters<AutofillEngineActions[K]>
  ) => void;
};
const AutofillEngineActionsNames = getMethodNamesFromClass(
  new AutofillEngineActions()
);
export type SerializedAutofillEngineAction = {
  messageType: AutofillEngineMessageType.Action;
  action: keyof AutofillEngineActions;
  parameters: any[];
};
export const isSerializedAutofillEngineAction = (
  obj: unknown
): obj is SerializedAutofillEngineAction => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "messageType" in obj &&
    "action" in obj &&
    "parameters" in obj &&
    obj.messageType === AutofillEngineMessageType.Action &&
    typeof obj.action === "string" &&
    Array.prototype.includes.call(AutofillEngineActionsNames, obj.action)
  );
};
export const makeAutofillEngineActionSerializer = (
  sendAction: (
    action: SerializedAutofillEngineAction,
    target: AutofillEngineActionTarget
  ) => void
): AutofillEngineActionsWithOptions => {
  const instance: Partial<AutofillEngineActionsWithOptions> = {};
  for (const action of AutofillEngineActionsNames) {
    instance[action] = (
      target: AutofillEngineActionTarget,
      ...args: any
    ): void =>
      sendAction(
        {
          messageType: AutofillEngineMessageType.Action,
          action,
          parameters: args,
        },
        target
      );
  }
  return instance as AutofillEngineActionsWithOptions;
};
