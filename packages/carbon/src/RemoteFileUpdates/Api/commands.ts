import { UpdateAvailableFileMetaData } from "@dashlane/communication";
import { Command } from "Shared/Api";
export type DecipherRequest = {
  cipheredFileContent: ArrayBuffer;
  fileMetaData: UpdateAvailableFileMetaData;
};
export type DecipherResult = {
  decipheredFile: ArrayBuffer;
};
export type RemoteFileCommands = {
  decipherRemoteFile: Command<DecipherRequest, DecipherResult>;
};
