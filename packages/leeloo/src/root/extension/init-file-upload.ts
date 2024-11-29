import { isMv3Environment } from "@dashlane/framework-infra";
import { FileUploader } from "../../libs/file-upload/file-uploader";
import { FileUploadMessageSenderServiceWorker } from "../../libs/file-upload/file-upload-message-sender-service-worker";
import { FileUploadMessageSenderBackgroundPage } from "../../libs/file-upload/file-upload-message-sender-background-page";
export function initFileUpload() {
  const instance = isMv3Environment()
    ? new FileUploadMessageSenderServiceWorker()
    : new FileUploadMessageSenderBackgroundPage();
  FileUploader.setSenderInstance(instance);
}
