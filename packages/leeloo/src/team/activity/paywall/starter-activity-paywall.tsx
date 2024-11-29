import { useState } from "react";
import { GridContainer } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import { ContactSupportDialog } from "../../page/support/contact-support-dialog";
import { ResponsiveMainSecondaryLayout } from "../../settings/components/layout/responsive-main-secondary-layout";
import { ContactUsSideContent } from "../../settings/scim-sso-infoboxes/contact-us-side-item-sso-scim-card";
import { ConsolePage } from "../../page";
import { PaywallContent } from "./paywall-content";
import { Header } from "../header/header";
const I18N_KEYS = {
  TITLE: "team_activity_header_title",
};
export const StarterActivityPaywall = () => {
  const { translate } = useTranslate();
  const [supportDialogIsOpen, setSupportDialogIsOpen] = useState(false);
  const openSupportDialog = () => setSupportDialogIsOpen(true);
  return (
    <ConsolePage header={<Header title={translate(I18N_KEYS.TITLE)} />}>
      <ResponsiveMainSecondaryLayout
        mainContent={
          <GridContainer
            gridTemplateColumns={"auto"}
            gridAutoRows={"min-content"}
          >
            <PaywallContent />
          </GridContainer>
        }
        secondaryContent={
          <ContactUsSideContent openContactDialog={openSupportDialog} />
        }
        sx={{ padding: 0 }}
      />
      {supportDialogIsOpen ? (
        <ContactSupportDialog onDismiss={() => setSupportDialogIsOpen(false)} />
      ) : null}
    </ConsolePage>
  );
};
