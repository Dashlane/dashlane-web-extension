import { TransferCapableChannelListener } from "../messaging/transfer-capable-channel-listener";
export abstract class FileDownloadListenerChannel
  implements TransferCapableChannelListener
{
  public abstract listen(): void;
}
