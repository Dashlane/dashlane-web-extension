import { useEffect, useState } from "react";
import { PageView } from "@dashlane/hermes";
import { GridContainer } from "@dashlane/ui-components";
import { logPageView } from "../../../../libs/logs/logEvent";
import { ContactSupportDialog } from "../../../page/support/contact-support-dialog";
import { ResponsiveMainSecondaryLayout } from "../../components/layout/responsive-main-secondary-layout";
import { ContactUsSideContent } from "../../scim-sso-infoboxes/contact-us-side-item-sso-scim-card";
import { PaywallMainContent } from "./paywall-main-content";
interface Props {
  isTrialOrGracePeriod: boolean;
}
export const SSOPaywall = ({ isTrialOrGracePeriod }: Props) => {
  const [supportDialogIsOpen, setSupportDialogIsOpen] = useState(false);
  useEffect(() => {
    logPageView(PageView.TacSsoPaywall);
  }, []);
  const openSupportDialog = () => setSupportDialogIsOpen(true);
  return (
    <>
      <ResponsiveMainSecondaryLayout
        mainContent={
          <GridContainer
            gridTemplateColumns={"auto"}
            gridAutoRows={"min-content"}
            gap={"32px"}
          >
            <PaywallMainContent isTrialOrGracePeriod={isTrialOrGracePeriod} />
          </GridContainer>
        }
        secondaryContent={
          <ContactUsSideContent openContactDialog={openSupportDialog} />
        }
      />
      {supportDialogIsOpen ? (
        <ContactSupportDialog onDismiss={() => setSupportDialogIsOpen(false)} />
      ) : null}
    </>
  );
};
