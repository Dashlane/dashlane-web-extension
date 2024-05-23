import { ReactNode } from 'react';
import { Heading, jsx } from '@dashlane/design-system';
export const AppGroup = ({ children, label, }: {
    children: ReactNode;
    label?: string;
}) => (<div sx={{
        marginBottom: '24px',
        backgroundColor: 'ds.container.agnostic.neutral.supershy',
        padding: '24px',
        borderRadius: '8px',
        border: '1px solid transparent',
        borderColor: 'ds.border.neutral.quiet.idle',
    }}>
    <div sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '4px',
    }}>
      <Heading as="h3" textStyle="ds.title.section.medium" color="ds.text.neutral.catchy" sx={{
        paddingBottom: '16px',
        borderBottom: '1px solid transparent',
        borderBottomColor: 'ds.border.neutral.quiet.idle',
        width: '100%',
    }}>
        {label}
      </Heading>
    </div>
    {children}
  </div>);
export const AppGroupSection = ({ children }: {
    children: ReactNode;
}) => (<div sx={{
        borderBottom: '1px solid transparent',
        borderBottomColor: 'ds.border.neutral.quiet.idle',
        padding: '16px 0',
        display: 'flex',
        gap: '40px',
        flexWrap: 'wrap',
        '&:last-of-type': {
            borderBottomColor: 'transparent',
            paddingBottom: '0',
        },
    }}>
    {children}
  </div>);
