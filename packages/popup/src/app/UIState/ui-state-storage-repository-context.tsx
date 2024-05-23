import React, { createContext, ReactNode, useContext, useEffect, useState, } from 'react';
import { useUserLogin } from 'src/libs/api/session/useUserLogin';
import StorageRepository, { valueType } from './storage-repository';
interface Context {
    saveData: (key: string, value: valueType) => void;
    getData: (key: string, callback: (value: valueType) => void) => void;
    removeData: (key: string) => void;
}
interface Provider {
    children: ReactNode;
}
const UIStateStorageRepositoryContext = createContext<Context>({} as Context);
const UIStateStorageRepositoryProvider = ({ children }: Provider) => {
    const [storageRepository, setStorageRepository] = useState<StorageRepository | null>(null);
    const username = useUserLogin();
    useEffect(() => {
        if (!username || Boolean(storageRepository)) {
            return;
        }
        StorageRepository.createInstance(username)
            .then((storageRepositoryInstanciated) => setStorageRepository(storageRepositoryInstanciated))
            .catch(() => { });
    }, [username]);
    if (!storageRepository) {
        return null;
    }
    const hasStateExpired = (previousSaveTimestamp: number) => {
        const expiryTimeInMS = 30000;
        return Date.now() - previousSaveTimestamp > expiryTimeInMS;
    };
    const contextValue = {
        saveData: (key: string, value: valueType) => {
            storageRepository.saveData(key, value);
        },
        getData: (key: string, callback: (value: valueType) => void) => {
            void storageRepository.getData(key, function (storageData) {
                if (storageData === null || hasStateExpired(storageData.timestamp)) {
                    callback(null);
                }
                else {
                    callback(storageData.data);
                }
            });
        },
        removeData: (key: string) => {
            storageRepository.removeData(key);
        },
    };
    return (<UIStateStorageRepositoryContext.Provider value={contextValue}>
      {children}
    </UIStateStorageRepositoryContext.Provider>);
};
const useUIStateStorageRepositoryContext = () => useContext(UIStateStorageRepositoryContext);
export { UIStateStorageRepositoryProvider, useUIStateStorageRepositoryContext };
