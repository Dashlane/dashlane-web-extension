import { browser } from "@dashlane/browser-utils";
const downloadBlobFromDataUri = async (blob: Blob) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    const iframe = document.createElement("iframe");
    iframe.src = reader.result as string;
    iframe.style.display = "none";
    document.body.appendChild(iframe);
  };
  reader.readAsDataURL(blob);
};
const downloadBlobFromObjectUrl = (blob: Blob, fileName: string) => {
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};
export const downloadFile = (
  content: (string | BufferSource)[] | (string | BufferSource),
  fileName: string,
  mimeType: string
) => {
  if (content) {
    const blobContent = Array.isArray(content) ? content : [content];
    if (browser.isSafari()) {
      const blob = new Blob(blobContent, {
        type: "application/octet-stream",
      });
      downloadBlobFromDataUri(blob);
    } else {
      const blob = new Blob(blobContent, {
        type: mimeType,
      });
      downloadBlobFromObjectUrl(blob, fileName);
    }
  }
};
export const downloadTextFile = (content: string, fileName: string) => {
  return downloadFile(content, fileName, "text/plain");
};
