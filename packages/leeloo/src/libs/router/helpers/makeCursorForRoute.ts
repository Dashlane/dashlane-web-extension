import { isEmpty, symmetricDifference } from 'ramda';
import { LocalReducer } from 'redux-cursor';
import { Cursor } from 'store/types';
const reducersStore: ReducerData[] = [];
type PathType = string | string[];
interface ReducerData {
    reducer: LocalReducer<any>;
    reducerKey: string;
    path: PathType;
}
const arePathsEqual = (a: PathType, b: PathType): boolean => isEmpty(symmetricDifference(Array.isArray(a) ? a : [a], Array.isArray(b) ? b : [b]));
export const isStringChildOf = (child: string, parentPath: PathType): boolean => {
    const parentPathAsArray = Array.isArray(parentPath)
        ? parentPath
        : [parentPath];
    return parentPathAsArray.some((parentPathAsString) => child.startsWith(parentPathAsString));
};
const isPathChildOf = (childPath: PathType, parentPath: PathType): boolean => {
    if (Array.isArray(childPath)) {
        return arePathsEqual(childPath, parentPath);
    }
    else {
        return isStringChildOf(childPath, parentPath);
    }
};
const isAlreadyRegistered = (list: ReducerData[], path: PathType, reducer: LocalReducer<any>): boolean => {
    return list.some((element) => element.reducer === reducer && arePathsEqual(element.path, path));
};
export const registerPathAndReducer = (path: PathType | null, reducer: LocalReducer<any>): void => {
    if (!path) {
        throw new Error('Missing path when registering path and reducer');
    }
    if (!isAlreadyRegistered(reducersStore, path, reducer)) {
        reducersStore.push({
            reducer,
            reducerKey: reducer.key,
            path,
        });
    }
};
export const makeCursor = (rootCursor: Cursor<any>, currentPath: PathType | null): Cursor<any> => {
    if (!currentPath) {
        throw new Error('Missing currentPath when making cursor');
    }
    const debugChain: string[] = [];
    const cursor = reducersStore
        .filter(({ path }) => isPathChildOf(currentPath, path))
        .map(({ reducer }) => {
        debugChain.push(reducer.key);
        return reducer;
    })
        .reduce((acc: Cursor<any>, cur: LocalReducer<any>) => acc.child(cur), rootCursor);
    return cursor as Cursor<any>;
};
