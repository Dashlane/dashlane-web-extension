import { EmbeddedAttachment, SecureFileInfo } from '@dashlane/communication';
export const createEmbeddedAttachmentFromSecureFile = (secureFileInfo: SecureFileInfo): EmbeddedAttachment => {
    return {
        id: secureFileInfo.Id,
        type: secureFileInfo.Type,
        version: 1,
        filename: secureFileInfo.Filename,
        downloadKey: secureFileInfo.DownloadKey,
        cryptoKey: secureFileInfo.CryptoKey,
        localSize: secureFileInfo.LocalSize,
        remoteSize: secureFileInfo.RemoteSize,
        creationDatetime: secureFileInfo.CreationDatetime,
        userModificationDatetime: secureFileInfo.UserModificationDatetime,
        owner: secureFileInfo.Owner,
    };
};
