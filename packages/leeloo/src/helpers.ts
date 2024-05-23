import { browser, os } from '@dashlane/browser-utils';
export const getDefaultDeviceName = (fallback: string) => `${browser.getBrowserName() || fallback} - ${os.getOSName()}`;
export const transformUnknownErrorToErrorMessage = (error: unknown) => {
    let message;
    if (error instanceof Error)
        message = error.message;
    else
        message = String(error);
    return message;
};
