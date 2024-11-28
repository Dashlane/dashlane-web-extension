import React from "react";
import { Email, ItemsQueryResult } from "@dashlane/vault-contracts";
import { VaultItemsList } from "../../common";
import { EmailListItem } from "./email-list-item";
interface EmailListProps {
  emailsResult: ItemsQueryResult<Email>;
}
export const EmailList = ({ emailsResult }: EmailListProps) => (
  <VaultItemsList
    ItemComponent={EmailListItem}
    items={emailsResult.items}
    titleKey={"tab/all_items/personal_info/emails/title"}
    totalItemsCount={emailsResult.matchCount}
  />
);
