import * as React from 'react';
import { Button, CloseIcon, colors, FlexContainer, jsx, Paragraph, } from '@dashlane/ui-components';
interface ChipProps {
    onDismiss?: () => void;
    value: string | React.ReactChildren;
    buttonProps: Record<string, unknown>;
}
export const Chip = ({ onDismiss, value, buttonProps }: ChipProps) => {
    return (<FlexContainer alignItems="center" gap="6px">
      <FlexContainer sx={{
            backgroundColor: colors.midGreen05,
            padding: '4px 8px',
            borderRadius: '4px',
        }}>
        {typeof value === 'string' ? (<Paragraph size="x-small">{value}</Paragraph>) : ({ value })}
      </FlexContainer>
      {onDismiss ? (<Button size="small" type="button" nature="ghost" onClick={onDismiss} sx={{ padding: 0, minWidth: 0 }} {...buttonProps}>
          <CloseIcon size={18}/>
        </Button>) : null}
    </FlexContainer>);
};
