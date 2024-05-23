import { ReactNode } from 'react';
import { DSStyleObject, Heading, jsx, Paragraph, } from '@dashlane/design-system';
export interface SharedRecipientProps {
    children: ReactNode;
    title?: string;
    description?: string;
    additionalSx?: DSStyleObject;
}
export const ContentCard = ({ title, description, children, additionalSx, }: SharedRecipientProps) => {
    return (<div sx={{
            backgroundColor: 'ds.container.agnostic.neutral.supershy',
            borderRadius: '8px',
            padding: '24px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'ds.border.neutral.quiet.idle',
            ...additionalSx,
        }}>
      {title ? (<Heading as="h3" color="ds.text.neutral.catchy" textStyle="ds.title.block.medium" sx={{ marginBottom: description ? '8px' : '16px' }}>
          {title}
        </Heading>) : null}
      {description ? (<Paragraph textStyle="ds.body.reduced.regular" color="ds.text.neutral.quiet" sx={{ marginBottom: '16px' }}>
          {description}
        </Paragraph>) : null}
      {children}
    </div>);
};
