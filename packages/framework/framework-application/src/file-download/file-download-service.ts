import { AppLogger } from "../application/logger";
import { Injectable } from "../dependency-injection";
import { FileDownloadEmitterChannel } from "./file-download-emitter";
@Injectable()
export class FileDownloadService {
  private readonly logger: AppLogger;
  private readonly emitterChannel: FileDownloadEmitterChannel;
  public constructor(
    logger: AppLogger,
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
    this.logger.log(`downloading file ${fileName}`);
    this.emitterChannel.send(fileName, mimeType, fileContent);
  }
}
