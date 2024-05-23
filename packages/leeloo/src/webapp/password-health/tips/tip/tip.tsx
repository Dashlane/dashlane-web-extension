import { Fragment } from 'react';
import { Heading, jsx, Paragraph } from '@dashlane/design-system';
import { FlexContainer } from '@dashlane/ui-components';
export type TipProps = {
    title: string;
    message: string;
    action?: JSX.Element;
};
export const Tip = ({ title, message, action }: TipProps) => {
    return (<>
      <Heading as="h5" color="ds.text.neutral.catchy" textStyle="ds.title.block.medium" sx={{ marginBottom: '8px', marginTop: '16px' }}>
        {title}
      </Heading>
      <Paragraph color="ds.text.neutral.standard" textStyle="ds.body.standard.regular">
        {message}
      </Paragraph>
      {action ? (<FlexContainer justifyContent="flex-start" sx={{ marginTop: '28px' }}>
          {action}
        </FlexContainer>) : null}
    </>);
};
