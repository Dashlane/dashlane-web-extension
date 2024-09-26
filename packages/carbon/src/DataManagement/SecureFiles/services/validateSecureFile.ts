import {
  getSecureDocumentsAllowedExtensions,
  getSecureDocumentsAllowedMimeTypes,
} from "StaticData/SecureDocuments";
const isRarWithoutMimeType = (fileExtension: string, fileMimeType: string) =>
  fileExtension === "rar" && !fileMimeType;
const isAllowedMimeType = (fileMimeType: string) =>
  getSecureDocumentsAllowedMimeTypes().includes(fileMimeType);
const isAllowedExtension = (fileExtension: string) =>
  getSecureDocumentsAllowedExtensions().includes(`.${fileExtension}`);
export const validateSecureFile = (
  fileName: string,
  fileMimeType: string
): boolean => {
  const fileExtension = fileName.split(".").pop().toLowerCase();
  return (
    isRarWithoutMimeType(fileExtension, fileMimeType) ||
    (isAllowedMimeType(fileMimeType) && isAllowedExtension(fileExtension))
  );
};
