import { carbonConnector } from 'src/carbonConnector';
export const checkDoesLocalRecoveryKeyExist = async () => {
    return await carbonConnector.checkDoesLocalRecoveryKeyExist();
};
