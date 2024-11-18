import { RemoteFileCommands } from "./commands";
import { decipherRemoteFileHandler } from "RemoteFileUpdates/handlers/decipherRemoteFileHandler";
import { fileMetaUpdate$ } from "RemoteFileUpdates/live";
import { fileContentStrSelector } from "RemoteFileUpdates/selectors";
import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { RemoteFileLiveQueries } from "./live-queries";
import { RemoteFileQueries } from "./queries";
export const config: CommandQueryBusConfig<
  RemoteFileCommands,
  RemoteFileQueries,
  RemoteFileLiveQueries
> = {
  commands: {
    decipherRemoteFile: { handler: decipherRemoteFileHandler },
  },
  queries: {
    getFileContent: { selector: fileContentStrSelector },
  },
  liveQueries: {
    liveFileMeta: { operator: fileMetaUpdate$ },
  },
};
