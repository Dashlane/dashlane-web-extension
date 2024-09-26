import {
  UpdateBreachStatusRequest,
  UpdateBreachStatusResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type BreachCommands = {
  updateBreachStatus: Command<
    UpdateBreachStatusRequest,
    UpdateBreachStatusResult
  >;
};
