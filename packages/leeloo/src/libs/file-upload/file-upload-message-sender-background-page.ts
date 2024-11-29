import { runtimeGetURL } from "@dashlane/webextensions-apis";
import { FileUploadMessageSender } from "./file-upload-message-sender";
import { FileUploadedEventPayload } from "@dashlane/framework-contracts";
export class FileUploadMessageSenderBackgroundPage
  implements FileUploadMessageSender
{
  public sendMessage = (fileUploadPayload: FileUploadedEventPayload): void => {
    const chromeRuntimeURL = runtimeGetURL("").replace(/\/$/, "");
    new Promise<Window | undefined>((resolve) => {
      setTimeout(() => {
        resolve(undefined);
      }, 5000);
      chrome.runtime.getBackgroundPage((bckPage) => resolve(bckPage));
    })
      .then((backgroundPage: Window | undefined) => {
        if (!backgroundPage) {
          throw new Error(
            "File Upload Message Sender - Wrong environment. Missing background page."
          );
        }
        backgroundPage.postMessage(fileUploadPayload, chromeRuntimeURL, [
          fileUploadPayload.fileUploadData.content,
        ]);
      })
      .catch((err) => console.error("background page not found", err));
  };
}
