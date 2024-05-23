import { CallingCodeCollection, GeographicStateCollection, } from '@dashlane/communication';
export interface State {
    currentSpaceId: string | null;
    callingCodes?: CallingCodeCollection;
    geographicStates?: GeographicStateCollection;
}
