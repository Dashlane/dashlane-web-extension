import { colors, FlexContainer, jsx, mergeSx, Paragraph, ThemeUIStyleObject, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
export interface DownloadProgressProps {
    progressPercent: number;
}
export const I18N_KEYS = {
    DOWNLOAD_MODAL_PROGRESS: 'team_activity_download_modal_progress',
};
const progressBarStyles: ThemeUIStyleObject = {
    display: 'block',
    height: '4px',
    borderRadius: 1,
    transition: 'width 1s ease-out',
    bg: 'successes.4',
};
export const DownloadProgress = ({ progressPercent, }: DownloadProgressProps) => {
    const { translate } = useTranslate();
    const progress = Math.min(Math.max(progressPercent, 0), 100);
    const dynamicStyles: ThemeUIStyleObject = {
        width: `${progress}%`,
    };
    const sx = mergeSx([progressBarStyles, dynamicStyles]);
    const descriptionId = 'download-progress-description';
    return (<FlexContainer alignItems="flex-start" flexDirection="column" fullWidth sx={{
            mt: '8px',
            maxWidth: '100%',
        }}>
      <FlexContainer flexDirection="row" justifyContent="space-between" fullWidth sx={{
            bg: 'primaries.1',
            maxWidth: '100%',
        }}>
        <div sx={{
            position: 'relative',
            width: '100%',
        }}>
          <span aria-describedby={descriptionId} data-testid="download-progress-bar" role="img" sx={sx}/>
        </div>
      </FlexContainer>
      <Paragraph sx={{ mt: '4px', color: colors.dashGreen01 }} size="x-small" id={descriptionId}>
        {translate(I18N_KEYS.DOWNLOAD_MODAL_PROGRESS, {
            progressPercentage: progress,
        })}
      </Paragraph>
    </FlexContainer>);
};
