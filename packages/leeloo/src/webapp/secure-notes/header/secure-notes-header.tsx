import { DataStatus } from "@dashlane/carbon-api-consumers";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { Origin } from "@dashlane/hermes";
import useTranslate from "../../../libs/i18n/useTranslate";
import {
  useHistory,
  useRouterGlobalSettingsContext,
} from "../../../libs/router";
import { usePaywall } from "../../../libs/paywall/paywallContext";
import { usePremiumStatus } from "../../../libs/carbon/hooks/usePremiumStatus";
import { useHasFeatureEnabled } from "../../../libs/carbon/hooks/useHasFeature";
import { VaultHeader } from "../../components/header/vault-header";
import { getDefaultSharing } from "../../sharing-invite/helpers";
import { SharingButton } from "../../sharing-invite/sharing-button";
import { ItemsTabs } from "../../sharing-invite/types";
import {
  PaywalledCapability,
  PaywallName,
  shouldShowPaywall,
} from "../../paywall/manager/paywall-manager";
import { useNotesCount } from "../hooks/use-notes-count";
const I18N_KEYS = {
  SHARE: "credentials_header_share_password",
  UI_TOOLTIP: "webapp_secure_notes_header_add_ui_tooltip",
  TOOLTIP: "webapp_secure_notes_header_add_tooltip",
};
export const SecureNotesHeader = () => {
  const hasDisableSecureNotes = useHasFeatureEnabled(
    FEATURE_FLIPS_WITHOUT_MODULE.DisableSecureNotes
  );
  const totalNotesCount = useNotesCount();
  const premiumStatus = usePremiumStatus();
  const history = useHistory();
  const { translate } = useTranslate();
  const { openPaywall } = usePaywall();
  const { routes } = useRouterGlobalSettingsContext();
  const isLoading =
    premiumStatus.status !== DataStatus.Success || totalNotesCount === null;
  if (isLoading) {
    return null;
  }
  const shouldDisplayPaywall = shouldShowPaywall(
    PaywalledCapability.SecureNotes,
    premiumStatus.data?.capabilities
  );
  const getShareActionLocal = () => {
    const hasNotes = totalNotesCount > 0;
    if (!hasNotes) {
      return null;
    }
    const sharing = {
      ...getDefaultSharing(),
      tab: ItemsTabs.SecureNotes,
    };
    return (
      <SharingButton
        sharing={sharing}
        intensity="quiet"
        text={translate(I18N_KEYS.SHARE)}
        origin={Origin.ItemListView}
      />
    );
  };
  const onClickAddNew = (e: React.MouseEvent<HTMLElement>) => {
    if (shouldDisplayPaywall) {
      e.preventDefault();
      openPaywall(PaywallName.SecureNote);
    } else {
      history.push(routes.userAddBlankNote);
    }
  };
  const shareButton = getShareActionLocal();
  return (
    <VaultHeader
      tooltipPassThrough={!shouldDisplayPaywall}
      tooltipContent={translate(I18N_KEYS.UI_TOOLTIP)}
      handleAddNew={(e) => onClickAddNew(e)}
      addNewDisabled={hasDisableSecureNotes}
      shareButtonElement={shareButton}
      shouldDisplayNewAccountImportButton={!!totalNotesCount}
      shouldDisplayAddButton={!!totalNotesCount}
    />
  );
};
