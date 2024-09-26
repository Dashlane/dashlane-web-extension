import { Trigger } from "@dashlane/hermes";
import {
  SetupDefaultNoteCategoriesRequest,
  SetupDefaultNoteCategoriesResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { saveNoteCategory } from "..";
import { getDebounceSync } from "DataManagement/utils";
export async function setupDefaultNoteCategoriesHandler(
  services: CoreServices,
  prepareDefaultNoteCategoriesRequest: SetupDefaultNoteCategoriesRequest
): Promise<SetupDefaultNoteCategoriesResult> {
  try {
    const { storeService, sessionService } = services;
    if (!storeService.isAuthenticated()) {
      return {
        success: false,
      };
    }
    const noteCategories = storeService.getPersonalData().noteCategories;
    if (!noteCategories || noteCategories.length === 0) {
      prepareDefaultNoteCategoriesRequest.categories.forEach((category) => {
        saveNoteCategory(storeService, {
          name: category,
        });
      });
      sessionService.getInstance().user.persistPersonalData();
      const debounceSync = getDebounceSync(storeService, sessionService);
      debounceSync({ immediateCall: true }, Trigger.Save);
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}
