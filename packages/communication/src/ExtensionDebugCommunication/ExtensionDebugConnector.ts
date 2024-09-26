import { slot, Slot } from "ts-event-bus";
import * as e from "./ExtensionDebugEvents";
export const ExtensionDebugConnector = {
  getExtensionId: slot<null, string>(),
  switchExtensionToStandalone: slot<void>(),
  showInput: slot<e.ShowInputData>(),
  showFormOnPage: slot<e.ShowFormsData>(),
  signalTti: slot<number>(),
  signalDatabasesSent: slot<void>(),
};
