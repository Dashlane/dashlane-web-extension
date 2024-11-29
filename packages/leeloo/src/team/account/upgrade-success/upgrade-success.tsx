import { useContext, useEffect, useState } from "react";
import { Button, Flex } from "@dashlane/design-system";
import { PageView } from "@dashlane/hermes";
import {
  GetPlanPricingDetailsResult,
  SpaceTier,
  teamAdminNotificationsApi,
} from "@dashlane/team-admin-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logPageView } from "../../../libs/logs/logEvent";
import { NavBarContext } from "../../page/nav-layout/nav-layout";
import { BillingDetails } from "../add-seats/add-seats-wrapper";
import { useBillingSeatDetails } from "../add-seats/useBillingSeatDetails";
import { CostDetailsForTier } from "../add-seats/teamPlanCalculator";
import { OrderSummary } from "./components/order-summary";
import { NewSeatsInfo } from "./components/new-seats-info";
import { CreditCardSummary } from "./components/credit-card-summary";
import { FriendsAndFamilyInfo } from "./components/friends-and-family-info";
import { IdPNextStepInfo } from "./components/idp-next-step-info";
import { useTeamBillingInformation } from "../../../libs/hooks/use-team-billing-information";
export interface UpgradeSuccessProps {
  onNavigateBack: () => void;
  onGetPastReceipts?: () => void;
  lastBillingDetails: BillingDetails | GetPlanPricingDetailsResult;
  lastAdditionalSeatsDetails: CostDetailsForTier[];
}
export const UpgradeSuccess = ({
  lastBillingDetails,
  lastAdditionalSeatsDetails,
  onGetPastReceipts,
  onNavigateBack,
}: UpgradeSuccessProps) => {
  const { translate } = useTranslate();
  const [additionalSeatsDetails, setAdditionalSeatsDetails] = useState(
    lastAdditionalSeatsDetails
  );
  const [billingDetails, setBillingDetails] = useState(lastBillingDetails);
  const { additionalSeatsCount } = useBillingSeatDetails({
    billingDetails,
    additionalSeatsDetails,
  });
  const teamBillingInformation = useTeamBillingInformation();
  const failedProvisionings = useModuleQuery(
    teamAdminNotificationsApi,
    "getIdPFailedProvisioningsData"
  );
  const idpDataLoading = failedProvisionings.status === DataStatus.Loading;
  const shouldShowIdPNextStep =
    failedProvisionings.status === DataStatus.Success &&
    !!failedProvisionings.data?.nbOfFailedCreations;
  const backButton = (
    <Button
      mood="neutral"
      intensity="supershy"
      onClick={onNavigateBack}
      layout="iconLeading"
      icon="ArrowLeftOutlined"
    >
      {translate("_common_action_back")}
    </Button>
  );
  const isBusiness = teamBillingInformation?.spaceTier === SpaceTier.Business;
  const setNavBarChildren = useContext(NavBarContext);
  useEffect(() => {
    setNavBarChildren(backButton);
    logPageView(PageView.TacOrderConfirmation);
    return () => {
      setNavBarChildren(null);
      onNavigateBack();
    };
  }, []);
  useEffect(() => {
    setBillingDetails(lastBillingDetails);
    setAdditionalSeatsDetails(lastAdditionalSeatsDetails);
  }, [lastBillingDetails, lastAdditionalSeatsDetails]);
  return (
    <Flex
      flexDirection="column"
      gap="32px"
      sx={{ padding: "32px", flexWrap: "nowrap" }}
    >
      <Flex gap="16px" sx={{ flexWrap: "nowrap" }}>
        <Flex
          flexDirection="column"
          gap="16px"
          sx={{ flexGrow: "2", maxWidth: "632px" }}
        >
          <NewSeatsInfo
            onGetPastReceipts={onGetPastReceipts}
            isBusiness={isBusiness}
            additionalSeats={additionalSeatsCount}
            showInviteUsersButton={
              idpDataLoading ? false : !shouldShowIdPNextStep
            }
            backNavigationHandler={onNavigateBack}
          />
          {isBusiness && !idpDataLoading ? (
            shouldShowIdPNextStep ? (
              <IdPNextStepInfo />
            ) : (
              <FriendsAndFamilyInfo />
            )
          ) : null}
        </Flex>
        <Flex flexDirection="column" gap="16px" sx={{ flexGrow: "1" }}>
          <OrderSummary
            billingDetails={billingDetails}
            additionalSeatsDetails={additionalSeatsDetails}
          />
          <CreditCardSummary />
        </Flex>
      </Flex>
    </Flex>
  );
};
