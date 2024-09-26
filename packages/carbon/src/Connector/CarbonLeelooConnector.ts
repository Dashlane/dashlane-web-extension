import * as communication from "@dashlane/communication";
let EVENT_BUS: typeof communication.CarbonLeelooConnector = null;
export const setEventBus = (
  change: typeof communication.CarbonLeelooConnector
) => {
  EVENT_BUS = change;
};
export default function debug(): typeof communication.CarbonLeelooConnector {
  return EVENT_BUS;
}
