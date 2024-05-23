import { PropsWithChildren, ReactNode } from 'react';
import { Heading, jsx } from '@dashlane/design-system';
import { Card } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
interface InfoCardProps {
    supportHeader?: ReactNode;
}
export const InfoCard = ({ supportHeader, children, }: PropsWithChildren<InfoCardProps>) => {
    const { translate } = useTranslate();
    return (<Card sx={{
            display: 'flex',
            gap: '8px',
            flexDirection: 'column',
            padding: '32px 24px',
            background: 'ds.container.agnostic.neutral.supershy',
        }}>
      <Heading as="h2" textStyle="ds.title.supporting.small" color="ds.text.neutral.quiet" sx={{ marginBottom: '8px' }}>
        {supportHeader ?? translate('webapp_tac_infocard_title')}
      </Heading>
      {children}
    </Card>);
};
