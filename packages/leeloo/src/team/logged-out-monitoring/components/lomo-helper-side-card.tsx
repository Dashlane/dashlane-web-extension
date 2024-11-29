import { Badge, LinkButton, mergeSx, Paragraph } from "@dashlane/design-system";
import {
  HelpCenterArticleCta,
  UserOpenHelpCenterEvent,
} from "@dashlane/hermes";
import { Card } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
import { LOMO_STYLES } from "../styles";
import imge from "./risk-monitoring-tips-temporary-illustration.png";
import {
  DASHLANE_RESSOURCES_RISK_DETECTION_ONE_PAGER,
  DASHLANE_RESSOURCES_RISK_DETECTION_PRIVACY_STATEMENT,
  DASHLANE_RISK_DETECTION_PROACTIVE_CREDENTIAL_SECURITY_VIDEO,
  DASHLANE_SUPPORT_RISK_DETECTION_SETUP,
} from "../../urls";
const I18N_KEYS = {
  SECONDARY_CARD_BADGE: "team_risk_detection_presetup_secondary_card_badge",
  USEFUL_LINKS_SECTION_TITLE:
    "team_ace_risk_detection_helper_side_card_useful_links_section_title",
  SETUP_GUIDE_LINK_TEXT:
    "team_ace_risk_detection_helper_side_card_video_walkthrough_link",
  PRIVACY_STATEMENT_LINK_TEXT:
    "team_ace_risk_detection_helper_side_card_privacy_statement_link",
  ONE_PAGER_LINK_TEXT:
    "team_ace_risk_detection_helper_side_card_one_pager_link",
  SETUP_GUIDE_HELP_CENTER_LINK_TEXT:
    "team_ace_risk_detection_helper_side_card_help_center_setup_guide",
};
export const LOMoHelperSideCard = () => {
  const { translate } = useTranslate();
  const handleSeeRiskDetectionSetupGuide = () => {
    logEvent(
      new UserOpenHelpCenterEvent({
        helpCenterArticleCta: HelpCenterArticleCta.SeeRiskDetectionSetupGuide,
      })
    );
  };
  return (
    <>
      <Card sx={mergeSx([LOMO_STYLES.CARD, { gap: "8px" }])}>
        <Badge
          label={translate(I18N_KEYS.SECONDARY_CARD_BADGE)}
          iconName="TipOutlined"
          layout="iconLeading"
          mood="brand"
          sx={{ marginBottom: "8px" }}
        />
        <a
          href={DASHLANE_RISK_DETECTION_PROACTIVE_CREDENTIAL_SECURITY_VIDEO}
          target="_blank"
          rel="noreferrer"
        >
          <img src={imge} alt="" height="142px" />
        </a>
        <LinkButton
          size="small"
          isExternal
          href={DASHLANE_RISK_DETECTION_PROACTIVE_CREDENTIAL_SECURITY_VIDEO}
        >
          {translate(I18N_KEYS.SETUP_GUIDE_LINK_TEXT)}
        </LinkButton>
      </Card>
      <Card sx={mergeSx([LOMO_STYLES.CARD, { gap: "8px" }])}>
        <Paragraph
          textStyle="ds.body.standard.regular"
          sx={{ marginBottom: "8px" }}
        >
          {translate(I18N_KEYS.USEFUL_LINKS_SECTION_TITLE)}
        </Paragraph>
        <LinkButton
          size="small"
          isExternal
          href={DASHLANE_RESSOURCES_RISK_DETECTION_ONE_PAGER}
        >
          {translate(I18N_KEYS.ONE_PAGER_LINK_TEXT)}
        </LinkButton>
        <LinkButton
          size="small"
          isExternal
          href={DASHLANE_SUPPORT_RISK_DETECTION_SETUP}
          onClick={handleSeeRiskDetectionSetupGuide}
        >
          {translate(I18N_KEYS.SETUP_GUIDE_HELP_CENTER_LINK_TEXT)}
        </LinkButton>
        <LinkButton
          size="small"
          isExternal
          href={DASHLANE_RESSOURCES_RISK_DETECTION_PRIVACY_STATEMENT}
        >
          {translate(I18N_KEYS.PRIVACY_STATEMENT_LINK_TEXT)}
        </LinkButton>
      </Card>
    </>
  );
};
