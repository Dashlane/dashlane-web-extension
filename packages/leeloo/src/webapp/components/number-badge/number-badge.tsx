import { jsx, Paragraph } from '@dashlane/design-system';
import { FlexContainer } from '@dashlane/ui-components';
export const NumberBadge = ({ rank }: {
    rank: number;
}) => {
    return (<FlexContainer alignItems="center" justifyContent="center" sx={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'ds.container.agnostic.neutral.standard',
        }}>
      <Paragraph textStyle="ds.body.standard.strong" color="ds.text.neutral.standard">
        {rank}
      </Paragraph>
    </FlexContainer>);
};
