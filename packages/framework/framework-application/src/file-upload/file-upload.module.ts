import { fileUploadApi } from "@dashlane/framework-contracts";
import { Module } from "../dependency-injection/module.decorators";
import { FileUploadListener } from "./file-upload-listener";
import { FileUploadedEventsEmitter } from "./file-upload-events-emitter";
import { FileUploadBootstrap } from "./file-upload-bootstrap";
@Module({
  api: fileUploadApi,
  configurations: {
    fileUploadListener: { token: FileUploadListener },
  },
  onFrameworkInit: FileUploadBootstrap,
  handlers: {
    commands: {},
    events: {},
    queries: {},
  },
  stores: [],
  providers: [FileUploadedEventsEmitter],
  exports: [FileUploadedEventsEmitter],
  domainName: "framework",
})
export class FileUploadModule {}
