import { carbonConnector } from 'libs/carbon/connector';
export const validateSecureFile = async (file: File) => {
    return await carbonConnector.validateSecureFile({
        fileName: file.name,
        fileType: file.type,
        contentLength: file.size,
    });
};
