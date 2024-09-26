import { slot } from "ts-event-bus";
import { DuplicateVaultItemRequest, DuplicateVaultItemResponse } from "./types";
export const duplicationCommandsSlots = {
  duplicateVaultItem: slot<
    DuplicateVaultItemRequest,
    DuplicateVaultItemResponse
  >(),
};
