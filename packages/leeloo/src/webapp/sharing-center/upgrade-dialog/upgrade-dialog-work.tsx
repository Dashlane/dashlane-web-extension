import { useEffect } from "react";
import { Paragraph } from "@dashlane/ui-components";
import { Button } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { DialogContainer } from "./upgrade-dialog-container";
import {
  CallToAction,
  PageView,
  UserCallToActionEvent,
} from "@dashlane/hermes";
import { logEvent, logPageView } from "../../../libs/logs/logEvent";
interface UpgradeDialogWorkProps {
  onClose: () => void;
}
const businessUrl = "__REDACTED__";
export const UpgradeDialogWork = ({ onClose }: UpgradeDialogWorkProps) => {
  const { translate } = useTranslate();
  useEffect(() => {
    logPageView(PageView.PaywallB2b);
  }, []);
  return (
    <DialogContainer
      header={translate("webapp_sharing_center_work_dialog_header")}
      headerIconName="ItemCompanyOutlined"
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
        {translate("webapp_sharing_center_work_dialog_copy")}
      </Paragraph>
      <Button
        mood="brand"
        intensity="quiet"
        fullsize
        onClick={() => {
          logEvent(
            new UserCallToActionEvent({
              callToActionList: [CallToAction.AllOffers],
              chosenAction: CallToAction.AllOffers,
              hasChosenNoAction: false,
            })
          );
          window.open(businessUrl, "_blank");
        }}
        sx={{ marginTop: "24px" }}
      >
        {translate("webapp_sharing_center_work_cta_learn_more")}
      </Button>
    </DialogContainer>
  );
};
