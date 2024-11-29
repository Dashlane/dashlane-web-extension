import {
  Badge,
  IconName,
  IndeterminateLoader,
  Mood,
  Paragraph,
} from "@dashlane/design-system";
export type InsightMetricValue = number | "loading" | "unknown";
interface InsightsMetricProps {
  title: string;
  mood: Mood;
  value: InsightMetricValue;
  highlight?: {
    iconName?: IconName;
    label: string;
  };
}
export const InsightsMetric = ({
  title,
  mood,
  value,
  highlight,
}: InsightsMetricProps) => {
  return (
    <div sx={{ flex: 1 }}>
      {value === "loading" ? (
        <IndeterminateLoader
          data-testid="insight-loader"
          mood={mood}
          size="xlarge"
        />
      ) : (
        <Paragraph
          data-testid="insight-value"
          textStyle="ds.specialty.spotlight.medium"
          color={
            mood === "positive"
              ? "ds.text.brand.standard"
              : `ds.text.${mood}.quiet`
          }
          sx={{ marginBottom: "2px" }}
        >
          {value === "unknown" ? "-" : value}
        </Paragraph>
      )}
      <Paragraph
        textStyle="ds.body.reduced.regular"
        color="ds.text.brand.standard"
      >
        {title}
      </Paragraph>
      {highlight && (
        <Badge
          data-testid="insight-highlight"
          mood={mood}
          intensity="quiet"
          label={highlight.label}
          layout="iconLeading"
          iconName={highlight.iconName}
          sx={{ marginTop: "8px" }}
        />
      )}
    </div>
  );
};
