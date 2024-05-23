import { browser } from '@dashlane/browser-utils';
const downloadBlobFromDataUri = async (blob: Blob, fileName: string) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const a = document.createElement('a');
        a.setAttribute('href', reader.result as string);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
    };
    reader.readAsDataURL(blob);
};
const downloadBlobFromObjectUrl = (blob: Blob, fileName: string) => {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
};
export const downloadFile = (content: (string | BufferSource)[] | (string | BufferSource), fileName: string, mimeType: string) => {
    if (content) {
        const blobContent = Array.isArray(content) ? content : [content];
        const blob = new Blob(blobContent, {
            type: mimeType,
        });
        if (browser.isSafari()) {
            downloadBlobFromDataUri(blob, fileName);
        }
        else {
            downloadBlobFromObjectUrl(blob, fileName);
        }
    }
};
export const downloadTextFile = (content: string, fileName: string) => {
    return downloadFile(content, fileName, 'text/plain');
};
