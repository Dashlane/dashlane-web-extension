import { FileUploadedEventData } from "@dashlane/framework-contracts";
import { FILE_UPLOAD } from "@dashlane/framework-types";
import { FileUploadMessageSender } from "./file-upload-message-sender";
export class FileUploader {
  public constructor(private readonly uploadKey: string) {}
  static sender: FileUploadMessageSender | undefined;
  static setSenderInstance(instance: FileUploadMessageSender) {
    FileUploader.sender = instance;
  }
  public uploadFile(fileUploadEventData: FileUploadedEventData): void {
    if (!FileUploader.sender) {
      throw new Error("No sender instance available");
    }
    FileUploader.sender.sendMessage({
      type: FILE_UPLOAD,
      uploadKey: this.uploadKey,
      fileUploadData: fileUploadEventData,
    });
  }
}
