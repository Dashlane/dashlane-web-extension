import { FC, useRef } from 'react';
import { jsx } from '@dashlane/design-system';
import { CredentialSearchOrder } from '@dashlane/communication';
import { Credential, VaultItemType } from '@dashlane/vault-contracts';
import { Highlight, ItemType } from '@dashlane/hermes';
import { SectionListHeaderWithSort, useListKeyboardNavContext, } from 'src/app/vault/active-tab-list/lists/common';
import { logSelectVaultItem } from 'src/libs/logs/events/vault/select-item';
import { CredentialItem, CredentialItemOrigin, } from 'src/app/vault/active-tab-list/lists/credentials-list/credential-item/credential-item';
import { AddPasswordItem } from 'src/app/vault/active-tab-list/lists/credentials-list/add-password-item/add-password-item';
import { useIntersectionObserver } from 'src/libs/hooks/useIntersectionObserver';
import SearchEventLogger from 'src/app/vault/search-event-logger';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import { useVaultItemDetailView } from 'src/app/vault/detail-views';
import { Website } from 'src/store/types';
import LoaderIcon from 'src/components/icons/loader.svg';
import sharedListStyles from '../common/sharedListStyles.css';
import { SuggestedItemsList } from './suggested-items-list';
import styles from './styles.css';
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
export const CredentialsList: FC<CredentialsListProps> = ({ credentials, credentialsCount, onOrderChange, onLoadMore, hasMore, isNextPageLoading, order, website, }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const { searchValue } = useSearchContext();
    const { onKeyDown } = useListKeyboardNavContext();
    const { openDetailView } = useVaultItemDetailView();
    const isSearching = searchValue !== '';
    const openCredentialDetailView = (id: string, origin: CredentialItemOrigin, listIndex?: number, listLength?: number) => {
        logSelectVaultItem(id, ItemType.Credential, listIndex, listLength, origin === 'suggested' ? Highlight.Suggested : Highlight.None);
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
    return (<section className={sharedListStyles.listContent} ref={containerRef}>
      {!isSearching && (<SuggestedItemsList containerRef={containerRef} website={website} openCredentialDetailView={openCredentialDetailView} onKeyDown={onKeyDown}/>)}
      <SectionListHeaderWithSort headerRef={headerRef} sortingOrder={order} onOrderChange={(newOrder) => {
            onOrderChange(newOrder);
            containerRef.current?.scrollTo(0, 0);
        }} credentialsCount={credentialsCount}/>
      <ul onKeyDown={onKeyDown}>
        {credentials.map((credential, index) => (<CredentialItem key={credential.id} credential={credential} onOpenDetailsView={(id: string, origin: CredentialItemOrigin) => {
                if (isSearching) {
                    openCredentialDetailView(id, origin, index + 1, credentials.length);
                }
                else {
                    openCredentialDetailView(id, origin);
                }
            }} index={index} listContainerRef={containerRef} listHeaderRef={headerRef} origin={isSearching ? 'search' : 'list'}/>))}
      </ul>
      {isSearching ? (<nav key="add-password-key" className={styles.row}>
          <AddPasswordItem name={searchValue} origin="list"/>
        </nav>) : null}
      <div ref={bottomRef} sx={{
            paddingBottom: '20px',
        }}>
        {isNextPageLoading ? (<div className={sharedListStyles.loader}>
            <LoaderIcon />
          </div>) : null}
      </div>
    </section>);
};
