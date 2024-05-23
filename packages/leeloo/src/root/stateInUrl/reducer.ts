import mergeOptions from 'merge-options';
import { GlobalState } from 'store/types';
import createReducer from 'store/reducers/create';
import { Value } from './types';
const reducer = createReducer<GlobalState>('STATE_IN_URL', {} as GlobalState);
const retrieve = (obj: {}, keyList: string[]): {} => {
    if (keyList.length > 0) {
        const key = keyList[0];
        if (!(key in obj)) {
            obj[key] = {};
        }
        return retrieve(obj[key], keyList.slice(1));
    }
    return obj;
};
export const restoreDataAction = reducer.registerAction('RESTORE_DATA', (state: GlobalState, content: {
    [k: string]: Value;
}) => {
    const result = {};
    Object.keys(content).forEach((key: string) => {
        const keyList = key.split('.');
        const leaf = retrieve(result, keyList.slice(0, keyList.length - 1));
        leaf[keyList[keyList.length - 1]] = content[key];
    });
    return mergeOptions({}, state, result);
});
const { apply } = reducer;
export default apply;
