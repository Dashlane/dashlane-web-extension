import { FileUploadedEventPayload } from "@dashlane/framework-contracts";
export interface FileUploadMessageSender {
  sendMessage: (fileUploadPayload: FileUploadedEventPayload) => void;
}
