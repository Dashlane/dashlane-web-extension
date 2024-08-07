import { AutofillEngineCommands } from "../../../Api/types/commands";
import { AutofillEngineMessageType, getMethodNamesFromClass } from "./common";
export interface BaseAutofillEngineCommand {
  cmd: keyof AutofillEngineCommands;
  timestamp: number;
}
export interface SerializedAutofillEngineCommand
  extends BaseAutofillEngineCommand {
  messageType: AutofillEngineMessageType.Command;
  parameters: any[];
}
const AutofillEngineCommandsNames = getMethodNamesFromClass(
  new AutofillEngineCommands()
);
export const isSerializedAutofillEngineCommand = (
  obj: unknown
): obj is SerializedAutofillEngineCommand => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "messageType" in obj &&
    "cmd" in obj &&
    "parameters" in obj &&
    obj.messageType === AutofillEngineMessageType.Command &&
    typeof obj.cmd === "string" &&
    Array.prototype.includes.call(AutofillEngineCommandsNames, obj.cmd)
  );
};
export const makeAutofillEngineCommandSerializer = (
  sendCommand: (command: SerializedAutofillEngineCommand) => void
): AutofillEngineCommands => {
  const instance: Partial<AutofillEngineCommands> = {};
  for (const cmd of AutofillEngineCommandsNames) {
    instance[cmd] = (...args: any): void =>
      sendCommand({
        messageType: AutofillEngineMessageType.Command,
        cmd,
        timestamp: Date.now(),
        parameters: args,
      });
  }
  return instance as AutofillEngineCommands;
};
