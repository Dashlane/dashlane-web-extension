import { ImportFormats } from '@dashlane/communication';
export const getFileContents = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function (event) {
            if (event.target && typeof event.target.result === 'string') {
                resolve(event.target.result);
            }
        };
        reader.onerror = reject;
    });
};
export const getImportFileFormat = (file: File): ImportFormats => {
    const name = file.name.toUpperCase();
    if (name.endsWith('.DASH')) {
        return ImportFormats.Dash;
    }
    if (name.endsWith('.CSV')) {
        return ImportFormats.Csv;
    }
    throw new Error('Unsupported');
};
