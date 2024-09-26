import * as communication from "@dashlane/communication";
let EVENT_BUS: typeof communication.ExtensionCarbonConnector = null;
export const setEventBus = (
  eventBus: typeof communication.ExtensionCarbonConnector
) => {
  EVENT_BUS = eventBus;
};
export default function extension(): typeof communication.ExtensionCarbonConnector {
  return EVENT_BUS;
}
