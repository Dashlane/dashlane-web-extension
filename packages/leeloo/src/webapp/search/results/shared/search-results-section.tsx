import { FC, useMemo } from "react";
import { DSStyleObject, Heading, List, mergeSx } from "@dashlane/design-system";
import {
  Collection,
  VaultItem,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { LoadMore } from "./load-more";
import { SearchResultVaultItemProps } from "./types";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useItemSearchRankedData } from "../../../sidemenu/search/results/use-item-search-data";
import SearchEventLogger from "../../../sidemenu/search/search-event-logger";
import * as Items from "../items";
import { CollectionItem } from "../items/collection";
const I18N_KEYS = {
  EMPTY: "webapp_sidemenu_search_results_empty",
  SECTION_RESULTS_HEADER: "webapp_search_sections_results_header_plural_markup",
};
const STYLES: Record<string, Partial<DSStyleObject>> = {
  BASE: { padding: "0 8px" },
  WITH_RESULTS: { marginBottom: "16px" },
};
const VaultItemsToRenderer: Record<
  VaultItemType,
  FC<SearchResultVaultItemProps>
> = {
  [VaultItemType.Credential]: Items.CredentialItem,
  [VaultItemType.Passkey]: Items.PasskeyItem,
  [VaultItemType.Secret]: Items.SecretItem,
  [VaultItemType.SecureNote]: Items.SecureNoteItem,
  [VaultItemType.BankAccount]: Items.BankAccountItem,
  [VaultItemType.PaymentCard]: Items.PaymentCardItem,
  [VaultItemType.Address]: Items.AddressItem,
  [VaultItemType.Company]: Items.CompanyItem,
  [VaultItemType.Email]: Items.EmailItem,
  [VaultItemType.Identity]: Items.IdentityItem,
  [VaultItemType.Phone]: Items.PhoneItem,
  [VaultItemType.Website]: Items.WebsiteItem,
  [VaultItemType.DriversLicense]: Items.IdDocumentItem,
  [VaultItemType.FiscalId]: Items.IdDocumentItem,
  [VaultItemType.IdCard]: Items.IdDocumentItem,
  [VaultItemType.Passport]: Items.IdDocumentItem,
  [VaultItemType.SocialSecurityId]: Items.IdDocumentItem,
};
interface SearchResultsSectionProps {
  query: string;
  search: ReturnType<typeof useItemSearchRankedData>;
}
const isCollection = (item: VaultItem | Collection): item is Collection => {
  return (item as Collection).vaultItems !== undefined;
};
export const SearchResultsSection = ({
  query,
  search,
}: SearchResultsSectionProps) => {
  const { translate } = useTranslate();
  const { result } = search;
  const remaining = result ? result.matchCount - result.items?.length : 0;
  const hasResults = result ? result?.matchCount > 0 : false;
  SearchEventLogger.totalCount = result?.matchCount ?? 0;
  const title = result?.matchCount
    ? translate.markup(I18N_KEYS.SECTION_RESULTS_HEADER, {
        count: result?.matchCount,
        query,
      })
    : translate(I18N_KEYS.EMPTY);
  const items = useMemo(() => {
    if (!result?.items) {
      return null;
    }
    return result.items.map((item, index, items) => {
      if (isCollection(item)) {
        return (
          <CollectionItem
            key={item.id}
            index={index}
            matchCount={items.length}
            item={item}
          />
        );
      }
      const Item = VaultItemsToRenderer[item.kwType as VaultItemType];
      return (
        <Item
          key={item.id}
          index={index}
          matchCount={items.length}
          item={item}
        />
      );
    });
  }, [result]);
  return (
    <section data-testid="search-results">
      <Heading
        as="h3"
        color="ds.text.neutral.quiet"
        textStyle="ds.title.supporting.small"
        sx={mergeSx([STYLES.BASE, hasResults ? STYLES.WITH_RESULTS : {}])}
      >
        {title}
      </Heading>
      {hasResults ? (
        <>
          <List>{items}</List>
          <LoadMore loadMore={search.loadMore} remaining={remaining} />
        </>
      ) : null}
    </section>
  );
};
