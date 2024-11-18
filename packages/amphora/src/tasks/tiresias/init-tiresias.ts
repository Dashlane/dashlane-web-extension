import { TiresiasBackground } from "@dashlane/tiresias/background";
import { CarbonApiEvents } from "@dashlane/communication";
import { AppModules, ClientsOf } from "@dashlane/framework-contracts";
import { AppDefinition } from "@dashlane/application-extension-definition";
import { tiresiasLogger } from "./tiresias-logger";
export function messageLogger(
  message: string,
  details: Record<string, unknown>
): void {
  tiresiasLogger.debug(message, details);
}
let _tiresiasBackgroundRef: TiresiasBackground | null = null;
export function initTiresias({
  connectors: { tiresiasBackgroundToCarbonConnector },
  appClient,
}: {
  connectors: {
    tiresiasBackgroundToCarbonConnector: CarbonApiEvents;
  };
  appClient: ClientsOf<AppModules<AppDefinition>>;
}): void {
  tiresiasLogger.info("Creation of Tiresias background process");
  _tiresiasBackgroundRef = new TiresiasBackground({
    messageLogger,
    carbonConnectorApi: tiresiasBackgroundToCarbonConnector,
    grapheneClient: appClient,
  });
}
