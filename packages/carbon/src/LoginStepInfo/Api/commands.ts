import { UpdateLoginStepInfoRequest } from "@dashlane/communication";
import { Command } from "Shared/Api";
export type LoginStepInfoCommands = {
  updateLoginStepInfo: Command<UpdateLoginStepInfoRequest, void>;
  resetLoginStepInfo: Command<void, void>;
};
