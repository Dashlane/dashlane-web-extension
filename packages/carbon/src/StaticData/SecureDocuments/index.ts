import { allowedExtensions } from "./extensions";
import { allowedMimeTypes } from "./mime-types";
export function getSecureDocumentsAllowedExtensions(): string[] {
  return allowedExtensions;
}
export function getSecureDocumentsAllowedMimeTypes(): string[] {
  return allowedMimeTypes;
}
