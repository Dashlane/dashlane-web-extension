import { FlexContainer, jsx, mergeSx, Paragraph, ThemeUIStyleObject, } from '@dashlane/ui-components';
export interface StorageIndicatorProps {
    additionalText?: string;
    percentage?: number;
    showAdditionalText?: boolean;
    backgroundColor?: string;
    elementId?: string;
    rootStyle?: Record<string, string>;
}
const storageIndicatorBaseStyles: ThemeUIStyleObject = {
    mt: '8px',
    maxWidth: '100%',
};
const storageIndicatorPercentageStyles: ThemeUIStyleObject = {
    display: 'block',
    height: '8px',
    borderRadius: 1,
    transition: 'width 1s ease-out',
};
const storageIndicatorStatusStyleBgMap: Record<number, string> = {
    0: 'successes.4',
    1: 'warnings.4',
    2: 'errors.4',
};
export const StorageIndicator = ({ additionalText, percentage = 0, showAdditionalText, backgroundColor = 'primaries.1', elementId, rootStyle, }: StorageIndicatorProps) => {
    const status = percentage < 90 ? (percentage < 80 ? 0 : 1) : 2;
    const dynamicStyles: ThemeUIStyleObject = {
        width: `${percentage}%`,
        bg: storageIndicatorStatusStyleBgMap[status],
    };
    const rootSx = mergeSx([storageIndicatorBaseStyles]);
    const indicatorSx = mergeSx([
        storageIndicatorPercentageStyles,
        dynamicStyles,
    ]);
    const descriptionId = elementId ? `${elementId}-description` : undefined;
    return (<FlexContainer alignItems="flex-start" flexDirection="column" fullWidth sx={rootSx} style={rootStyle}>
      <FlexContainer flexDirection="row" justifyContent="space-between" fullWidth sx={{
            bg: backgroundColor,
            maxWidth: '100%',
        }}>
        <div sx={{
            position: 'relative',
            width: '100%',
        }}>
          <span aria-describedby={descriptionId} role="graphics-object" sx={indicatorSx}/>
        </div>
      </FlexContainer>
      {showAdditionalText && additionalText ? (<Paragraph sx={{ mt: '4px' }} size="x-small" id={descriptionId}>
          {additionalText}
        </Paragraph>) : null}
    </FlexContainer>);
};
