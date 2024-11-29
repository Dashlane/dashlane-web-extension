import { useEffect } from "react";
import { Flex, Heading, ThemeUIStyleObject } from "@dashlane/design-system";
import { PageView } from "@dashlane/hermes";
import useTranslate from "../../libs/i18n/useTranslate";
import { logPageView } from "../../libs/logs/logEvent";
import { Lee } from "../../lee";
import { ResponsiveMainSecondaryLayout } from "../settings/components/layout/responsive-main-secondary-layout";
import { PlanInformation } from "./plan-information/plan-information";
import { CompanyInformation } from "./company-information/company-information";
import { useAddSeatsSuccessContext } from "./upgrade-success/upsell-success-context";
import { UpgradeSuccess } from "./upgrade-success";
import { PaymentMethods } from "./billing/payment-method/payment-methods";
import { BillingHistory } from "./billing/billing-history/billing-history";
import { PageSideContentContainer } from "./page-side-content/page-side-content-container";
const SX_ACCOUNT_STYLES: ThemeUIStyleObject = {
  backgroundColor: "ds.background.alternate",
  minHeight: "100%",
  "& > div": {
    maxWidth: "74em",
    padding: "24px",
  },
};
interface Props {
  lee: Lee;
}
const I18N_KEYS = {
  HEADING_TEAM_ACCOUNT_SUMMARY: "team_account_heading_team_setup",
};
const Container = ({ lee }: Props) => {
  return (
    <Flex flexDirection={"column"} gap={"16px"} sx={SX_ACCOUNT_STYLES}>
      <PlanInformation />
      <PaymentMethods />
      <CompanyInformation />
      <BillingHistory lee={lee} />
    </Flex>
  );
};
export const AccountSummary = ({ lee }: Props) => {
  const { isAddSeatsSuccessOpen, upsellDetails, setIsAddSeatsSuccessPageOpen } =
    useAddSeatsSuccessContext();
  const { translate } = useTranslate();
  useEffect(() => {
    logPageView(PageView.TacAccount);
  }, []);
  return !isAddSeatsSuccessOpen ? (
    <>
      <Heading
        textStyle="ds.title.section.large"
        color="ds.text.neutral.catchy"
        as="h1"
        sx={{ height: "50px", padding: "32px 48px" }}
      >
        {translate(I18N_KEYS.HEADING_TEAM_ACCOUNT_SUMMARY)}
      </Heading>
      <ResponsiveMainSecondaryLayout
        mainContent={<Container lee={lee} />}
        secondaryContent={PageSideContentContainer}
        secondaryContentWrapDirection="bottom"
      />
    </>
  ) : upsellDetails.lastAdditionalSeatsDetails &&
    upsellDetails.lastBillingDetails ? (
    <UpgradeSuccess
      lastAdditionalSeatsDetails={upsellDetails.lastAdditionalSeatsDetails}
      lastBillingDetails={upsellDetails.lastBillingDetails}
      onNavigateBack={() => {
        setIsAddSeatsSuccessPageOpen(false);
      }}
    />
  ) : null;
};
