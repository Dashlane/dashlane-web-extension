import * as communication from "@dashlane/communication";
import leeloo from "Connector/CarbonLeelooConnector";
export function triggerABTestingChanged(event: communication.ABTestingEvent) {
  leeloo().abTestingChanged({ version: event.version });
}
