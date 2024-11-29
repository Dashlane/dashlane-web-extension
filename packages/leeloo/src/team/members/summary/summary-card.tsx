import {
  Button,
  ButtonIntensity,
  ButtonMood,
  DSJSX,
  DSStyleObject,
  IconName,
  IndeterminateLoader,
  Paragraph,
  TextColorToken,
} from "@dashlane/design-system";
const SX_STYLES: Record<string, DSStyleObject> = {
  SUMMARY_CARD: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "16px",
    flex: 1,
  },
  BUTTON_AND_BADGE_AREA: {
    display: "flex",
    flexDirection: "row",
    gap: "16px",
    alignItems: "center",
  },
};
interface SummaryCardProp {
  title: string;
  titleColor?: TextColorToken;
  subtitle: string;
  action: {
    label: string;
    mood?: ButtonMood;
    intensity?: ButtonIntensity;
    icon?: IconName;
    disabled?: boolean;
    onClick: () => void;
  };
  isLoading?: boolean;
  badge?: DSJSX.Element;
}
const SummaryCard = ({
  title,
  titleColor,
  subtitle,
  action,
  isLoading,
  badge,
}: SummaryCardProp) => {
  return (
    <div sx={SX_STYLES.SUMMARY_CARD}>
      {isLoading ? (
        <IndeterminateLoader mood="brand" />
      ) : (
        <Paragraph
          textStyle="ds.specialty.monospace.medium"
          color={titleColor ?? "ds.text.neutral.quiet"}
        >
          {title}
        </Paragraph>
      )}
      <Paragraph
        as="h2"
        textStyle="ds.body.standard.regular"
        color="ds.text.neutral.quiet"
      >
        {subtitle}
      </Paragraph>
      <div sx={SX_STYLES.BUTTON_AND_BADGE_AREA}>
        <Button
          disabled={action.disabled}
          mood={action.mood}
          intensity={action.intensity}
          onClick={action.onClick}
          layout="iconTrailing"
          icon={action.icon}
        >
          {action.label}
        </Button>
        {badge ?? null}
      </div>
    </div>
  );
};
export default SummaryCard;
