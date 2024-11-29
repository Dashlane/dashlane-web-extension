import { Tooltip } from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { PropsWithChildren } from "react";
const I18N_KEYS = {
  PENDING_TOOLTIP: "webapp_darkweb_email_pending_tooltip",
};
export const PendingEmailTooltip = ({ children }: PropsWithChildren<{}>) => {
  const { translate } = useTranslate();
  return (
    <Tooltip
      data-testid="Pending verification tooltip"
      placement="bottom"
      content={translate(I18N_KEYS.PENDING_TOOLTIP)}
      sx={{
        fontSize: 3,
        maxWidth: "296px",
      }}
    >
      <div sx={{ width: "min-content" }}>{children}</div>
    </Tooltip>
  );
};
