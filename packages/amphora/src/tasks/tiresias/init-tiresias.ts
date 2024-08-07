import { TiresiasBackground } from "@dashlane/tiresias/background";
import { logDebug, logInfo } from "../../logs/console/logger";
import { TaskDependencies } from "../tasks.types";
export function messageLogger(
  message: string,
  details: Record<string, unknown>
): void {
  logDebug({
    message,
    details,
    indentDetails: true,
    tags: ["Tiresias"],
  });
}
export function initTiresias({
  connectors: { tiresiasBackgroundToCarbonConnector },
  appClient,
}: TaskDependencies): void {
  logInfo({
    message: "Creation of Tiresias background process",
    tags: ["amphora", "initBackground", "initTiresias"],
  });
  new TiresiasBackground({
    messageLogger,
    carbonConnectorApi: tiresiasBackgroundToCarbonConnector,
    grapheneClient: appClient,
  });
}
