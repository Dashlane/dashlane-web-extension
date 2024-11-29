import { DedicatedWorkerGlobalScopeFileDownloadListenerChannel } from "@dashlane/framework-infra/file-download";
export function initFileDownload(backgroundWorker: Worker) {
  const fileDownloadListener =
    new DedicatedWorkerGlobalScopeFileDownloadListenerChannel(backgroundWorker);
  fileDownloadListener.listen();
}
