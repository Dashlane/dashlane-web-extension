import { Badge, Button, ButtonMood, Paragraph } from "@dashlane/design-system";
import { TranslatorInterface } from "../../../../libs/i18n/types";
import { Link, useRouterGlobalSettingsContext } from "../../../../libs/router";
import { DataStatus, useFeatureFlips } from "@dashlane/framework-react";
interface Props {
  translate: TranslatorInterface;
  badgeLabel: string;
  badgeMood: ButtonMood;
  supportingDescription: string;
  dateHeader: string;
  withCtaButton?: boolean;
  handleCta: () => void;
}
export const PlanInformationHeader = ({
  translate,
  badgeLabel,
  badgeMood,
  supportingDescription,
  dateHeader,
  withCtaButton = false,
  handleCta,
}: Props) => {
  const { routes } = useRouterGlobalSettingsContext();
  const featureFlipsResult = useFeatureFlips();
  const isPostTrialCheckoutEnabled =
    featureFlipsResult.status === DataStatus.Success &&
    featureFlipsResult.data["monetization_extension_post_trial_checkout"];
  return (
    <div id="HEADER" sx={{ display: "flex", justifyContent: "space-between" }}>
      <div
        className="automation-tests-tac-billing"
        sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div sx={{ display: "flex", gap: "8px" }}>
          <Badge label={badgeLabel} mood={badgeMood} />
          <Paragraph
            textStyle="ds.body.helper.regular"
            color={
              badgeMood === "danger"
                ? "ds.text.danger.standard"
                : "ds.text.neutral.standard"
            }
            sx={{ alignSelf: "center" }}
          >
            {supportingDescription}
          </Paragraph>
        </div>
        <Paragraph
          textStyle="ds.specialty.spotlight.small"
          color={
            badgeMood === "danger"
              ? "ds.text.danger.standard"
              : "ds.text.neutral.standard"
          }
        >
          {dateHeader}
        </Paragraph>
      </div>
      {withCtaButton ? (
        isPostTrialCheckoutEnabled ? (
          <Button
            mood="brand"
            intensity="catchy"
            sx={{ maxHeight: "40px", alignSelf: "center" }}
            as={Link}
            to={routes.teamAccountCheckoutRoutePath}
          >
            {translate("team_dashboard_buy_dashlane_button")}
          </Button>
        ) : (
          <Button
            mood="brand"
            intensity="catchy"
            onClick={handleCta}
            sx={{ maxHeight: "40px", alignSelf: "center" }}
          >
            {translate("team_dashboard_buy_dashlane_button")}
          </Button>
        )
      ) : null}
    </div>
  );
};
