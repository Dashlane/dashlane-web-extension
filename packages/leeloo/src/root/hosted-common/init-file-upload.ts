import { FileUploader } from "../../libs/file-upload/file-uploader";
import { FileUploadMessageSenderDedicatedWorker } from "../../libs/file-upload/file-upload-message-sender-dedicated-worker";
export function initFileUpload(backgroundWorker: Worker) {
  FileUploader.setSenderInstance(
    new FileUploadMessageSenderDedicatedWorker(backgroundWorker)
  );
}
