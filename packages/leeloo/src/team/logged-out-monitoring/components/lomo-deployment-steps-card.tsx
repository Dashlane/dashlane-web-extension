import {
  Badge,
  type DSStyleObject,
  Heading,
  type Mood,
  Paragraph,
} from "@dashlane/design-system";
import { Card } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import { LOMO_STYLES } from "../styles";
const SX_STYLES: Record<string, DSStyleObject> = {
  STEP_SECTION: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
};
const I18N_KEYS = {
  CARD_HEADER: "team_risk_detection_setup_how_to_title",
  BADGE_STEP_1: "team_risk_detection_setup_how_to_step1_badge",
  BADGE_STEP_2: "team_risk_detection_setup_how_to_step2_badge",
  STEP_1_HEADER: "team_risk_detection_setup_how_to_step1_title",
  STEP_2_HEADER: "team_risk_detection_setup_how_to_step2_title",
  STEP_1_DESCRIPTION: "team_risk_detection_setup_how_to_step1_description",
  STEP_2_DESCRIPTION: "team_risk_detection_setup_how_to_step2_description",
};
const VerticalDivider = () => {
  return <div sx={LOMO_STYLES.VERTICAL_DIVIDER} />;
};
interface StepSectionProps {
  badgeLabel: string;
  header: string;
  description: string;
  mood?: Mood;
  intensity?: "quiet" | "catchy";
  withCheck?: boolean;
}
const StepSection = ({
  badgeLabel,
  header,
  description,
  mood = "brand",
  intensity = "quiet",
  withCheck = false,
}: StepSectionProps) => {
  return (
    <div sx={SX_STYLES.STEP_SECTION}>
      <Badge
        label={badgeLabel}
        mood={mood}
        intensity={intensity}
        layout={withCheck ? "iconTrailing" : "labelOnly"}
        iconName={withCheck ? "CheckmarkOutlined" : undefined}
      />
      <Heading
        as="h3"
        textStyle="ds.title.block.small"
        color="ds.text.neutral.standard"
      >
        {header}
      </Heading>
      <Paragraph
        textStyle="ds.body.reduced.regular"
        color="ds.text.neutral.quiet"
      >
        {description}
      </Paragraph>
    </div>
  );
};
interface Props {
  active: boolean;
}
export const LomoDeploymentStepsCard = ({ active }: Props) => {
  const { translate } = useTranslate();
  return (
    <Card sx={LOMO_STYLES.CARD}>
      <Heading
        as="h2"
        textStyle="ds.title.supporting.small"
        color="ds.text.neutral.quiet"
      >
        {translate(I18N_KEYS.CARD_HEADER)}
      </Heading>
      <div sx={{ display: "flex", gap: "16px" }}>
        <StepSection
          mood="brand"
          intensity={active ? "quiet" : "catchy"}
          badgeLabel={translate(I18N_KEYS.BADGE_STEP_1)}
          header={translate(I18N_KEYS.STEP_1_HEADER)}
          description={translate(I18N_KEYS.STEP_1_DESCRIPTION)}
          withCheck={active}
        />
        <VerticalDivider />
        <StepSection
          mood={!active ? "neutral" : "brand"}
          intensity={!active ? "quiet" : "catchy"}
          badgeLabel={translate(I18N_KEYS.BADGE_STEP_2)}
          header={translate(I18N_KEYS.STEP_2_HEADER)}
          description={translate(I18N_KEYS.STEP_2_DESCRIPTION)}
        />
      </div>
    </Card>
  );
};
