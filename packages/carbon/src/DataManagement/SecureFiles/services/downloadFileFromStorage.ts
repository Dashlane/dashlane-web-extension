import { DownloadSecureFileRequest } from "@dashlane/communication";
import { CoreServices } from "Services";
import {
  secureFileDownloadChunkAction,
  secureFileStartDownloadAction,
} from "Session/Store/secureFileStorage";
export type DownloadFileFromS3Result =
  | {
      success: false;
    }
  | {
      success: true;
      chunks: Uint8Array;
    };
const EVENT_THRESHOLD_LENGTH = 100000;
export const downloadFileFromStorage = async (
  services: CoreServices,
  url: string,
  params: DownloadSecureFileRequest
): Promise<DownloadFileFromS3Result> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return {
        success: false,
      };
    }
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    const contentLength = response.headers.get("Content-Length");
    services.storeService.dispatch(
      secureFileStartDownloadAction(
        params.downloadKey,
        Number.parseInt(contentLength, 10)
      )
    );
    let receivedLength = 0;
    let keepReading = true;
    let threshold = 0;
    while (keepReading) {
      const { done, value } = await reader.read();
      keepReading = !done;
      if (keepReading) {
        chunks.push(new Uint8Array(value));
        receivedLength += value.length;
        threshold += value.length;
        if (threshold > EVENT_THRESHOLD_LENGTH) {
          services.storeService.dispatch(
            secureFileDownloadChunkAction(params.downloadKey, threshold)
          );
          threshold = 0;
        }
      }
    }
    let position = 0;
    const chunksAll = new Uint8Array(receivedLength);
    chunks.forEach((chunk) => {
      chunksAll.set(chunk, position);
      position += chunk.length;
    });
    return { success: true, chunks: chunksAll };
  } catch (error) {
    return {
      success: false,
    };
  }
};
