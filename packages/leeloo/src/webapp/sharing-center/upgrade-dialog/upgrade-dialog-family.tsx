import { useEffect } from "react";
import { Paragraph } from "@dashlane/ui-components";
import { Button } from "@dashlane/design-system";
import { useModuleQuery } from "@dashlane/framework-react";
import { b2cPlansApi } from "@dashlane/plans-contracts";
import {
  CallToAction,
  PageView,
  UserCallToActionEvent,
} from "@dashlane/hermes";
import { DialogContainer } from "./upgrade-dialog-container";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent, logPageView } from "../../../libs/logs/logEvent";
interface UpgradeDialogFamilyProps {
  onClose: () => void;
}
const familyUrl = "__REDACTED__";
export const UpgradeDialogFamily = ({ onClose }: UpgradeDialogFamilyProps) => {
  const { translate } = useTranslate();
  const plansData = useModuleQuery(b2cPlansApi, "getB2CPlanPricing");
  const targetOffer = plansData?.data?.plans?.family?.offers?.find(
    (offer) => offer.billingPeriod.periodicity === "monthly"
  );
  const currency = plansData?.data?.currency;
  const targetPrice = targetOffer?.price;
  useEffect(() => {
    logPageView(PageView.PaywallFamily);
  }, []);
  return (
    <DialogContainer
      header={translate("webapp_sharing_center_family_dialog_header")}
      headerIconName="GroupOutlined"
      onClose={() => {
        logEvent(
          new UserCallToActionEvent({
            callToActionList: [CallToAction.AllOffers],
            hasChosenNoAction: true,
          })
        );
        onClose();
      }}
    >
      <Paragraph
        size="small"
        color="ds.text.neutral.quiet"
        sx={{ marginTop: "16px" }}
      >
        {translate("webapp_sharing_center_family_dialog_copy")}
      </Paragraph>
      <Button
        mood="brand"
        intensity="catchy"
        fullsize
        sx={{ marginTop: "24px" }}
        onClick={() => {
          logEvent(
            new UserCallToActionEvent({
              callToActionList: [CallToAction.AllOffers],
              chosenAction: CallToAction.AllOffers,
              hasChosenNoAction: false,
            })
          );
          window.open(familyUrl, "_blank");
        }}
      >
        {translate("webapp_sharing_center_family_dialog_upgrade_cta")}
      </Button>
      <div
        sx={{
          flexDirection: "column",
          display: "flex",
          marginTop: "8px",
          p: {
            textAlign: "center",
          },
        }}
      >
        {currency && targetPrice ? (
          <>
            <Paragraph size="small" color="ds.text.neutral.standard">
              {translate("webapp_sharing_center_family_dialog_price", {
                pricePerMonth: translate.price(currency, targetPrice / 100),
              })}
            </Paragraph>
            <Paragraph size="small" color="ds.text.neutral.standard">
              {translate("webapp_sharing_center_family_dialog_billed_anually")}
            </Paragraph>
          </>
        ) : null}
      </div>
    </DialogContainer>
  );
};
