import {
  Button,
  Card,
  Heading,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import { openUrl } from "../../../libs/external-urls";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
const I18N_KEYS = {
  HELP_CARD_HEADER: "team_settings_nudges_help_card_header",
  HELP_CARD_DESCRIPTION: "team_settings_nudges_help_card_header_description",
  HELP_CARD_LINK: "team_settings_nudges_help_card_link",
  FEEDBACK_TITLE: "team_settings_nudges_feedback_title",
  FEEDBACK_DESC: "team_settings_nudges_feedback_description",
  FEEDBACK_CTA: "team_settings_nudges_feedback_cta",
  DASHLANE_INFO: "webapp_tac_infocard_title",
};
const FEEDBACK_URL = "__REDACTED__";
export const NudgesHelpCard = () => {
  const { translate } = useTranslate();
  const sendFeedback = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.SubmitNudgesFeedback,
      })
    );
    openUrl(FEEDBACK_URL);
  };
  return (
    <Card gap="8px">
      <Heading
        as="h2"
        textStyle="ds.title.supporting.small"
        color="ds.text.neutral.quiet"
        sx={{ mb: "16px" }}
      >
        {translate(I18N_KEYS.DASHLANE_INFO)}
      </Heading>

      <Paragraph
        color="ds.text.neutral.catchy"
        textStyle="ds.title.block.medium"
        as="h3"
      >
        {translate(I18N_KEYS.HELP_CARD_HEADER)}
      </Paragraph>
      <Paragraph
        color="ds.text.neutral.quiet"
        textStyle="ds.body.standard.regular"
        sx={{ mb: "16px" }}
      >
        {translate(I18N_KEYS.HELP_CARD_DESCRIPTION)}
      </Paragraph>
      <LinkButton
        onClick={() =>
          logEvent(
            new UserClickEvent({
              button: HermesButton.SeeNudgesSetupGuide,
              clickOrigin: ClickOrigin.NeedHelp,
            })
          )
        }
        href="__REDACTED__"
        isExternal
      >
        {translate(I18N_KEYS.HELP_CARD_LINK)}
      </LinkButton>

      <hr
        sx={{
          border: 0,
          borderTop: "1px solid ds.border.neutral.quiet.idle",
          width: "100%",
        }}
      />

      <Paragraph
        color="ds.text.neutral.catchy"
        textStyle="ds.title.block.medium"
        as="h3"
      >
        {translate(I18N_KEYS.FEEDBACK_TITLE)}
      </Paragraph>
      <Paragraph
        color="ds.text.neutral.quiet"
        textStyle="ds.body.standard.regular"
        sx={{ mb: "16px" }}
      >
        {translate(I18N_KEYS.FEEDBACK_DESC)}
      </Paragraph>
      <Button
        onClick={sendFeedback}
        mood="neutral"
        intensity="quiet"
        layout="labelOnly"
        fullsize
      >
        {translate(I18N_KEYS.FEEDBACK_CTA)}
      </Button>
    </Card>
  );
};
