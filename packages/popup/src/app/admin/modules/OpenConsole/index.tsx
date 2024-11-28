import { Button, Icon, jsx, Paragraph } from "@dashlane/design-system";
import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../libs/logs/logEvent";
import { MODULES_SX_STYLES } from "../modules.styles";
import { openTeamConsole } from "../../../more-tools/helpers";
import { SX_STYLES } from "./OpenConsole.styles";
import { I18N_KEYS } from "../../interview/interview-infobox";
export const OpenConsoleModule = () => {
  const { translate } = useTranslate();
  const handleOpenConsole = () => {
    void openTeamConsole();
    void logEvent(
      new UserClickEvent({
        button: HermesButton.OpenAdminConsole,
        clickOrigin: ClickOrigin.AdminTabExtensionInPopup,
      })
    );
  };
  return (
    <div sx={MODULES_SX_STYLES.MODULE} data-testid="open-console-module">
      <Icon
        name="DashboardOutlined"
        size="xlarge"
        color="ds.text.neutral.quiet"
      />
      <Paragraph
        textStyle="ds.title.block.medium"
        as="span"
        sx={SX_STYLES.TITLE}
      >
        {translate(I18N_KEYS.OPEN_CONSOLE_TITLE)}
      </Paragraph>
      <Button size="small" onClick={handleOpenConsole}>
        {translate(I18N_KEYS.OPEN_CONSOLE_CTA)}
      </Button>
    </div>
  );
};
