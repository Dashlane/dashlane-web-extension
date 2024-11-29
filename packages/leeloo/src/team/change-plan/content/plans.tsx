import { Flex } from "@dashlane/design-system";
import { B2BOffers, Offer, SpaceTier } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useLimitedBusinessOfferData } from "../../limited-business-offer/use-limited-business-offer-data";
import { PricingTile } from "../../change-plan/components/pricing-tile";
import { ChangePlanCard } from "../../change-plan/layout/change-plan-card";
import { BusinessCard } from "../../change-plan/content/business-card";
import { TeamCard } from "../../change-plan/content/team-card";
import { usePlansData } from "../hooks/use-plans-data";
interface PlansProps {
  currentSpaceTier: SpaceTier;
  handleSelection: (selectedOffer: Offer) => void;
  selectedOffer?: Offer;
  teamOffers: B2BOffers;
}
export const Plans = ({
  selectedOffer,
  handleSelection,
  teamOffers,
  currentSpaceTier,
}: PlansProps) => {
  const { translate } = useTranslate();
  const limitedBusinessOffer = useLimitedBusinessOfferData();
  const data = usePlansData(teamOffers, limitedBusinessOffer);
  const showStarter = currentSpaceTier === SpaceTier.Starter;
  const showStandard = currentSpaceTier === SpaceTier.Standard;
  const { businessOffer } = teamOffers;
  const renderStandardPlans = () => (
    <>
      <PricingTile plan={data.standard} />
      {data.standardUpgradeBusiness && (
        <PricingTile
          plan={data.standardUpgradeBusiness}
          handleSelectClick={() => handleSelection(businessOffer)}
          selected={
            selectedOffer ? selectedOffer.name === businessOffer.name : false
          }
        />
      )}
    </>
  );
  const renderStarterPlans = () => (
    <>
      {data.starter && <PricingTile plan={data.starter} />}
      <PricingTile
        plan={data.business}
        handleSelectClick={() => handleSelection(businessOffer)}
        selected={
          selectedOffer ? selectedOffer.name === businessOffer.name : false
        }
      />
    </>
  );
  const renderDefaultPlans = () => (
    <>
      <TeamCard />
      <BusinessCard
        businessOffer={businessOffer}
        selected={
          selectedOffer ? selectedOffer.name === businessOffer.name : false
        }
        handleSelectClick={() => handleSelection(businessOffer)}
      />
    </>
  );
  const renderPlans = () => {
    if (showStandard && data.standardUpgradeBusiness) {
      return renderStandardPlans();
    } else if (showStarter && data.starter) {
      return renderStarterPlans();
    } else {
      return renderDefaultPlans();
    }
  };
  return (
    <ChangePlanCard
      headingLevel="h1"
      title={translate("team_account_teamplan_changeplan_plans")}
    >
      <Flex
        gap="16px"
        flexWrap="nowrap"
        sx={{
          paddingTop: "16px",
        }}
      >
        {renderPlans()}
      </Flex>
    </ChangePlanCard>
  );
};
