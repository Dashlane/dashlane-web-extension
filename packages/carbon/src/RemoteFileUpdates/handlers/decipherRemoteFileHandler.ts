import {
  DecipherRequest,
  DecipherResult,
} from "RemoteFileUpdates/Api/commands";
import { decipherRemoteFileUpdate } from "RemoteFileUpdates/helpers/remoteFileUpdateCryptoHelpers";
import { CoreServices } from "Services";
import { sharingKeysSelector } from "Session/selectors";
export const decipherRemoteFileHandler = async (
  { storeService }: CoreServices,
  params: DecipherRequest
): Promise<DecipherResult> => {
  const decipheredFile = await decipherRemoteFileUpdate(
    params.cipheredFileContent,
    params.fileMetaData,
    sharingKeysSelector(storeService.getState()).privateKey
  );
  return { decipheredFile };
};
