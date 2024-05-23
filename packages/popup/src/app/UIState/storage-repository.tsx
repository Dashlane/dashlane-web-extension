import { storageLocalGet, storageLocalRemove, storageLocalSet, } from '@dashlane/webextensions-apis';
export type valueType = string | number | null | boolean | object;
export class StorageData {
    data;
    timestamp;
    constructor(data: valueType) {
        this.data = data;
        this.timestamp = Date.now();
    }
}
class StorageRepository {
    private hashedUsername = '';
    private getPrefixedKey = (key: string) => `popup_state_persist_${key}_${this.hashedUsername}`;
    static async createInstance(username: string) {
        const storageRepository = new this();
        await storageRepository.initializePrefix(username);
        return storageRepository;
    }
    private async initializePrefix(username: string) {
        this.hashedUsername = await this.hashValue(username);
    }
    private hashValue = async (value: string) => {
        const msgUint8Array = new TextEncoder().encode(value);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8Array);
        const hashHex = Array.from(new Uint8Array(hashBuffer))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
        return hashHex;
    };
    public saveData = (key: string, value: valueType) => {
        if (value === null) {
            this.removeData(key);
        }
        else {
            void storageLocalSet({
                [this.getPrefixedKey(key)]: new StorageData(value),
            });
        }
    };
    public getData = (key: string, callback: (data: StorageData | null) => void) => {
        key = this.getPrefixedKey(key);
        void storageLocalGet(key).then((storageObject) => {
            if (storageObject[key]) {
                callback(storageObject[key] as StorageData);
            }
            else {
                callback(null);
            }
        });
    };
    public removeData = (key: string) => {
        void storageLocalRemove(this.getPrefixedKey(key));
    };
}
export default StorageRepository;
