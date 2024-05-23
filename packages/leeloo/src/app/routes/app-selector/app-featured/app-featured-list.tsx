import { jsx } from '@dashlane/design-system';
import { useRouterGlobalSettingsContext } from 'libs/router';
import { AppFeaturedListItem } from './app-featured-list-item';
export const AppFeaturedList = () => {
    const { routes: { teamRoutesBasePath, userUpsell, clientRoutesBasePath }, } = useRouterGlobalSettingsContext();
    return (<div sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '24px',
        }}>
      <AppFeaturedListItem to={clientRoutesBasePath} app="leeloo" links={[
            { to: 'signup', content: 'Signup form' },
            { to: 'login', content: 'Login form' },
            {
                to: userUpsell,
                content: 'Web Client / go premium',
                extraContent: 'Without this direct link, not accessible from the app unless special account',
            },
        ]}/>
      <AppFeaturedListItem to={teamRoutesBasePath} app="console" links={[
            { to: 'console/signup', content: 'TAC signup form' },
            { to: 'console/login', content: 'TAC login form' },
        ]}/>
    </div>);
};
