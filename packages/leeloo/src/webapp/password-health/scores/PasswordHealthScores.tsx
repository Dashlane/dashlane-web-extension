import { GridChild, GridContainer } from "@dashlane/ui-components";
import { Card, Flex, Heading, Icon } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { PasswordHealthScoreItem } from "./PasswordHealthScoreItem";
import { ScoreGauge } from "./score-gauge/ScoreGauge";
const I18N_KEYS = {
  HEADER_TITLE: "webapp_password_health_scores_title",
  TOTAL_LABEL: "webapp_password_health_scores_total_label",
  REUSED_LABEL: "webapp_password_health_scores_reused_label",
  WEAK_LABEL: "webapp_password_health_scores_weak_label",
  COMPROMISED_LABEL: "webapp_password_health_scores_compromised_label",
  SCORE_EXPLANATION_TOOLTIP: "webapp_password_health_scores_explanation",
};
interface PasswordHealthScoresProps {
  reusedPasswordCount: number;
  compromisedPasswordCount: number;
  totalPasswordCount: number;
  weakPasswordCount: number;
  passwordHealthScore: number | null;
}
export const PasswordHealthScores = ({
  compromisedPasswordCount,
  passwordHealthScore,
  reusedPasswordCount,
  totalPasswordCount,
  weakPasswordCount,
}: PasswordHealthScoresProps) => {
  const { translate } = useTranslate();
  const headerTitle = translate(I18N_KEYS.HEADER_TITLE);
  return (
    <Card sx={{ width: "100%" }}>
      <GridContainer
        gap={"8px 24px"}
        justifyContent={"start"}
        gridTemplateColumns={"3fr 2fr 2fr"}
        gridTemplateRows={"32px 20px 64px 64px"}
        gridTemplateAreas={
          "'header header header' 'score . .' 'score scoreInfo scoreInfo' 'score scoreInfo scoreInfo'"
        }
        sx={{
          maxWidth: "712px",
          minWidth: "512px",
          width: "100%",
          marginTop: "-4px",
          marginRight: "auto",
        }}
      >
        <GridChild
          gridArea={"header"}
          alignItems={"center"}
          as={Flex}
          sx={{
            marginTop: "-16px",
          }}
        >
          <Heading
            as="h2"
            textStyle="ds.title.supporting.small"
            color="ds.text.neutral.quiet"
          >
            {headerTitle}
          </Heading>
          <div sx={{ marginLeft: "6px" }}>
            <Icon
              name="FeedbackInfoOutlined"
              size="small"
              color="ds.text.neutral.quiet"
              tooltip={translate(I18N_KEYS.SCORE_EXPLANATION_TOOLTIP)}
              data-testid="phs-explanation-icon"
            />
          </div>
        </GridChild>
        <GridChild gridArea={"score"} justifySelf={"start"}>
          <ScoreGauge score={passwordHealthScore} />
        </GridChild>
        <GridChild
          as={GridContainer}
          gridTemplateColumns={"1fr 1fr"}
          gap={"8px 24px"}
          gridArea={"scoreInfo"}
          data-testid="health-scores"
        >
          <PasswordHealthScoreItem
            label={translate(I18N_KEYS.TOTAL_LABEL)}
            value={totalPasswordCount}
            color="ds.text.brand.standard"
          />
          <PasswordHealthScoreItem
            label={translate(I18N_KEYS.COMPROMISED_LABEL)}
            value={compromisedPasswordCount}
            color="ds.text.danger.quiet"
          />
          <PasswordHealthScoreItem
            label={translate(I18N_KEYS.REUSED_LABEL)}
            value={reusedPasswordCount}
            color="ds.text.warning.quiet"
          />
          <PasswordHealthScoreItem
            label={translate(I18N_KEYS.WEAK_LABEL)}
            value={weakPasswordCount}
            color="ds.text.warning.quiet"
          />
        </GridChild>
      </GridContainer>
    </Card>
  );
};
