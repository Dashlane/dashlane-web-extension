import { slot } from "ts-event-bus";
import {
  AddPassportRequest,
  AddPassportResult,
  EditPassportRequest,
  EditPassportResult,
} from "./types";
export const passportsCommandsSlots = {
  addPassport: slot<AddPassportRequest, AddPassportResult>(),
  editPassport: slot<EditPassportRequest, EditPassportResult>(),
};
