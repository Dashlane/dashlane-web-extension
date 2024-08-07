import {
  startAutofillEngine,
  startDispatcher,
  WebExtensionApiManager,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/server";
import { logDebug } from "../../logs/console/logger";
import { SyncTaskDependencies } from "../tasks.types";
import { initStateStorage } from "./init-autofill-engine-state-storage";
export function initAutofillEngine({
  connectors: {
    autofillEngineCarbonConnector,
    autofillEngineLegacyCarbonConnector,
  },
  appClient,
}: SyncTaskDependencies): void {
  const stateStorage = initStateStorage();
  const browserApi = new WebExtensionApiManager().getBrowserApi();
  const messageLogger = (message: string, details: Record<string, unknown>) => {
    logDebug({
      message,
      details,
      indentDetails: true,
      tags: ["AutofillEngine"],
    });
  };
  void startAutofillEngine(
    browserApi,
    {
      carbon: autofillEngineCarbonConnector,
      legacyCarbon: autofillEngineLegacyCarbonConnector,
      grapheneClientPromise: appClient,
    },
    stateStorage,
    messageLogger
  );
  startDispatcher(browserApi);
}
