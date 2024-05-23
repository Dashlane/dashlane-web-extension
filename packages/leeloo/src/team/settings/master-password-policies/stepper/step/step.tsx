import { jsx } from '@dashlane/design-system';
import { FlexContainer, Heading, Paragraph } from '@dashlane/ui-components';
export interface Props {
    content: string;
    header: string;
    index: number;
}
export const Step = ({ content, header, index }: Props) => {
    return (<FlexContainer gap="8px" sx={{ flexFlow: 'row', flexBasis: '25%' }}>
      <FlexContainer justifyContent="center" alignItems="center" sx={{
            width: 36,
            height: 36,
            borderRadius: 36,
            flexShrink: 0,
            backgroundColor: 'ds.container.expressive.brand.quiet.idle',
            color: 'ds.text.brand.standard',
        }}>
        {index}
      </FlexContainer>
      <section>
        <Heading sx={{
            fontSize: 16,
            fontFamily: 'Public Sans, PublicSans-Regular, Public Sans Regular',
            fontWeight: 400,
            marginBottom: '8px',
        }}>
          {header}
        </Heading>
        <Paragraph sx={{
            fontSize: 12,
            lineHeight: '16px',
            color: 'ds.text.neutral.quiet',
        }}>
          {content}
        </Paragraph>
      </section>
    </FlexContainer>);
};
