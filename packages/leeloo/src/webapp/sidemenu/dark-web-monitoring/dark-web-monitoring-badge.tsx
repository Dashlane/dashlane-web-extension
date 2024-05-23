import { jsx } from '@dashlane/design-system';
import { useUnreadBreachesCount } from '../../dark-web-monitoring/hooks/useUnreadBreachesCount';
import { Eyebrow, FlexContainer } from '@dashlane/ui-components';
export const DarkWebMonitoringBadge = () => {
    const { count } = useUnreadBreachesCount();
    if (!count) {
        return null;
    }
    return (<FlexContainer alignItems="center" justifyContent="center" as={Eyebrow} size="small" color="ds.text.inverse.catchy" sx={{
            minWidth: '20px',
            height: '20px',
            backgroundColor: 'ds.container.expressive.danger.catchy.idle',
            borderRadius: '10px',
            fontSize: '10px',
            padding: '0 4px',
        }}>
      {count.toString()}
    </FlexContainer>);
};
