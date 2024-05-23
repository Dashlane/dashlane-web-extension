import React, { memo } from 'react';
import { DataStatus } from '@dashlane/framework-react';
import { CredentialItem, CredentialItemOrigin, } from 'src/app/vault/active-tab-list/lists/credentials-list/credential-item/credential-item';
import { Website } from 'src/store/types';
import { useCredentialsDataByDomain } from 'src/libs/api';
import { AddPasswordItem } from '../add-password-item/add-password-item';
import { SuggestedItemsListHeader } from './suggested-items-list-header';
import { sortAndMapCredentialsByDomain } from './sort-and-map-credentials-by-domain';
interface SuggestedItemsListProps {
    website: Website;
    containerRef: React.RefObject<HTMLDivElement>;
    openCredentialDetailView: (id: string, origin: CredentialItemOrigin, listIndex?: number, listLength?: number) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
}
export const SuggestedItemsListComponent = ({ website, containerRef, openCredentialDetailView, onKeyDown, }: SuggestedItemsListProps) => {
    const headerRef = React.useRef<HTMLDivElement>(null);
    const suggestedItemsData = useCredentialsDataByDomain(website.domain);
    if (suggestedItemsData.status !== DataStatus.Success) {
        return null;
    }
    const { items } = suggestedItemsData.data;
    if (items.length === 0) {
        return (<>
        <SuggestedItemsListHeader headerRef={headerRef}/>
        <AddPasswordItem origin="suggested" website={website.fullUrl}/>
      </>);
    }
    const sortedCredentials = sortAndMapCredentialsByDomain(website, items);
    return (<>
      <SuggestedItemsListHeader headerRef={headerRef}/>
      <div onKeyDown={onKeyDown}>
        {sortedCredentials.map((credential, index) => (<CredentialItem key={credential.id} credential={credential} onOpenDetailsView={(id: string, origin: CredentialItemOrigin) => openCredentialDetailView(id, origin, index + 1, sortedCredentials.length)} index={index} listContainerRef={containerRef} listHeaderRef={headerRef} origin="suggested"/>))}
      </div>
    </>);
};
export const SuggestedItemsList = memo(SuggestedItemsListComponent);
