import {
  differenceInCalendarDays,
  differenceInMonths,
  fromUnixTime,
} from "date-fns";
import { DataStatus } from "@dashlane/framework-react";
import { UserMessage, UserMessageTypes } from "@dashlane/communication";
import { addUserMessage, dismissUserMessage } from "../../libs/user-messages";
import { usePersonalSettings } from "../../libs/carbon/hooks/usePersonalSettings";
import { useUserMessage } from "../sharing-center/upgrade-dialog/useUserMessage";
const DAYS_AFTER_CREATION_USER_SHOULD_RATE_US = 40;
export const useWebStoreMessage = () => {
  const { messages } = useUserMessage(UserMessageTypes.WEB_STORE);
  const personalSettings = usePersonalSettings();
  const accountCreationDatetime =
    personalSettings.status === DataStatus.Success
      ? fromUnixTime(personalSettings.data.accountCreationDatetime)
      : null;
  if (!accountCreationDatetime) {
    return null;
  }
  const now = new Date();
  const daysSinceAccountCreation = Math.abs(
    differenceInCalendarDays(now, accountCreationDatetime)
  );
  const shouldRateDashlane =
    daysSinceAccountCreation >= DAYS_AFTER_CREATION_USER_SHOULD_RATE_US;
  const noWebStoreMessagesExists =
    messages.find((message: UserMessage) => {
      return message.type === UserMessageTypes.WEB_STORE;
    }) === undefined;
  const noWebStoreMessagesWithinThreshold =
    messages.find((message: UserMessage) => {
      const messageNewerThanThreshold = message.dismissedAt
        ? differenceInMonths(new Date(), message.dismissedAt) < 6
        : true;
      return (
        message.type === UserMessageTypes.WEB_STORE && messageNewerThanThreshold
      );
    }) === undefined;
  const shouldAddMessage =
    (noWebStoreMessagesExists || noWebStoreMessagesWithinThreshold) &&
    shouldRateDashlane;
  if (shouldAddMessage) {
    return () => addUserMessage({ type: UserMessageTypes.WEB_STORE });
  }
  return null;
};
export const dismissWebStoreMessage = async () => {
  await dismissUserMessage({ type: UserMessageTypes.WEB_STORE });
};
