import { FC } from 'react';
import { CheckIcon, FlexContainer, jsx, Paragraph, WarningIcon, } from '@dashlane/ui-components';
interface ActionResultProps {
    text: string;
    nature: 'success' | 'failure';
}
export const ActionResult: FC<ActionResultProps> = ({ text, children, nature, }) => {
    const textColor = nature === 'failure' ? 'ds.text.danger.quiet' : 'ds.text.neutral.quiet';
    return (<FlexContainer alignItems="center" sx={{ bottom: 0, right: 0, top: 0, height: '100%', position: 'absolute' }}>
      <span sx={{
            height: '100%',
            width: '40px',
            transform: 'scaleX(-1)',
            background: 'linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%)',
        }}/>
      <FlexContainer alignItems="center" sx={{
            height: '100%',
            paddingLeft: '24px',
            backgroundColor: 'white',
        }}>
        {nature === 'failure' ? (<WarningIcon color="ds.text.danger.quiet"/>) : (<CheckIcon color="ds.text.positive.quiet"/>)}
        <Paragraph size="x-small" as="span" color={textColor}>
          {text}
        </Paragraph>
      </FlexContainer>
      {children}
    </FlexContainer>);
};
