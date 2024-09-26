import { slot } from "ts-event-bus";
import {
  AddSocialSecurityIdRequest,
  AddSocialSecurityIdResult,
  EditSocialSecurityIdRequest,
  EditSocialSecurityIdResult,
} from "./types";
export const socialSecurityIdsCommandsSlots = {
  addSocialSecurityId: slot<
    AddSocialSecurityIdRequest,
    AddSocialSecurityIdResult
  >(),
  editSocialSecurityId: slot<
    EditSocialSecurityIdRequest,
    EditSocialSecurityIdResult
  >(),
};
