import { Paragraph } from "@dashlane/design-system";
interface ReportSummaryCardProps {
  label: string;
  labelGridArea?: string;
  title: string | number;
  titleGridArea?: string;
}
export const ReportSummaryInfo = ({
  label,
  labelGridArea,
  title,
  titleGridArea,
}: ReportSummaryCardProps) => (
  <>
    <Paragraph
      sx={{ gridArea: labelGridArea }}
      textStyle="ds.specialty.monospace.small"
      color="ds.text.warning.quiet"
    >
      {title}
    </Paragraph>
    <Paragraph color="ds.text.neutral.quiet" sx={{ gridArea: titleGridArea }}>
      {label}
    </Paragraph>
  </>
);
