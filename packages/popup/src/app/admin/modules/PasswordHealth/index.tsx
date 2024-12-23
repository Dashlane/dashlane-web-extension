import { Button, Paragraph } from "@dashlane/design-system";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import {
  PasswordHealth,
  teamPasswordHealthApi,
} from "@dashlane/team-admin-contracts";
import {
  GridChild,
  GridContainer,
  jsx,
  ThemeUIStyleObject,
} from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../libs/logs/logEvent";
import LoaderIcon from "../../../../components/icons/loader.svg";
import { openTeamConsole } from "../../../more-tools/helpers";
import { ScoreGauge } from "./ScoreGauge";
import { ScoreItem } from "./ScoreItem";
import { MODULES_SX_STYLES } from "../modules.styles";
import { SX_STYLES } from "./PasswordHealth.styles";
const I18N_KEYS = {
  TITLE: "tab/admin/modules/password_health/title",
  TOTAL: "tab/admin/modules/password_health/total",
  COMPROMISED: "tab/admin/modules/password_health/compromised",
  REUSED: "tab/admin/modules/password_health/reused",
  WEAK: "tab/admin/modules/password_health/weak",
  OPEN_CONSOLE_CTA: "tab/admin/modules/open_console/cta_title",
};
const DEFAULT_PASSWORD_HEALTH: PasswordHealth = {
  compromised: 0,
  passwords: 0,
  reused: 0,
  safe: 0,
  securityIndex: 0,
  weak: 0,
};
export const PasswordHealthModule = () => {
  const { translate } = useTranslate();
  const { data, status: queryStatus } = useModuleQuery(
    teamPasswordHealthApi,
    "getReport"
  );
  const sxWrapperStyle: ThemeUIStyleObject = {
    ...MODULES_SX_STYLES.MODULE,
    flexGrow: 0,
  };
  if (queryStatus === DataStatus.Loading) {
    return (
      <div sx={sxWrapperStyle}>
        <LoaderIcon />
      </div>
    );
  }
  const { securityIndex, passwords, compromised, reused, weak } =
    queryStatus === DataStatus.Success
      ? data.passwordHealth
      : DEFAULT_PASSWORD_HEALTH;
  const handleOpenConsole = () => {
    void openTeamConsole();
    void logEvent(
      new UserClickEvent({
        button: HermesButton.OpenPasswordHealthScore,
        clickOrigin: ClickOrigin.AdminTabExtensionInPopup,
      })
    );
  };
  return (
    <div sx={sxWrapperStyle} data-testid="password-health-module">
      <div sx={SX_STYLES.HEADER}>
        <Paragraph textStyle="ds.title.block.medium" as="span">
          {translate(I18N_KEYS.TITLE)}
        </Paragraph>
        <Button
          onClick={handleOpenConsole}
          aria-label={translate(I18N_KEYS.OPEN_CONSOLE_CTA)}
          icon="ActionOpenExternalLinkOutlined"
          layout="iconOnly"
          size="small"
        />
      </div>
      <GridContainer
        justifyContent="start"
        gridTemplateColumns="2fr 3fr"
        gap={"0 12px"}
      >
        <GridChild justifySelf={"start"}>
          <ScoreGauge score={securityIndex} />
        </GridChild>
        <GridChild
          as={GridContainer}
          gridTemplateColumns={"1fr 1fr"}
          gap={"8px 24px"}
          sx={{ alignItems: "center" }}
        >
          <ScoreItem label={translate(I18N_KEYS.TOTAL)} value={passwords} />
          <ScoreItem
            label={translate(I18N_KEYS.COMPROMISED)}
            value={compromised}
          />
          <ScoreItem label={translate(I18N_KEYS.REUSED)} value={reused} />
          <ScoreItem label={translate(I18N_KEYS.WEAK)} value={weak} />
        </GridChild>
      </GridContainer>
    </div>
  );
};
