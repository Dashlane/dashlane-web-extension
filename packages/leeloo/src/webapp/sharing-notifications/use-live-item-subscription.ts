import { useCallback, useEffect, useRef } from "react";
import {
  CredentialItemView,
  ListResults,
  NoteItemView,
  SecretItemView,
} from "@dashlane/communication";
import { carbonConnector } from "../../libs/carbon/connector";
import { getItemIdsByItemType, getItemsToken } from "./helpers/helpers";
import { SharedItemNotification } from "./types";
import { ShareableItemType } from "@dashlane/sharing-contracts";
type CarbonUnsubscribe = () => void;
type VaultLiveListResults =
  | ListResults<CredentialItemView>
  | ListResults<NoteItemView>
  | ListResults<SecretItemView>;
type VaultLiveListHandler = (results: VaultLiveListResults) => void;
export const useLiveItemSubscription = (
  itemNotifications: SharedItemNotification[],
  vaultLiveListHandler: (listResults: VaultLiveListResults) => void
) => {
  const unsubLiveCredentialsRef = useRef<CarbonUnsubscribe>();
  const unsubLiveNotesRef = useRef<CarbonUnsubscribe>();
  const unsub = useCallback(() => {
    unsubLiveCredentialsRef.current?.();
    unsubLiveCredentialsRef.current = undefined;
    unsubLiveNotesRef.current?.();
    unsubLiveNotesRef.current = undefined;
  }, []);
  const subscribe = useCallback(
    (
      notifications: SharedItemNotification[],
      handler: VaultLiveListHandler
    ) => {
      unsub();
      const credentialIds = getItemIdsByItemType(
        notifications,
        ShareableItemType.Credential
      );
      if (credentialIds.length > 0) {
        unsubLiveCredentialsRef.current = carbonConnector.liveCredentials.on(
          getItemsToken(credentialIds),
          handler
        );
      }
      const notesIds = getItemIdsByItemType(
        notifications,
        ShareableItemType.SecureNote
      );
      if (notesIds.length > 0) {
        unsubLiveNotesRef.current = carbonConnector.liveNotes.on(
          getItemsToken(notesIds),
          handler
        );
      }
      return () => {
        unsubLiveCredentialsRef.current?.();
        unsubLiveCredentialsRef.current = undefined;
        unsubLiveNotesRef.current?.();
        unsubLiveNotesRef.current = undefined;
      };
    },
    [unsub]
  );
  useEffect(() => {
    if (itemNotifications.length > 0) {
      subscribe(itemNotifications, vaultLiveListHandler);
    } else {
      unsub();
    }
  }, [itemNotifications, vaultLiveListHandler, subscribe, unsub]);
};
