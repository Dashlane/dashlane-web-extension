import { jsx, mergeSx } from '@dashlane/design-system';
import { Header } from './header';
import { AppFeaturedList } from './app-featured/app-featured-list';
import { AppLinkList } from './app-link-list/app-link-list';
import { SX_STYLES } from './styles';
export const AppSelector = () => {
    return (<div sx={{
            minHeight: '100vh',
            backgroundColor: 'ds.background.default',
        }}>
      <Header />
      <div sx={mergeSx([SX_STYLES.CONTAINER, SX_STYLES.CONTENT])}>
        <AppFeaturedList />
        <AppLinkList />
      </div>
    </div>);
};
