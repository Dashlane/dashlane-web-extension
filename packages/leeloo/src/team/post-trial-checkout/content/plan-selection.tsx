import { useEffect } from "react";
import { Flex } from "@dashlane/design-system";
import { B2BOffers, Offer, SpaceTier } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useLimitedBusinessOfferData } from "../../limited-business-offer/use-limited-business-offer-data";
import { PricingTile } from "../../change-plan/components/pricing-tile";
import { ChangePlanCard } from "../../change-plan/layout/change-plan-card";
import { useTeamTrialStatus } from "../../../libs/hooks/use-team-trial-status";
import { usePlanSelectionData } from "../hooks/use-plan-selection-data";
interface PlansProps {
  currentSpaceTier: SpaceTier;
  handleSelection: (selectedOffer: Offer) => void;
  selectedOffer?: Offer;
  teamOffers: B2BOffers;
  numberOfMembers: number;
}
export const PlanSelection = ({
  currentSpaceTier,
  handleSelection,
  selectedOffer,
  teamOffers,
  numberOfMembers,
}: PlansProps) => {
  const { translate } = useTranslate();
  const teamTrialStatus = useTeamTrialStatus();
  const limitedBusinessOffer = useLimitedBusinessOfferData();
  const data = usePlanSelectionData({
    teamOffers,
    limitedBusinessOffer,
    teamTrialStatus,
    numberOfMembers,
  });
  const { businessOffer, entryLevelOffer } = teamOffers;
  const isStandardTier = currentSpaceTier === SpaceTier.Standard;
  const isBusinessTier = currentSpaceTier === SpaceTier.Business;
  useEffect(() => {
    if (!teamOffers) {
      return;
    }
    if (isBusinessTier) {
      handleSelection(businessOffer);
    }
    if (isStandardTier && entryLevelOffer) {
      handleSelection(entryLevelOffer);
    }
  }, [teamOffers]);
  if (!data) {
    return null;
  }
  const renderPricingTiles = () => {
    if (!data.businessPlus) {
      return null;
    }
    if (!entryLevelOffer || !data.standard) {
      return (
        <>
          <PricingTile
            handleSelectClick={() => handleSelection(businessOffer)}
            plan={data.business}
            selected={
              selectedOffer ? selectedOffer.name === businessOffer.name : false
            }
          />
          <PricingTile plan={data.businessPlus} />
        </>
      );
    }
    return (
      <>
        <PricingTile
          handleSelectClick={() => handleSelection(entryLevelOffer)}
          plan={data.standard}
          selected={
            selectedOffer ? selectedOffer.name === entryLevelOffer.name : false
          }
        />
        <PricingTile
          handleSelectClick={() => handleSelection(businessOffer)}
          plan={data.business}
          selected={
            selectedOffer ? selectedOffer.name === businessOffer.name : false
          }
        />
        <PricingTile plan={data.businessPlus} />
      </>
    );
  };
  return (
    <ChangePlanCard
      headingLevel="h2"
      title={translate("team_post_trial_checkout_plan_selection_title")}
    >
      <Flex
        gap="16px"
        flexWrap="nowrap"
        sx={{
          paddingTop: "16px",
        }}
      >
        {renderPricingTiles()}
      </Flex>
    </ChangePlanCard>
  );
};
