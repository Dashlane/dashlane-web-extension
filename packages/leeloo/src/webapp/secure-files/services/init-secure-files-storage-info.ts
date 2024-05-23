import { carbonConnector } from 'libs/carbon/connector';
export const initSecureFilesStorageInfo = async () => {
    return await carbonConnector.initSecureFilesStorageInfo();
};
