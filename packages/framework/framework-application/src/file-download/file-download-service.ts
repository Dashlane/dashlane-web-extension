import { Injectable } from "../dependency-injection";
import { FileDownloadEmitterChannel } from "./file-download-emitter";
import { FileDownloadLogger } from "./file-download-logger";
@Injectable()
export class FileDownloadService {
  private readonly logger: FileDownloadLogger;
  private readonly emitterChannel: FileDownloadEmitterChannel;
  public constructor(
    logger: FileDownloadLogger,
    emitterChannel: FileDownloadEmitterChannel
  ) {
    this.logger = logger;
    this.emitterChannel = emitterChannel;
  }
  public downloadFile(
    fileName: string,
    mimeType: string,
    fileContent: ArrayBuffer
  ) {
    this.logger.info(`downloading file ${fileName}`);
    return this.emitterChannel.send(fileName, mimeType, fileContent);
  }
}
