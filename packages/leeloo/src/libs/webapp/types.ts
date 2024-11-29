import { GeographicStateCollection } from "@dashlane/communication";
export interface State {
  currentSpaceId: string | null;
  geographicStates?: GeographicStateCollection;
}
