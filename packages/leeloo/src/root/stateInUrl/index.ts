import { Store } from 'redux';
import { parse as parseQuerystring } from '@offirmo/simple-querystring-parser';
import { restoreDataAction } from './reducer';
import { Value } from './types';
export interface CustomFunction {
    (val: Value): Record<string, Value | undefined | null>;
}
const byQuery = function (queryString: string, map: Record<string, string | CustomFunction>) {
    const queryMap = parseQuerystring(queryString);
    const changesRequested = Object.keys(map)
        .filter((key) => key in queryMap)
        .map((key) => ({
        urlValue: queryMap[key],
        userValue: map[key],
    }))
        .map(({ urlValue, userValue }) => typeof userValue === 'string'
        ? { [userValue]: urlValue }
        : userValue(urlValue) || {});
    return changesRequested.reduce((prev, current) => {
        Object.keys(current).forEach((k) => {
            if (k in prev) {
                throw new Error('Some URL options conflict');
            }
        });
        return Object.assign(prev, current);
    }, {});
};
export default function (defaultSearch: string, search: string, store: Store<{}>, map: {
    [k: string]: string | CustomFunction;
}) {
    const storeChanges = Object.assign(byQuery(defaultSearch, map), byQuery(search, map));
    if (Object.keys(storeChanges).length > 0) {
        store.dispatch(restoreDataAction(storeChanges as {
            [k: string]: Value;
        }));
    }
}
