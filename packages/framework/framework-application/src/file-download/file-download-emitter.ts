import { TransferCapableChannelEmitter } from "../messaging/transfer-capable-channel-emitter";
export abstract class FileDownloadEmitterChannel
  implements TransferCapableChannelEmitter
{
  public abstract send(
    fileName: string,
    mimeType: string,
    fileContent: ArrayBuffer
  ): Promise<void>;
}
