interface ReportSummaryDividerProps {
  gridArea: string;
}
export const ReportSummaryDivider = ({
  gridArea,
}: ReportSummaryDividerProps) => (
  <div
    sx={{
      gridArea,
      backgroundColor: "ds.border.neutral.quiet.idle",
      height: "100%",
      width: "1px",
      alignSelf: "center",
    }}
  />
);
