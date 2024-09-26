import { slot } from "ts-event-bus";
import { liveSlot } from "../CarbonApi";
import { DecipherRequest, DecipherResult, FileMetaDataState } from "./types";
export const remoteFileCommandsSlots = {
  decipherRemoteFile: slot<DecipherRequest, DecipherResult>(),
};
export const remoteFilesQueriesSlots = {
  getFileContent: slot<string, string>(),
};
export const remoteFilesLiveQueriesSlots = {
  liveFileMeta: liveSlot<FileMetaDataState>(),
};
