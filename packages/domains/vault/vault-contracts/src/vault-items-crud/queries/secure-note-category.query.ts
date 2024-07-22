import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { SecureNoteCategory } from "../types";
export interface SecureNoteCategoryQueryParam {
  id?: string;
}
export class SecureNoteCategoryQuery extends defineQuery<
  SecureNoteCategory[] | string | undefined,
  never,
  SecureNoteCategoryQueryParam
>({
  scope: UseCaseScope.User,
}) {}
