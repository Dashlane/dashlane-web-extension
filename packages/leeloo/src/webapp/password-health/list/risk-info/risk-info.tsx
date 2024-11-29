import { ReactNode } from "react";
import { Flex, Icon } from "@dashlane/design-system";
import { CorruptionDataSeverity } from "@dashlane/password-security-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  ITEM_AT_RISK: "webapp_password_health_item_at_risk",
};
interface RiskInfoProps {
  severity: CorruptionDataSeverity;
  children?: ReactNode;
}
export const RiskInfo = ({ severity, children }: RiskInfoProps) => {
  const { translate } = useTranslate();
  return (
    <Flex
      justifyContent="start"
      alignItems="center"
      flexWrap="nowrap"
      sx={{ maxHeight: "100%" }}
    >
      <div sx={{ marginRight: "10px" }}>
        <Icon
          name="FeedbackWarningOutlined"
          aria-label={translate(I18N_KEYS.ITEM_AT_RISK)}
          size="small"
          color={
            severity === CorruptionDataSeverity.STRONG
              ? "ds.text.danger.standard"
              : "ds.text.warning.standard"
          }
        />
      </div>
      {children}
    </Flex>
  );
};
