import { DataStatus } from "@dashlane/carbon-api-consumers";
import useTranslate from "../../../libs/i18n/useTranslate";
import {
  useHistory,
  useRouterGlobalSettingsContext,
} from "../../../libs/router";
import { usePremiumStatus } from "../../../libs/carbon/hooks/usePremiumStatus";
import { VaultHeader } from "../../components/header/vault-header";
import { getDefaultSharing } from "../../sharing-invite/helpers";
import { SharingButton } from "../../sharing-invite/sharing-button";
import { ItemsTabs } from "../../sharing-invite/types";
import { Origin } from "@dashlane/hermes";
const I18N_KEYS = {
  SHARE: "credentials_header_share_password",
  UI_TOOLTIP: "webapp_secure_notes_header_add_ui_tooltip",
  TOOLTIP: "webapp_secure_notes_header_add_tooltip",
};
interface SecretsHeaderProps {
  totalSecretsCount: number;
}
export const SecretsHeader = ({ totalSecretsCount }: SecretsHeaderProps) => {
  const premiumStatus = usePremiumStatus();
  const history = useHistory();
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const isLoading = premiumStatus.status !== DataStatus.Success;
  if (isLoading) {
    return null;
  }
  const getShareActionLocal = () => {
    const hasSecrets = totalSecretsCount > 0;
    if (!hasSecrets) {
      return null;
    }
    const sharing = {
      ...getDefaultSharing(),
      tab: ItemsTabs.Secrets,
    };
    return (
      <SharingButton
        intensity="quiet"
        sharing={sharing}
        text={translate(I18N_KEYS.SHARE)}
        origin={Origin.ItemListView}
      />
    );
  };
  const onClickAddNew = () => {
    history.push(routes.userAddBlankSecret);
  };
  const shareButton = getShareActionLocal();
  return (
    <VaultHeader
      tooltipPassThrough={true}
      tooltipContent={translate(I18N_KEYS.UI_TOOLTIP)}
      handleAddNew={onClickAddNew}
      shareButtonElement={shareButton}
      shouldDisplayNewAccountImportButton={!!totalSecretsCount}
      shouldDisplayAddButton={!!totalSecretsCount}
    />
  );
};
