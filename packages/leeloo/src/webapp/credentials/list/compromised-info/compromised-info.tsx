import { Icon } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  COMPROMISED_TOOLTIP: "webapp_credentials_row_compromised_tooltip",
};
export interface CompromisedInfoProps {
  compromised: boolean;
}
export const CompromisedInfo = ({ compromised }: CompromisedInfoProps) => {
  const { translate } = useTranslate();
  return compromised ? (
    <div
      sx={{
        marginRight: "48px",
        whiteSpace: "normal",
      }}
    >
      <Icon
        name="FeedbackWarningOutlined"
        size="large"
        color="ds.text.danger.quiet"
        aria-label={translate(I18N_KEYS.COMPROMISED_TOOLTIP)}
        tooltip={translate(I18N_KEYS.COMPROMISED_TOOLTIP)}
      />
    </div>
  ) : null;
};
