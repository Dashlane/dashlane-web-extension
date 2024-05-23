import { jsx } from '@dashlane/design-system';
import { useEffect, useRef } from 'react';
import { Credential } from '@dashlane/vault-contracts';
import { InfiniteScrollList } from 'webapp/vault/pagination/infinite-scroll-list';
import { CredentialListItem } from 'webapp/credentials/list/credential-list-item';
import { useMultiselectUpdateContext } from './multi-select/multi-select-context';
import { useCredentialsContext } from '../credentials-view/credentials-context';
export const CredentialsList = () => {
    const { toggleSelectItem, toggleSelectItems } = useMultiselectUpdateContext();
    const { credentials, hasMore, onNextPage } = useCredentialsContext();
    const isShiftKeyPressed = useRef(false);
    const lastSelectedIndex = useRef(0);
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.shiftKey) {
                isShiftKeyPressed.current = true;
            }
        };
        const onKeyUp = () => {
            isShiftKeyPressed.current = false;
        };
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, []);
    const onSelectCredential = (credential: Credential) => {
        const selectedIndex = credentials.findIndex((listCredential) => listCredential.id === credential.id);
        if (!isShiftKeyPressed.current) {
            lastSelectedIndex.current = selectedIndex;
            toggleSelectItem(credential);
            return;
        }
        let upperIndex;
        let lowerIndex;
        if (selectedIndex > lastSelectedIndex.current) {
            upperIndex = selectedIndex;
            lowerIndex = lastSelectedIndex.current + 1;
        }
        else {
            upperIndex = lastSelectedIndex.current;
            lowerIndex = selectedIndex;
        }
        lastSelectedIndex.current = selectedIndex;
        toggleSelectItems(credentials.slice(lowerIndex, upperIndex + 1));
    };
    return (<div data-testid="credentials-list" sx={{
            height: '100%',
            overflow: 'hidden',
        }}>
      <InfiniteScrollList onNextPage={onNextPage} hasMore={hasMore}>
        {credentials?.map((credential) => (<CredentialListItem key={`credentials_list_credentialId_${credential.id}`} credential={credential} onSelectCredential={onSelectCredential}/>))}
      </InfiniteScrollList>
    </div>);
};
