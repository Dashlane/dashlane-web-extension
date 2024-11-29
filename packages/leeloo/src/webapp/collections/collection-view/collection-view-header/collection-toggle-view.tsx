import { useEffect } from "react";
import { useSecureNotesContext } from "../../../secure-notes/secure-notes-view/secure-notes-context";
import { ItemsTabs } from "../../../sharing-invite/types";
import { useHasCredentialsContext } from "../../../credentials/credentials-view/has-credentials-context";
import { CredentialsNotesToggle } from "./credentials-notes-toggle";
type CredentialsNotesToggleProps = {
  isNotesViewDisplayed: boolean;
  setTab: (tab: ItemsTabs) => void;
};
export const CollectionToggleView = ({
  isNotesViewDisplayed,
  setTab,
}: CredentialsNotesToggleProps) => {
  const { secureNotes } = useSecureNotesContext();
  const hasCredentials = useHasCredentialsContext();
  useEffect(() => {
    if (!hasCredentials && secureNotes?.length > 0) {
      setTab(ItemsTabs.SecureNotes);
    } else if (hasCredentials && !secureNotes?.length) {
      setTab(ItemsTabs.Passwords);
    }
    return () => {
      setTab(ItemsTabs.Passwords);
    };
  }, [hasCredentials, secureNotes]);
  if (!secureNotes?.length || (!hasCredentials && secureNotes.length > 0)) {
    return null;
  }
  return (
    <CredentialsNotesToggle
      isNotesViewDisplayed={isNotesViewDisplayed}
      setTab={setTab}
    />
  );
};
