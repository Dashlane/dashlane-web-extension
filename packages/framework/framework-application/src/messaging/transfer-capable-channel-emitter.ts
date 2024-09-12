export interface TransferCapableChannelEmitter {
  send: (
    fileName: string,
    mimeType: string,
    fileContent: ArrayBuffer
  ) => Promise<void>;
}
