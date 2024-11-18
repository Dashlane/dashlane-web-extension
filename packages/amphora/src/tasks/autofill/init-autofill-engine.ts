import {
  startAutofillEngine,
  startDispatcher,
  WebExtensionApiManager,
} from "@dashlane/autofill-engine/server";
import { logDebug } from "../../logs/console/logger";
import { initStateStorage } from "./init-autofill-engine-state-storage";
import { AutofillCarbonConnectors } from "../../communication/connectors.types";
import { AppDefinition } from "@dashlane/application-extension-definition";
import { AppModules, ClientsOf } from "@dashlane/framework-contracts";
export function initAutofillEngine({
  connectors: {
    autofillEngineCarbonConnector,
    autofillEngineLegacyCarbonConnector,
  },
  appClient,
}: {
  connectors: AutofillCarbonConnectors;
  appClient: Promise<ClientsOf<AppModules<AppDefinition>>>;
}): void {
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
