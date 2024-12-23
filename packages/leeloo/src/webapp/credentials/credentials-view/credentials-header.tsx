import React from "react";
import { useHistory } from "react-router-dom";
import { Origin } from "@dashlane/hermes";
import useTranslate from "../../../libs/i18n/useTranslate";
import {
  usePasswordLimitPaywall,
  usePaywall,
} from "../../../libs/paywall/paywallContext";
import { useRouterGlobalSettingsContext } from "../../../libs/router";
import { PaywallName } from "../../paywall";
import { getDefaultSharing } from "../../sharing-invite/helpers";
import { ItemsTabs } from "../../sharing-invite/types";
import { SharingButton } from "../../sharing-invite/sharing-button";
import { VaultHeader } from "../../components/header/vault-header";
import { useHasCredentialsContext } from "./has-credentials-context";
const I18N_KEYS = {
  SHARE: "credentials_header_share_password",
  UPGRADE_TOOLTIP: "webapp_paywall_password_limit_tooltip",
};
export const CredentialsHeader = () => {
  const { translate } = useTranslate();
  const usePasswordLimitResult = usePasswordLimitPaywall();
  const shouldShowAtOrOverLimitContent =
    !usePasswordLimitResult.isLoading &&
    usePasswordLimitResult.shouldShowAtOrOverLimitContent;
  const { openPaywall } = usePaywall();
  const history = useHistory();
  const { routes } = useRouterGlobalSettingsContext();
  const hasCredentials = useHasCredentialsContext();
  const onClickAddNew = () => {
    if (shouldShowAtOrOverLimitContent) {
      openPaywall(PaywallName.Credential);
    } else {
      history.push(routes.userAddWebsiteCredential);
    }
  };
  return (
    <VaultHeader
      tooltipPassThrough={!shouldShowAtOrOverLimitContent}
      tooltipContent={translate(I18N_KEYS.UPGRADE_TOOLTIP)}
      handleAddNew={onClickAddNew}
      addNewDisabled={usePasswordLimitResult.isLoading}
      shareButtonElement={
        <SharingButton
          sharing={{
            ...getDefaultSharing(),
            tab: ItemsTabs.Passwords,
          }}
          intensity="quiet"
          text={translate(I18N_KEYS.SHARE)}
          origin={Origin.ItemListView}
        />
      }
      shouldDisplayPasswordHistoryButton={true}
      shouldDisplayAddButton={hasCredentials}
      shouldDisplayNewAccountImportButton={hasCredentials}
    />
  );
};
