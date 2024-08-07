export type PageToWorkerMessageListener = (
  message: unknown,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
) => boolean;
export type WorkerToPageMessageListener = (
  message: unknown,
  sendResponse: (response?: unknown) => void
) => boolean;
export interface PageToWorkerTransport {
  setListener: (listener: WorkerToPageMessageListener) => void;
  sendMessage: (
    message: unknown,
    responseCallback: (response: unknown) => void
  ) => void;
}
export interface WorkerToPageTransport {
  setListener: (listener: PageToWorkerMessageListener) => void;
  sendMessage: (
    message: unknown,
    tabId: number,
    frameId: number | undefined,
    responseCallback: (response: unknown) => void
  ) => void;
}
