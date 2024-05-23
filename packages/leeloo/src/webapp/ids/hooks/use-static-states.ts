import React from 'react';
import { Country, GeographicStateCollection, GeographicStateLevel, GeographicStateMap, QueryStaticDataCollectionsRequest, StaticDataQueryType, } from '@dashlane/communication';
import { queryStaticDataCollections } from 'libs/carbon/triggers';
const request: QueryStaticDataCollectionsRequest = {
    queries: [
        {
            type: StaticDataQueryType.GEOGRAPHIC_STATES,
            level: GeographicStateLevel.LEVEL_0,
        },
    ],
};
export const enabledCountriesWithStates = new Set<keyof typeof Country>([
    'AU',
    'CA',
    'US',
]);
export function useStates(handleError: (error: Error) => void) {
    const [geoStates, setGeoStates] = React.useState<null | GeographicStateCollection>(null);
    React.useEffect(() => {
        async function retrieveStatesStaticDataCollection() {
            const [result] = await queryStaticDataCollections(request);
            if (result?.type === StaticDataQueryType.GEOGRAPHIC_STATES) {
                setGeoStates(result.collection);
            }
        }
        retrieveStatesStaticDataCollection().catch((error: Error) => handleError(new Error(`[useStates] ${error}`)));
    }, []);
    return geoStates;
}
export function getStateOptions(states: Array<GeographicStateMap[string]>) {
    return states
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(({ name: label, code: value }) => ({ label, value }));
}
export function useCountryStates(countryInput: string | null, handleError: (error: Error) => void) {
    const states = useStates(handleError);
    const stateOptions = React.useMemo(() => {
        if (!states) {
            return null;
        }
        if (!countryInput) {
            return undefined;
        }
        const maybeCountry = countryInput === null ? undefined : Country[countryInput];
        if (!maybeCountry) {
            return undefined;
        }
        if (!enabledCountriesWithStates.has(maybeCountry)) {
            return undefined;
        }
        const countryStates = states[maybeCountry];
        return countryStates !== undefined
            ? getStateOptions(Object.values(countryStates))
            : undefined;
    }, [states, countryInput]);
    return stateOptions;
}
