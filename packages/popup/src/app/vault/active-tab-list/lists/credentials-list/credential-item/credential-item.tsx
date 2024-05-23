import React, { memo, RefObject, useState } from 'react';
import { Credential } from '@dashlane/vault-contracts';
import { Thumbnail } from '@dashlane/ui-components';
import { ParsedURL } from '@dashlane/url-parser';
import { CredentialActions } from 'src/app/vault/active-tab-list/lists/credentials-list/credential-item/credential-action/credential-actions';
import { useDomainIconDetails } from 'src/libs/hooks/use-domain-icon-details';
import { SectionRow } from '../../common';
export type CredentialItemOrigin = 'list' | 'search' | 'suggested';
export interface CredentialItemComponentProps {
    credential: Credential;
    onOpenDetailsView: (id: string, origin: CredentialItemOrigin) => void;
    index: number;
    listContainerRef: RefObject<HTMLElement>;
    listHeaderRef?: RefObject<HTMLElement>;
    origin: CredentialItemOrigin;
}
const CredentialItemComponent = ({ credential, listContainerRef, listHeaderRef, onOpenDetailsView, origin, }: CredentialItemComponentProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const closeDropdown = () => setIsDropdownOpen(false);
    const { iconSource, backgroundColor } = useDomainIconDetails(new ParsedURL(credential.URL).getRootDomain());
    return (<SectionRow thumbnail={<Thumbnail size="small" backgroundColor={backgroundColor} text={credential.itemName} iconSource={iconSource}/>} itemSpaceId={credential.spaceId} title={credential.itemName} subtitle={credential.username || credential.email} containerRef={listContainerRef} headerRef={listHeaderRef} onClick={() => onOpenDetailsView(credential.id, origin)} onRowLeave={closeDropdown} actions={<CredentialActions credential={credential} isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen}/>}/>);
};
export const CredentialItem = memo(CredentialItemComponent);
