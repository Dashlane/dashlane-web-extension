export type StyxApiSuccess = {
  success: true;
};
export type StyxApiError = {
  success: false;
  error: string;
};
export type StyxApiResponse = StyxApiSuccess | StyxApiError;
export const StyxApiStatusSuccess = 200;
export const StyxApiStatusErrorBadRequest = 400;
export const StyxApiStatusErrorUnauthorized = 401;
export const StyxApiStatusErrorPayloadTooLarge = 413;
export const StyxApiStatusErrorInternalServe = 500;
