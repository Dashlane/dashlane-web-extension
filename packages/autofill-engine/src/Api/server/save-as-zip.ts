import { FileStorage } from "@dashlane/page-capture";
import { downloadZip } from "client-zip";
import {
  AutofillEngineExceptionLogger,
  AutofillEngineMessageLogger,
} from "../types/logger";
import { download } from "@dashlane/webextensions-apis";
export const saveAsZip = async (
  url: string,
  storage: FileStorage[],
  messageLogger: AutofillEngineMessageLogger,
  exceptionLogger: AutofillEngineExceptionLogger
): Promise<void> => {
  const files = await Promise.all(
    storage
      .map(async (aEntry) => {
        let data;
        if (aEntry.binary) {
          const base64data = aEntry.blob;
          try {
            const response = await fetch(base64data);
            data = await response.blob();
          } catch {
            return null;
          }
        } else {
          data = new Blob([aEntry.blob], { type: "text/plain" });
        }
        return {
          name: aEntry.filename,
          input: data,
        };
      })
      .filter(Boolean) as Array<
      Promise<{
        name: string;
        input: Blob;
      }>
    >
  );
  try {
    const zipBlob = await downloadZip(files).blob();
    const preferredFilename = new URL(url).hostname + "-capture.zip";
    const blobToDataURL = (blob: Blob) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Reader result not a string"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };
    const zipDataUrl = await blobToDataURL(zipBlob);
    const downloadId = await download({
      url: zipDataUrl,
      filename: preferredFilename,
      saveAs: true,
    });
    messageLogger("Vortex zip download started", {
      downloadId,
      timestamp: Date.now(),
    });
  } catch (err) {
    exceptionLogger(err, {
      message: "Exception in saveAsZip function",
      fileName: "start.ts",
      funcName: "saveAsZip",
    });
  }
};
