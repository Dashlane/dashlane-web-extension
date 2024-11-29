import { Mood, Paragraph } from "@dashlane/design-system";
interface Props {
  title: string;
  mood: Mood;
  score: number | null;
}
export const RiskDetectionMetric = ({ title, mood, score = 0 }: Props) => {
  return (
    <div sx={{ flex: 1 }}>
      <Paragraph
        textStyle="ds.specialty.spotlight.medium"
        color={
          mood === "positive"
            ? "ds.text.brand.standard"
            : `ds.text.${mood}.quiet`
        }
        sx={{ marginBottom: "2px" }}
      >
        {score ?? "-"}
      </Paragraph>
      <Paragraph textStyle="ds.body.reduced.regular">{title}</Paragraph>
    </div>
  );
};
