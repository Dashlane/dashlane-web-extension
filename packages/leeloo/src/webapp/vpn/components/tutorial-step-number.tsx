import { colors, Eyebrow, FlexContainer, jsx } from '@dashlane/ui-components';
export interface TutorialStepNumberProps {
    content: number;
    size: number;
}
export const TutorialStepNumber = ({ content, size, }: TutorialStepNumberProps) => {
    return (<FlexContainer as="span" sx={{
            bg: colors.midGreen05,
            borderRadius: '3000px',
            height: size,
            width: size,
            justifyContent: 'center',
            alignContent: 'center',
        }}>
      <Eyebrow size="medium">{content}</Eyebrow>
    </FlexContainer>);
};
