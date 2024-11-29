import { useEffect, useMemo } from "react";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { Dialog } from "@dashlane/design-system";
import { Origin, PageView } from "@dashlane/hermes";
import {} from "@dashlane/vault-contracts";
import { useHasFeatureEnabled } from "../../libs/carbon/hooks/useHasFeature";
import { SharingInvite } from "./share-invite";
import useTranslate from "../../libs/i18n/useTranslate";
import { logPageView } from "../../libs/logs/logEvent";
import {
  MultiselectProvider,
  SelectableItemType,
} from "../list-view/multi-select/multi-select-context";
import { Sharing } from "./types";
import { allIgnoreClickOutsideClassName } from "../variables";
const I18N_KEYS = {
  DISMISS: "_common_dialog_dismiss_button",
  SHARE: "credentials_header_share_password",
};
interface SharingInviteDialogProps {
  onDismiss: () => void;
  recipientsOnlyShowSelected?: boolean;
  sharing: Sharing;
  origin: Origin;
}
export const SharingInviteDialog = ({
  onDismiss,
  recipientsOnlyShowSelected,
  sharing,
  origin,
}: SharingInviteDialogProps) => {
  const { translate } = useTranslate();
  const hasSAEXSendSharing = useHasFeatureEnabled(
    FEATURE_FLIPS_WITHOUT_MODULE.SAEXSendSharing
  );
  useEffect(() => {
    logPageView(PageView.SharingCreateMember);
  }, []);
  const preselectedItems: Record<SelectableItemType, Set<string>> = useMemo(
    () => ({
      credentials: new Set(sharing.selectedCredentials),
      notes: new Set(sharing.selectedNotes),
      secrets: new Set(sharing.selectedSecrets),
      users: new Set(sharing.selectedUsers),
      groups: new Set(sharing.selectedGroups),
    }),
    [sharing]
  );
  if (!hasSAEXSendSharing) {
    return null;
  }
  return (
    <Dialog
      isOpen
      onClose={onDismiss}
      aria-label={translate(I18N_KEYS.SHARE)}
      closeActionLabel={translate(I18N_KEYS.DISMISS)}
      dialogClassName={allIgnoreClickOutsideClassName}
    >
      <MultiselectProvider initialSelectedItems={preselectedItems}>
        <SharingInvite
          onDismiss={onDismiss}
          recipientsOnlyShowSelected={recipientsOnlyShowSelected}
          sharing={sharing}
          origin={origin}
        />
      </MultiselectProvider>
    </Dialog>
  );
};
