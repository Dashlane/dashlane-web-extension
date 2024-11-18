import { FileMetaDataState } from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type RemoteFileLiveQueries = {
  liveFileMeta: LiveQuery<void, FileMetaDataState>;
};
