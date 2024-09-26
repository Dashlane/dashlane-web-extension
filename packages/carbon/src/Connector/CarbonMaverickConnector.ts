import * as communication from "@dashlane/communication";
let EVENT_BUS: typeof communication.CarbonMaverickConnector = null;
export const setEventBus = (
  eventBus: typeof communication.CarbonMaverickConnector
) => {
  EVENT_BUS = eventBus;
};
export default function maverick(): typeof communication.CarbonMaverickConnector {
  return EVENT_BUS;
}
