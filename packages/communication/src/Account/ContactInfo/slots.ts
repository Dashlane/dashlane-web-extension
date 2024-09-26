import { slot } from "ts-event-bus";
import { liveSlot } from "../../CarbonApi";
import {
  ContactInfo,
  EditContactInfoClientRequest,
  EditContactInfoClientResult,
  RefreshContactInfoResult,
} from "./types";
export const contactInfoCommandsSlots = {
  editContactInfo: slot<
    EditContactInfoClientRequest,
    EditContactInfoClientResult
  >(),
  refreshContactInfo: slot<undefined, RefreshContactInfoResult>(),
};
export const contactInfoQueriesSlots = {
  getContactInfo: slot<void, ContactInfo>(),
};
export const contactInfoLiveQueriesSlots = {
  liveContactInfo: liveSlot<ContactInfo>(),
};
