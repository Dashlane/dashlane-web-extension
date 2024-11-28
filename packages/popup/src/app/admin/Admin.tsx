import { jsx } from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
import { SX_STYLES } from "./Admin.styles";
import { OpenConsoleModule } from "./modules/OpenConsole";
import { PasswordHealthModule } from "./modules/PasswordHealth";
import { InterviewInfobox } from "./interview/interview-infobox";
import { IdpWarnings } from "./idp-warnings/idp-warnings";
export const I18N_ADMIN_KEYS = {
  TITLE: "tab/admin/title",
};
export const Admin = () => {
  const { translate } = useTranslate();
  return (
    <header
      sx={SX_STYLES.WRAPPER}
      role="heading"
      aria-level={1}
      aria-label={translate(I18N_ADMIN_KEYS.TITLE)}
      tabIndex={-1}
    >
      <IdpWarnings />
      <InterviewInfobox />
      <PasswordHealthModule />
      <OpenConsoleModule />
    </header>
  );
};
