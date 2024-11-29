import { Button, Card, Heading } from "@dashlane/design-system";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { Tip, TipProps } from "../tip/tip";
const I18N_KEYS = {
  SECTION_TITLE: "webapp_password_health_tips_title",
  AT_RISK_PASSWORD_TITLE: "webapp_password_health_tip_at_risk_password_title",
  AT_RISK_PASSWORD_MESSAGE:
    "webapp_password_health_tip_at_risk_password_message",
  AT_RISK_PASSWORD_TITLE_MIN_COUNT:
    "webapp_password_health_tip_at_risk_password_title_min_score",
  AT_RISK_PASSWORD_MESSAGE_MIN_COUNT:
    "webapp_password_health_tip_at_risk_password_message_min_score",
  AT_RISK_PASSWORD_MESSAGE_BUTTON:
    "webapp_password_health_tip_at_risk_password_message_add_logins_button",
};
const MIN_CRENDENTIALS_COUNT = 5;
interface TipManagerProps {
  nonExcludedCredentialsCount: number;
  isWindowWidthAboveSize?: boolean;
}
enum TipName {
  DEFAULT = "default",
  MINIMUM_CREDENTIALS = "minimumCredentials",
}
export const TipManager = ({
  nonExcludedCredentialsCount,
  isWindowWidthAboveSize = false,
}: TipManagerProps) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const tipsList: Record<TipName, TipProps> = {
    [TipName.DEFAULT]: {
      title: I18N_KEYS.AT_RISK_PASSWORD_TITLE,
      message: I18N_KEYS.AT_RISK_PASSWORD_MESSAGE,
    },
    [TipName.MINIMUM_CREDENTIALS]: {
      title: I18N_KEYS.AT_RISK_PASSWORD_TITLE_MIN_COUNT,
      message: I18N_KEYS.AT_RISK_PASSWORD_MESSAGE_MIN_COUNT,
      action: (
        <Button
          onClick={() => redirect(routes.userCredentials)}
          size="medium"
          mood="brand"
          intensity="catchy"
        >
          {translate(I18N_KEYS.AT_RISK_PASSWORD_MESSAGE_BUTTON)}
        </Button>
      ),
    },
  };
  const activeTip =
    nonExcludedCredentialsCount < MIN_CRENDENTIALS_COUNT
      ? TipName.MINIMUM_CREDENTIALS
      : TipName.DEFAULT;
  return (
    <Card
      sx={{
        paddingBottom: !isWindowWidthAboveSize ? "0px" : undefined,
      }}
    >
      <Heading
        as="h2"
        color="ds.text.neutral.quiet"
        textStyle="ds.title.supporting.small"
      >
        {translate(I18N_KEYS.SECTION_TITLE)}
      </Heading>
      {tipsList[activeTip] ? (
        <Tip
          title={translate(tipsList[activeTip].title)}
          message={translate(tipsList[activeTip].message)}
          action={tipsList[activeTip].action}
        />
      ) : null}
    </Card>
  );
};
