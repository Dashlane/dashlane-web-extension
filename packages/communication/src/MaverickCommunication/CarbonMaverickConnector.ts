import { slot, Slot } from "ts-event-bus";
import { WebOnboardingModeEvent } from "../Onboarding";
import { SavePersonalDataItemFromCapture, FilledDataItem } from "../";
export const CarbonMaverickConnector = {
  savePersonalDataItem: slot<SavePersonalDataItemFromCapture>(),
  filledDataItem: slot<FilledDataItem>(),
  updateWebOnboardingMode: slot<WebOnboardingModeEvent>(),
};
