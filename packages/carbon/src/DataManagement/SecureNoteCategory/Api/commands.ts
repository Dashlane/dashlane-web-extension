import {
  SetupDefaultNoteCategoriesRequest,
  SetupDefaultNoteCategoriesResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type SecureNoteCategoryCommands = {
  setupDefaultNoteCategories: Command<
    SetupDefaultNoteCategoriesRequest,
    SetupDefaultNoteCategoriesResult
  >;
};
