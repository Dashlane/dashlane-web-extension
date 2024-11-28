import React from "react";
import { ItemsQueryResult, SocialSecurityId } from "@dashlane/vault-contracts";
import { VaultItemsList } from "../../common";
import { SocialSecurityIdListItem } from "./social-security-id-list-item";
interface Props {
  socialSecurityIdsResult: ItemsQueryResult<SocialSecurityId>;
}
export const SocialSecurityIdsList = ({ socialSecurityIdsResult }: Props) => (
  <VaultItemsList
    ItemComponent={SocialSecurityIdListItem}
    items={socialSecurityIdsResult.items}
    titleKey={"tab/all_items/ids/social_security_number/title"}
    totalItemsCount={socialSecurityIdsResult.matchCount}
  />
);
