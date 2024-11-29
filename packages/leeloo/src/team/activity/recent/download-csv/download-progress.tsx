import { FiniteLoader, Icon, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
export interface DownloadProgressProps {
  progressPercent: number;
}
export const I18N_KEYS = {
  DOWNLOAD_MODAL_PROGRESS: "team_activity_download_modal_progress",
};
export const DownloadProgress = ({
  progressPercent,
}: DownloadProgressProps) => {
  const { translate } = useTranslate();
  const progress = Math.min(Math.max(progressPercent, 0), 100);
  return (
    <>
      <div
        sx={{
          gap: "8px",
          height: "16px",
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
        }}
      >
        <FiniteLoader percentage={progress} size="small" />
        {progress === 100 ? (
          <Icon
            size="small"
            name="FeedbackSuccessFilled"
            color="ds.text.positive.quiet"
          />
        ) : null}
      </div>
      <Paragraph
        textStyle="ds.body.helper.regular"
        color="ds.text.neutral.quiet"
        sx={{ marginTop: "4px" }}
      >
        {translate(I18N_KEYS.DOWNLOAD_MODAL_PROGRESS, {
          progressPercentage: progress,
        })}
      </Paragraph>
    </>
  );
};
