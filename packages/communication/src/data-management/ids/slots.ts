import { combineEvents } from "ts-event-bus";
import { driverLicensesCommandsSlots } from "./driver-licenses";
import { fiscalsIdCommandsSlots } from "./fiscal-ids/fiscal-ids-slots";
import { idCardsCommandsSlots } from "./id-cards";
import { passportsCommandsSlots } from "./passports";
import { socialSecurityIdsCommandsSlots } from "./social-security-ids";
export const idsCommandsSlots = combineEvents(
  driverLicensesCommandsSlots,
  fiscalsIdCommandsSlots,
  idCardsCommandsSlots,
  passportsCommandsSlots,
  socialSecurityIdsCommandsSlots
);
