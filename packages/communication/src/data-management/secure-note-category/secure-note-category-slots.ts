import { slot } from "ts-event-bus";
import {
  SetupDefaultNoteCategoriesRequest,
  SetupDefaultNoteCategoriesResult,
} from "./types";
export const secureNoteCategoryCommandsSlots = {
  setupDefaultNoteCategories: slot<
    SetupDefaultNoteCategoriesRequest,
    SetupDefaultNoteCategoriesResult
  >(),
};
