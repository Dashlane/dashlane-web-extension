import { Button, colors, GridChild, GridContainer, jsx, Paragraph, Tooltip, TooltipProps, } from '@dashlane/ui-components';
import { TranslationOptions } from 'libs/i18n/types';
import { useTranslateWithMarkup } from 'libs/i18n/useTranslateWithMarkup';
import { PropsWithChildren } from 'react';
interface Props {
    title?: TranslationOptions | string;
    description?: TranslationOptions | string;
    showNotification?: boolean;
    confirmLabel?: TranslationOptions | string;
    cancelLabel?: TranslationOptions | string;
    width?: string;
    showOverflow?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
}
export const MenuItemTooltip = ({ trigger, placement = 'right-start', title, description, confirmLabel, cancelLabel, showOverflow, onConfirm: handleConfirm, onCancel: handleCancel, children, showNotification, width, }: PropsWithChildren<Props & TooltipProps>) => {
    const { translateWithMarkup } = useTranslateWithMarkup();
    return (<Tooltip sx={{
            '&[data-popper-reference-hidden=true]': !showOverflow
                ? {
                    display: 'none',
                }
                : {},
            width: width,
            maxWidth: width,
        }} passThrough={!showNotification || !(title ?? description)} arrowSize={8} placement={placement} trigger={trigger} content={<GridContainer sx={{ p: '8px' }} justifyItems="flex-start">
          {title ? (<Paragraph size="large" sx={{
                    color: colors.white,
                    fontWeight: 'bold',
                    mb: '8px',
                    textAlign: 'start',
                }}>
              {translateWithMarkup(title)}
            </Paragraph>) : null}
          {description ? (<Paragraph size="x-small" sx={{ color: colors.dashGreen04, textAlign: 'start' }}>
              {translateWithMarkup(description)}
            </Paragraph>) : null}
          {(cancelLabel && handleCancel) || (confirmLabel && handleConfirm) ? (<GridChild sx={{ justifySelf: 'end', mt: '16px' }}>
              {cancelLabel ? (<Button size="small" nature="secondary" theme="dark" sx={{ mr: '8px' }} type="button" onClick={handleCancel}>
                  {translateWithMarkup(cancelLabel)}
                </Button>) : null}
              {confirmLabel ? (<Button size="small" type="button" onClick={handleConfirm}>
                  {translateWithMarkup(confirmLabel)}
                </Button>) : null}
            </GridChild>) : null}
        </GridContainer>}>
      {children}
    </Tooltip>);
};
