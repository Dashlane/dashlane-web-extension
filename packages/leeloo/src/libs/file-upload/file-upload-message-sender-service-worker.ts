import { FileUploadedEventPayload } from "@dashlane/framework-contracts";
import { FileUploadMessageSender } from "./file-upload-message-sender";
export class FileUploadMessageSenderServiceWorker
  implements FileUploadMessageSender
{
  public sendMessage = (fileUploadPayload: FileUploadedEventPayload): void => {
    if (!navigator.serviceWorker?.controller) {
      throw new Error(
        "File Upload Message Sender - Wrong environment. No service worker available."
      );
    }
    navigator.serviceWorker.controller.postMessage(fileUploadPayload, [
      fileUploadPayload.fileUploadData.content,
    ]);
  };
}
