import { FileDownloadExtensionListenerChannelFactory } from "@dashlane/framework-infra/file-download";
export function initFileDownloadListenerForExtension() {
  const fileDownloadListenerFactory =
    new FileDownloadExtensionListenerChannelFactory();
  const fileDownloadListener =
    fileDownloadListenerFactory.makeFileDownloadListenerChannel();
  fileDownloadListener.listen();
}
