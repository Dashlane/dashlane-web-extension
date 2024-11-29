import { Badge } from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
const I18N_KEY = "webapp_sidemenu_upgrade_page";
export const UpgradeBadge = () => {
  const { translate } = useTranslate();
  return (
    <Badge
      mood="brand"
      intensity="catchy"
      label={translate(I18N_KEY)}
      layout="iconLeading"
      iconName={"PremiumOutlined"}
    />
  );
};
