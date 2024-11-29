import * as React from "react";
import { VaultSourceType } from "@dashlane/autofill-contracts";
import {
  AutofillCredentialRisk,
  AutofillCredentialsAtRisk,
  WebcardItem,
  WebcardItemType,
} from "@dashlane/autofill-engine/types";
import { List } from "../../common/generic/List";
import { SimpleSelectionItem } from "../../common/items/SimpleSelectionItem";
import { EnhancedSelectionItem } from "../../common/items/EnhancedSelectionItem";
import { SECOND_STEP_CARDS } from "./common/SelfCorrectingTree";
import { EmptyPanel } from "./EmptyPanel";
interface Props {
  fieldType?: VaultSourceType;
  items: WebcardItem[];
  onAddNewItem: () => void;
  onClickItem: (item: WebcardItem) => Promise<void> | void;
  onClickItemDetails?: (item: WebcardItem) => void;
  searchValue?: string;
  tabUrl?: string;
  tabRootDomain?: string;
  withPages?: boolean;
  withScroll?: boolean;
  withLastUsedBadge?: boolean;
  withAddNewButton?: boolean;
  credentialsAtRisk?: AutofillCredentialsAtRisk;
  withSearchForMoreInfo?: boolean;
}
export const SuggestedItemsList = ({
  withLastUsedBadge,
  fieldType,
  items,
  onAddNewItem,
  onClickItem,
  onClickItemDetails,
  searchValue,
  tabUrl,
  tabRootDomain,
  withPages,
  withScroll,
  withAddNewButton,
  credentialsAtRisk,
  withSearchForMoreInfo,
}: Props) => {
  const getRiskForItem = (
    item: WebcardItem
  ): AutofillCredentialRisk | undefined => {
    if (item.itemType === VaultSourceType.Credential && credentialsAtRisk) {
      return credentialsAtRisk[item.itemId];
    }
    return undefined;
  };
  return items.length ? (
    <List
      pager={{
        displayDot: withPages ?? false,
        hasScroll: withScroll ?? false,
      }}
      data={items.map((item, index) => {
        const onClickMoreButton = SECOND_STEP_CARDS[item.itemType]
          ? onClickItemDetails
          : undefined;
        if (item.type === WebcardItemType.SimpleItem) {
          return (
            <SimpleSelectionItem
              showIcon
              key={item.itemId}
              item={item}
              onClick={onClickItem}
              onClickMoreButton={onClickMoreButton}
              itemIndex={index}
              searchValue={searchValue}
              withLastUsedBadge={withLastUsedBadge}
              risk={getRiskForItem(item)}
            />
          );
        } else {
          return (
            <EnhancedSelectionItem
              showIcon
              key={item.itemId}
              item={item}
              onClick={onClickItem}
              onClickMoreButton={onClickMoreButton}
              searchValue={searchValue}
            />
          );
        }
      })}
      withSearchForMoreInfo={withSearchForMoreInfo}
    />
  ) : (
    <EmptyPanel
      fieldType={fieldType ?? VaultSourceType.Credential}
      onAddNewItem={onAddNewItem}
      tabUrl={tabUrl}
      tabRootDomain={tabRootDomain}
      withAddNewButton={withAddNewButton}
    />
  );
};
