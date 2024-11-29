import { FileUploadedEventPayload } from "@dashlane/framework-contracts";
import { FileUploadMessageSender } from "./file-upload-message-sender";
export class FileUploadMessageSenderDedicatedWorker
  implements FileUploadMessageSender
{
  constructor(private worker: Worker | null) {}
  public sendMessage = (fileUploadPayload: FileUploadedEventPayload): void => {
    if (!this.worker) {
      throw new Error(
        "File Upload Message Sender - Wrong environment. Missing dedicated worker."
      );
    }
    this.worker.postMessage(fileUploadPayload, [
      fileUploadPayload.fileUploadData.content,
    ]);
  };
}
