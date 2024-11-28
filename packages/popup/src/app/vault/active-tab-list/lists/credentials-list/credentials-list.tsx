import { FC, useRef } from "react";
import { CredentialSearchOrder } from "@dashlane/communication";
import { jsx } from "@dashlane/design-system";
import { Highlight, ItemType } from "@dashlane/hermes";
import { Credential, VaultItemType } from "@dashlane/vault-contracts";
import LoaderIcon from "../../../../../components/icons/loader.svg";
import { useIntersectionObserver } from "../../../../../libs/hooks/useIntersectionObserver";
import { logSelectVaultItem } from "../../../../../libs/logs/events/vault/select-item";
import { Website } from "../../../../../store/types";
import { useVaultItemDetailView } from "../../../detail-views";
import SearchEventLogger from "../../../search-event-logger";
import { useSearchContext } from "../../../search-field/search-context";
import { SectionListHeaderWithSort } from "../common";
import { SectionCard } from "../common/components/section-card";
import { SectionList } from "../common/section-list";
import sharedListStyles from "../common/sharedListStyles.css";
import { AddPasswordItem } from "./add-password-item/add-password-item";
import {
  CredentialItem,
  CredentialItemOrigin,
} from "./credential-item/credential-item";
import styles from "./styles.css";
import { SuggestedItemsList } from "./suggested-items-list";
interface CredentialsListProps {
  credentials: Credential[];
  credentialsCount: number;
  onOrderChange: (value: CredentialSearchOrder) => void;
  order: CredentialSearchOrder;
  onLoadMore: () => void;
  hasMore: boolean;
  isNextPageLoading: boolean;
  website: Website;
}
export const CredentialsList: FC<CredentialsListProps> = ({
  credentials,
  credentialsCount,
  onOrderChange,
  onLoadMore,
  hasMore,
  isNextPageLoading,
  order,
  website,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { searchValue } = useSearchContext();
  const { openDetailView } = useVaultItemDetailView();
  const isSearching = searchValue !== "";
  const openCredentialDetailView = (
    id: string,
    origin: CredentialItemOrigin,
    listIndex?: number,
    listLength?: number
  ) => {
    logSelectVaultItem(
      id,
      ItemType.Credential,
      listIndex,
      listLength,
      origin === "suggested" ? Highlight.Suggested : Highlight.None
    );
    if (isSearching) {
      SearchEventLogger.logSearchEvent();
    }
    openDetailView(VaultItemType.Credential, id);
  };
  useIntersectionObserver({
    hasMore,
    bottomRef,
    loadMore: onLoadMore,
  });
  return (
    <section className={sharedListStyles.listContent} ref={containerRef}>
      {!isSearching && (
        <SuggestedItemsList
          website={website}
          openCredentialDetailView={openCredentialDetailView}
        />
      )}
      <SectionCard>
        <SectionListHeaderWithSort
          headerRef={headerRef}
          sortingOrder={order}
          onOrderChange={(newOrder) => {
            onOrderChange(newOrder);
            containerRef.current?.scrollTo(0, 0);
          }}
          credentialsCount={credentialsCount}
        />

        <SectionList containerRef={containerRef} headerRef={headerRef}>
          {credentials.map((credential, index) => (
            <CredentialItem
              key={credential.id}
              credential={credential}
              onOpenDetailsView={(id: string, origin: CredentialItemOrigin) => {
                if (isSearching) {
                  openCredentialDetailView(
                    id,
                    origin,
                    index + 1,
                    credentials.length
                  );
                } else {
                  openCredentialDetailView(id, origin);
                }
              }}
              origin={isSearching ? "search" : "list"}
            />
          ))}
        </SectionList>
        {isSearching ? (
          <nav key="add-password-key" className={styles.row}>
            <AddPasswordItem name={searchValue} origin="list" />
          </nav>
        ) : null}
        <div ref={bottomRef}>
          {isNextPageLoading ? (
            <div className={sharedListStyles.loader}>
              <LoaderIcon />
            </div>
          ) : null}
        </div>
      </SectionCard>
    </section>
  );
};
