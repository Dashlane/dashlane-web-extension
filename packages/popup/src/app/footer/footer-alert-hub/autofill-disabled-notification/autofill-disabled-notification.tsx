import { memo, useEffect, useState } from "react";
import {
  Button,
  jsx,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import {
  DataStatus,
  useFeatureFlips,
  useModuleCommands,
} from "@dashlane/framework-react";
import { autofillNotificationsApi } from "@dashlane/autofill-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { usePremiumStatusData } from "../../../../libs/api";
import { useActiveSectionTabContext } from "../../../tabs/active-section-tab-context";
import { useFooterAlertHubContext } from "../footer-alert-hub-context";
import { getTabNumbers, isAccountBusinessAdmin } from "../../../helpers";
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  CONTAINER: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    backgroundColor: "ds.container.agnostic.neutral.supershy",
    width: "fill",
    height: "24px",
    border: "none",
    borderTop: "1px solid",
    borderTopColor: "ds.border.neutral.quiet.idle",
    "&:hover": {
      cursor: "pointer",
    },
  },
};
const I18N_KEYS = {
  CONTENT: "embed_alert_autofill_disabled_content",
  DISMISS_LABEL: "embed_alert_autofill_disabled_dismiss",
};
export const AutofillDisabledNotificationComponent = () => {
  const { translate } = useTranslate();
  const { setAutofillDisabledOnLoginsAndFormsNotificationStatus } =
    useModuleCommands(autofillNotificationsApi);
  const { setIsFooterAlertHubOpen } = useFooterAlertHubContext();
  const { setActiveTab } = useActiveSectionTabContext();
  const premiumStatusData = usePremiumStatusData();
  const [isDismissed, setIsDismissed] = useState(false);
  const handleDismiss = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    void setAutofillDisabledOnLoginsAndFormsNotificationStatus({
      status: false,
    });
    setIsDismissed(true);
  };
  const premiumStatus =
    premiumStatusData.status === DataStatus.Success
      ? premiumStatusData.data
      : null;
  const isBusinessAdmin = isAccountBusinessAdmin(premiumStatus);
  const tabNumber = getTabNumbers(isBusinessAdmin);
  const handleClick = () => setActiveTab(tabNumber.AUTOFILL);
  useEffect(() => {
    return () => {
      setIsFooterAlertHubOpen(false);
    };
  }, []);
  if (!isDismissed) {
    setIsFooterAlertHubOpen(true);
  }
  if (isDismissed) {
    return null;
  }
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      sx={SX_STYLES.CONTAINER}
    >
      <Paragraph textStyle="ds.body.reduced.regular">
        {translate(I18N_KEYS.CONTENT)}
      </Paragraph>
      <Button
        mood="brand"
        intensity="supershy"
        layout="labelOnly"
        size="small"
        onClick={handleDismiss}
      >
        {translate(I18N_KEYS.DISMISS_LABEL)}
      </Button>
    </div>
  );
};
export const AutofillDisabledNotification = memo(
  AutofillDisabledNotificationComponent
);
