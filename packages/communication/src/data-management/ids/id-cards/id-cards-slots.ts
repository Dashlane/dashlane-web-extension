import { slot } from "ts-event-bus";
import {
  AddIdCardRequest,
  AddIdCardResult,
  EditIdCardRequest,
  EditIdCardResult,
} from "./types";
export const idCardsCommandsSlots = {
  addIdCard: slot<AddIdCardRequest, AddIdCardResult>(),
  editIdCard: slot<EditIdCardRequest, EditIdCardResult>(),
};
