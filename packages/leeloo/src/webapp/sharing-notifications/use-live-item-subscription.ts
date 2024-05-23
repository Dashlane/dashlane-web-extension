import { useCallback, useEffect, useRef } from 'react';
import { CredentialItemView, ListResults, NoteItemView, SecretItemView, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
import { getItemIdsByKwType, getItemsToken } from './helpers/helpers';
import { SharedItemNotification } from './types';
type CarbonUnsubscribe = () => void;
type VaultLiveListResults = ListResults<CredentialItemView> | ListResults<NoteItemView> | ListResults<SecretItemView>;
type VaultLiveListHandler = (results: VaultLiveListResults) => void;
export const useLiveItemSubscription = (itemNotifications: SharedItemNotification[], vaultLiveListHandler: (listResults: VaultLiveListResults) => void) => {
    const unsubLiveCredentialsRef = useRef<CarbonUnsubscribe>();
    const unsubLiveNotesRef = useRef<CarbonUnsubscribe>();
    const unsubLiveSecretsRef = useRef<CarbonUnsubscribe>();
    const unsub = useCallback(() => {
        unsubLiveCredentialsRef.current?.();
        unsubLiveCredentialsRef.current = undefined;
        unsubLiveNotesRef.current?.();
        unsubLiveNotesRef.current = undefined;
        unsubLiveSecretsRef.current?.();
        unsubLiveSecretsRef.current = undefined;
    }, []);
    const subscribe = useCallback((notifications: SharedItemNotification[], handler: VaultLiveListHandler) => {
        unsub();
        const credentialIds = getItemIdsByKwType(notifications, 'KWAuthentifiant');
        if (credentialIds.length > 0) {
            unsubLiveCredentialsRef.current = carbonConnector.liveCredentials.on(getItemsToken(credentialIds), handler);
        }
        const notesIds = getItemIdsByKwType(notifications, 'KWSecureNote');
        if (notesIds.length > 0) {
            unsubLiveNotesRef.current = carbonConnector.liveNotes.on(getItemsToken(notesIds), handler);
        }
        const secretsIds = getItemIdsByKwType(notifications, 'KWSecret');
        if (secretsIds.length > 0) {
            unsubLiveSecretsRef.current = carbonConnector.liveSecrets.on(getItemsToken(secretsIds), handler);
        }
        return () => {
            unsubLiveCredentialsRef.current?.();
            unsubLiveCredentialsRef.current = undefined;
            unsubLiveNotesRef.current?.();
            unsubLiveNotesRef.current = undefined;
            unsubLiveSecretsRef.current?.();
            unsubLiveSecretsRef.current = undefined;
        };
    }, [unsub]);
    useEffect(() => {
        if (itemNotifications.length > 0) {
            subscribe(itemNotifications, vaultLiveListHandler);
        }
        else {
            unsub();
        }
    }, [itemNotifications, vaultLiveListHandler, subscribe, unsub]);
};
