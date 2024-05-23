import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { valueType } from './storage-repository';
import { useUIStateStorageRepositoryContext } from './ui-state-storage-repository-context';
export type PopupPersistedState<T> = [
    T,
    (value: T) => void,
    boolean
];
function usePopupPersistedState<T extends valueType>(key: string, defaultValue: T): PopupPersistedState<T> {
    const [value, setValue] = useState(defaultValue);
    const [isLoading, setIsLoading] = useState(true);
    const { saveData, getData } = useUIStateStorageRepositoryContext();
    useEffect(() => {
        getData(key, function (data) {
            if (data !== null) {
                setValue(data as T);
            }
            setIsLoading(false);
        });
    }, []);
    const saveValue = useCallback(debounce((value: T) => saveData(key, value), 400), []);
    const setAndSaveValue = (value: T) => {
        setValue(value);
        saveValue(value);
    };
    return [value, setAndSaveValue, isLoading];
}
export default usePopupPersistedState;
