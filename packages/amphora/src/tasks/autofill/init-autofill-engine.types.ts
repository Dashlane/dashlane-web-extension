import { AutofillEngineState as ServerAutofillEngineState } from "@dashlane/autofill-engine/server";
import {
  CarbonApiEvents,
  CarbonMaverickConnector,
} from "@dashlane/communication";
export interface InitAutofillEngineParams {
  carbonApiConnector: CarbonApiEvents;
  legacyCarbonConnector: typeof CarbonMaverickConnector;
}
export type AutofillEngineState = Record<string, ServerAutofillEngineState>;
