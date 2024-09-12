import { fileDownloadApi } from "@dashlane/framework-contracts";
import { Module } from "../dependency-injection/module.decorators";
import { FileDownloadService } from "./file-download-service";
import { FileDownloadEmitterChannel } from "./file-download-emitter";
@Module({
  api: fileDownloadApi,
  configurations: {
    fileDownloadEmitterChannel: {
      token: FileDownloadEmitterChannel,
    },
  },
  handlers: {
    commands: {},
    events: {},
    queries: {},
  },
  stores: [],
  providers: [FileDownloadService],
  exports: [FileDownloadService],
  domainName: "framework",
})
export class FileDownloadModule {}
