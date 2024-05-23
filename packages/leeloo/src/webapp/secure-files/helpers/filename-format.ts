const NAME_MAX_LENGTH = 32;
export const formatName = (fileName: string) => {
    return fileName.length <= 32
        ? fileName
        : fileName.substring(0, NAME_MAX_LENGTH);
};
