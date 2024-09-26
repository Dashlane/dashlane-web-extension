import {
  AddSocialSecurityIdRequest,
  AddSocialSecurityIdResult,
  EditSocialSecurityIdRequest,
  EditSocialSecurityIdResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type SocialSecurityIdCommands = {
  addSocialSecurityId: Command<
    AddSocialSecurityIdRequest,
    AddSocialSecurityIdResult
  >;
  editSocialSecurityId: Command<
    EditSocialSecurityIdRequest,
    EditSocialSecurityIdResult
  >;
};
