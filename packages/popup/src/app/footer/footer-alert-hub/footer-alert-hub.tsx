import { jsx } from "@dashlane/design-system";
import { autofillNotificationsApi } from "@dashlane/autofill-contracts";
import {
  DataStatus,
  useFeatureFlips,
  useModuleQuery,
} from "@dashlane/framework-react";
import { useIsBusinessAdmin } from "../../../libs/hooks/use-is-business-admin";
import { useIsB2BTrial } from "../../../libs/hooks/use-is-b2b-trial";
import { useIsB2CTrial } from "../../../libs/hooks/use-is-b2c-trial";
import { useIsPostB2CTrial } from "../../../libs/hooks/use-is-post-b2c-trial";
import { useShowB2CFrozenState } from "../../../libs/hooks/use-show-b2c-frozen-state";
import { getTabNumbers } from "../../helpers";
import { B2BDiscontinuationBanner } from "./b2b-trial-banner/b2b-discontinuation-banner";
import { useActiveSectionTabContext } from "../../tabs/active-section-tab-context";
import { useFooterAlertHubContext } from "./footer-alert-hub-context";
import { AutofillDisabledNotification } from "./autofill-disabled-notification/autofill-disabled-notification";
import { BusinessTrialBanner } from "./b2b-trial-banner/b2b-trial-banner";
import { B2CTrialBanner } from "./b2c-trial-banner/b2c-trial-banner";
import { B2CFrozenBanner } from "./b2c-frozen-state/b2c-frozen-state-banner";
export const FooterAlertWrapper = () => {
  const { activeTab } = useActiveSectionTabContext();
  const isB2BTrial = useIsB2BTrial();
  const isB2CTrial = useIsB2CTrial();
  const isPostB2CTrial = useIsPostB2CTrial();
  const isB2CFrozenState = useShowB2CFrozenState();
  const isAdmin = useIsBusinessAdmin();
  const retrievedFFStatus = useFeatureFlips();
  const getAutofillDisabledNotificationStatus = useModuleQuery(
    autofillNotificationsApi,
    "getAutofillDisabledOnLoginsAndFormsNotificationStatus"
  );
  const { isEmbeddedAlertShown } = useFooterAlertHubContext();
  const tabNumber = getTabNumbers(isAdmin);
  if (
    isB2BTrial === null ||
    isB2CTrial === null ||
    retrievedFFStatus.status === DataStatus.Loading ||
    getAutofillDisabledNotificationStatus.status !== DataStatus.Success ||
    isB2CFrozenState.isLoading
  ) {
    return null;
  }
  const showB2BTrialBanner =
    isB2BTrial && !isEmbeddedAlertShown && activeTab === tabNumber.VAULT;
  const showB2CTrialBanner =
    isB2CTrial && !isEmbeddedAlertShown && activeTab === tabNumber.VAULT;
  const showB2BDiscontinuationBanner = isAdmin && !isEmbeddedAlertShown;
  const showB2CFrozenBanner =
    isB2CFrozenState.showB2CFrozenBanner && !isEmbeddedAlertShown;
  const showB2CPostTrialBanner =
    !showB2CFrozenBanner &&
    isPostB2CTrial &&
    !isB2BTrial &&
    !isEmbeddedAlertShown &&
    !showB2BDiscontinuationBanner &&
    activeTab === tabNumber.VAULT;
  const showAutofillDisabledNotification =
    getAutofillDisabledNotificationStatus.data && activeTab === tabNumber.VAULT;
  return showAutofillDisabledNotification ? (
    <AutofillDisabledNotification />
  ) : showB2BTrialBanner ? (
    <BusinessTrialBanner />
  ) : showB2CTrialBanner ? (
    <B2CTrialBanner />
  ) : showB2CFrozenBanner ? (
    <B2CFrozenBanner />
  ) : showB2CPostTrialBanner ? (
    <B2CTrialBanner isPostTrial={true} />
  ) : showB2BDiscontinuationBanner ? (
    <B2BDiscontinuationBanner />
  ) : null;
};
