import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { SharedAccessMember } from "../../common-types";
export interface SharedAccessForItemResult {
  users: SharedAccessMember[];
  groups: SharedAccessMember[];
  collections: SharedAccessMember[];
  count: number;
  itemGroupId: string;
}
export class SharedAccessForItemQuery extends defineQuery<
  SharedAccessForItemResult | undefined,
  never,
  {
    itemId: string;
  }
>({ scope: UseCaseScope.User }) {}
