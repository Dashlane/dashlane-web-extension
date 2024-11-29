import { useEffect, useState } from "react";
import {
  Button,
  ClickOrigin,
  PageView,
  UserClickEvent,
} from "@dashlane/hermes";
import {
  DataStatus,
  useFeatureFlip,
  useModuleQueries,
} from "@dashlane/framework-react";
import {
  scimApi,
  ScimConfigurationQuerySuccess,
  ScimEndpointQuerySuccess,
} from "@dashlane/sso-scim-contracts";
import {
  BillingMethod,
  TEAM_PLAN_DETAILS_FEATURE_FLIPS,
} from "@dashlane/team-admin-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent, logPageView } from "../../../../libs/logs/logEvent";
import { useTeamBillingInformation } from "../../../../libs/hooks/use-team-billing-information";
import { ChoosePaymentMethodDialog } from "../../../account/billing/choose-payment-method-dialog/choose-payment-method-dialog";
import {
  AddSeatsWrapper,
  BillingDetails,
} from "../../../account/add-seats/add-seats-wrapper";
import { AddSeatsNG } from "../../../account/add-seats/add-seats-ds";
import { CostDetailsForTier } from "../../../account/add-seats/teamPlanCalculator";
import { UpgradeSuccess } from "../../../account/upgrade-success";
import { ResponsiveMainSecondaryLayout } from "../../components/layout/responsive-main-secondary-layout";
import { BackPageLayout } from "../../components/layout/back-page-layout";
import { LinkCard, LinkType } from "../../components/layout/link-card";
import { UserProvisioningScimSetup } from "./user-provisioning/setup-confidential-scim";
import { ReviewSeatsUsageCard } from "./user-provisioning/review-seats-usage";
import { GroupProvisioningScimSetup } from "./group-provisioning/group-provisioning-scim-setup";
const I18N_KEYS = {
  HEADER: "tac_settings_confidential_scim_header",
  HEADER_HELPER: "tac_settings_confidential_scim_header_helper",
  HELP_CARD_HEADER: "tac_settings_confidential_scim_help_card_header",
  HELP_CARD_DESCRIPTION: "tac_settings_confidential_scim_help_card_description",
  HELP_CARD_LINK: "tac_settings_confidential_scim_help_card_link",
};
export const ConfidentialSCIM = () => {
  const { translate } = useTranslate();
  const [scimConfigurationData, setScimConfigurationData] = useState<
    ScimConfigurationQuerySuccess | undefined
  >();
  const [scimEndpointData, setScimEndpointData] = useState<
    ScimEndpointQuerySuccess | undefined
  >();
  const [isTeamUpgradeOpen, setIsTeamUpgradeOpen] = useState(false);
  const [isTeamUpgradeSuccessOpen, setIsTeamUpgradeSuccessOpen] =
    useState(false);
  const [lastAdditionalSeatsDetails, setLastAdditionalSeatsDetails] = useState<
    CostDetailsForTier[] | undefined
  >();
  const [lastBillingDetails, setLastBillingDetails] = useState<
    BillingDetails | undefined
  >();
  const [showPaymentMethodDialog, setShowPaymentMethodDialog] = useState(false);
  const { scimConfiguration, scimEndpoint } = useModuleQueries(
    scimApi,
    {
      scimConfiguration: {},
      scimEndpoint: {},
    },
    []
  );
  const teamBillingInformation = useTeamBillingInformation();
  const isMigrationFFOn = useFeatureFlip(
    TEAM_PLAN_DETAILS_FEATURE_FLIPS.ComputePlanPricingMigration
  );
  const handleUpgradeSuccess = (
    additionalSeatsDetails: CostDetailsForTier[],
    billingDetails: BillingDetails
  ) => {
    setLastAdditionalSeatsDetails(additionalSeatsDetails);
    setLastBillingDetails(billingDetails);
    setIsTeamUpgradeOpen(false);
    setIsTeamUpgradeSuccessOpen(true);
  };
  const handleClickBuySeats = () => {
    if (teamBillingInformation?.billingType === BillingMethod.Invoice) {
      setShowPaymentMethodDialog(true);
    } else {
      setIsTeamUpgradeOpen(true);
    }
    logEvent(
      new UserClickEvent({
        button: Button.BuySeats,
        clickOrigin: ClickOrigin.ProTip,
      })
    );
  };
  const handleBuySeatsWithCreditCard = () => {
    setIsTeamUpgradeOpen(true);
    setShowPaymentMethodDialog(false);
  };
  useEffect(() => {
    if (
      scimConfiguration.status === DataStatus.Success &&
      scimConfiguration.data
    ) {
      setScimConfigurationData(scimConfiguration.data);
    }
  }, [scimConfiguration.data?.active, scimConfiguration.data?.token]);
  useEffect(() => {
    if (scimEndpoint.status === DataStatus.Success && scimEndpoint.data) {
      setScimEndpointData(scimEndpoint.data);
    }
  }, [scimEndpoint.data?.endpoint]);
  useEffect(() => {
    logPageView(PageView.TacSettingsDirectorySyncConfidentialScim);
  }, []);
  if (!teamBillingInformation) {
    return null;
  }
  const {
    lastBillingDateUnix,
    nextBillingDetails,
    spaceTier,
    seatsNumber,
    usersToBeRenewedCount,
  } = teamBillingInformation;
  return (
    <>
      {!isTeamUpgradeSuccessOpen ? (
        <BackPageLayout
          title={translate(I18N_KEYS.HEADER)}
          paragraph={translate(I18N_KEYS.HEADER_HELPER)}
        >
          <ResponsiveMainSecondaryLayout
            sx={{ padding: "0 32px" }}
            fullWidth
            mainContent={() => (
              <div
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {scimConfigurationData ? (
                  <>
                    <UserProvisioningScimSetup
                      scimConfiguration={scimConfigurationData}
                      scimEndpoint={scimEndpointData}
                    />
                    {scimConfigurationData.active ? (
                      <ReviewSeatsUsageCard
                        onClickBuySeats={handleClickBuySeats}
                      />
                    ) : null}
                    <GroupProvisioningScimSetup />
                  </>
                ) : null}
              </div>
            )}
            secondaryContent={
              <LinkCard
                heading={translate(I18N_KEYS.HELP_CARD_HEADER)}
                description={translate(I18N_KEYS.HELP_CARD_DESCRIPTION)}
                linkProps={{
                  linkType: LinkType.ExternalLink,
                  linkHref: "__REDACTED__",
                  onClick: () => {
                    logEvent(
                      new UserClickEvent({
                        button: Button.SeeSetupGuide,
                        clickOrigin: ClickOrigin.NeedHelp,
                      })
                    );
                  },
                }}
                linkText={translate(I18N_KEYS.HELP_CARD_LINK)}
              />
            }
          />
        </BackPageLayout>
      ) : null}
      {showPaymentMethodDialog ? (
        <ChoosePaymentMethodDialog
          openUpgradeDialog={handleBuySeatsWithCreditCard}
          handleClose={() => setShowPaymentMethodDialog(false)}
        />
      ) : null}
      {isTeamUpgradeOpen ? (
        isMigrationFFOn ? (
          <AddSeatsNG
            numberOfCurrentPaidSlots={seatsNumber}
            onUpgradeSuccess={handleUpgradeSuccess}
            onClose={() => setIsTeamUpgradeOpen(false)}
          />
        ) : (
          <AddSeatsWrapper
            key={lastBillingDateUnix}
            nextBillingDetails={nextBillingDetails}
            numberOfCurrentPaidSlots={seatsNumber}
            numberOfCurrentUsedSlots={usersToBeRenewedCount}
            onUpgradeSuccess={handleUpgradeSuccess}
            onRequestClose={() => setIsTeamUpgradeOpen(false)}
            planTier={spaceTier}
          />
        )
      ) : null}
      {isTeamUpgradeSuccessOpen &&
      lastAdditionalSeatsDetails &&
      lastBillingDetails ? (
        <UpgradeSuccess
          lastAdditionalSeatsDetails={lastAdditionalSeatsDetails}
          lastBillingDetails={lastBillingDetails}
          onNavigateBack={() => {
            setIsTeamUpgradeSuccessOpen(false);
            setLastAdditionalSeatsDetails(undefined);
            setLastBillingDetails(undefined);
          }}
        />
      ) : null}
    </>
  );
};
