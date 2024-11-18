import { LoginNotificationType } from "@dashlane/communication";
import { LoginServices } from "Login/dependencies";
import { addNewLoginNotification } from "InMemoryInterSessionUnsyncedSettings/Store/loginNotifications/actions";
const INVALID_ERROR_TYPE_MESSAGE = "No valid error reported";
const isError = (error: unknown): error is Error =>
  typeof error === "object" && error instanceof Error;
const getErrorMessage = (error: unknown) =>
  isError(error) ? error.message : INVALID_ERROR_TYPE_MESSAGE;
export async function notifyDeviceLimitError(
  services: LoginServices,
  error: unknown
) {
  const { storeService } = services;
  const notifyErrorAction = addNewLoginNotification({
    type: LoginNotificationType.UNKNOWN_ERROR,
    message: getErrorMessage(error),
  });
  storeService.dispatch(notifyErrorAction);
}
export function augmentDeviceLimitError(error: unknown, context: string) {
  const message = `[DeviceLimit] - ${context}: ${getErrorMessage(error)}`;
  const augmentedError = new Error(message);
  if (isError(error)) {
    augmentedError.stack = error.stack;
  }
  return augmentedError;
}
