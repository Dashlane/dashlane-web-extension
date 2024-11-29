import { sortBy, toLower } from "ramda";
import { Permission, SharingGroup } from "@dashlane/sharing-contracts";
import {
  ItemsTabs,
  Sharing,
  SharingInviteStep,
  SharingInviteUser,
} from "./types";
import { carbonConnector } from "../../libs/carbon/connector";
export function getDefaultSharing(): Sharing {
  return {
    permission: Permission.Limited,
    selectedCredentials: [],
    selectedGroups: [],
    selectedNotes: [],
    selectedSecrets: [],
    selectedUsers: [],
    selectedPrivateCollections: [],
    selectedSharedCollections: [],
    step: SharingInviteStep.Elements,
    tab: ItemsTabs.Passwords,
  };
}
export function getNoteSharing(noteId: string): Sharing {
  return {
    ...getDefaultSharing(),
    selectedNotes: [noteId],
    step: SharingInviteStep.Recipients,
  };
}
export function getSecretSharing(secretId: string): Sharing {
  return {
    ...getDefaultSharing(),
    selectedSecrets: [secretId],
    step: SharingInviteStep.Recipients,
  };
}
export function getCredentialSharing(credentialId: string): Sharing {
  return {
    ...getDefaultSharing(),
    selectedCredentials: [credentialId],
    step: SharingInviteStep.Recipients,
  };
}
export function getPrivateCollectionSharing(
  privateCollectionId: string
): Sharing {
  return {
    ...getDefaultSharing(),
    selectedPrivateCollections: [privateCollectionId],
    step: SharingInviteStep.CollectionRecipients,
  };
}
export function getProtectedPrivateCollectionSharing(
  privateCollectionId: string
): Sharing {
  return {
    ...getDefaultSharing(),
    selectedPrivateCollections: [privateCollectionId],
    step: SharingInviteStep.UnlockProtectedCollection,
  };
}
export const sortGroups = sortBy((g: SharingGroup) => toLower(g.name || ""));
export const sortUsers = sortBy((u: SharingInviteUser) => toLower(u.id ?? u));
export const checkForProtectedItems = async (
  selectedCredentialList: string[],
  selectedNoteList: string[]
) => {
  const mpSettingsResponse = await carbonConnector.arePasswordsProtected();
  if (mpSettingsResponse) {
    return true;
  }
  const credentials = await Promise.all(
    selectedCredentialList.map((credentialId) =>
      carbonConnector.getCredential(credentialId)
    )
  );
  const someCredentialsProtected = credentials.some(
    (credential) => !!credential?.autoProtected
  );
  if (someCredentialsProtected) {
    return true;
  }
  const notes = await Promise.all(
    selectedNoteList.map((noteId) => carbonConnector.getNote(noteId))
  );
  const someNotesProtected = notes.some((note) => !!note?.secured);
  return someNotesProtected;
};
