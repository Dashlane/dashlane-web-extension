import { useMemo, useState } from 'react';
import { useFeatureFlips } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { Button, Icon, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { useRouterGlobalSettingsContext } from 'libs/router';
import { useIsPersonalSpaceDisabled } from 'libs/hooks/use-is-personal-space-disabled';
import { useCollectionsContext } from 'webapp/vault/collections-context';
import { useSideMenuCollapsedContext } from '../side-menu-collapsed-context';
import { SidemenuSection } from '../section';
import { MenuItem } from '../menu-item';
import { MenuTitle } from './menu-title';
import { CollectionMenuItem } from './collection-menu-item';
const PAGE_SIZE = 20;
const PAGING_THRESHOLD = 30;
const I18N_KEYS = {
    SEE_MORE: 'webapp_sidemenu_collections_see_more',
    SHOW_LESS: 'webapp_sidemenu_collections_show_less',
};
const PaginatedMenu = () => {
    const { translate } = useTranslate();
    const [currentPage, setCurrentPage] = useState(1);
    const { allCollections } = useCollectionsContext();
    const isPersonalSpaceDisabledResult = useIsPersonalSpaceDisabled();
    const isPaginationNeeded = allCollections.length >= PAGING_THRESHOLD;
    const currentData = useMemo(() => isPaginationNeeded
        ? allCollections.slice(0, currentPage * PAGE_SIZE)
        : allCollections, [allCollections, currentPage, isPaginationNeeded]);
    if (isPersonalSpaceDisabledResult.status !== DataStatus.Success) {
        return null;
    }
    const loadMore = () => {
        setCurrentPage(currentPage + 1);
    };
    const clear = () => {
        setCurrentPage(1);
    };
    const remaining = allCollections.length - currentData.length;
    return (<SidemenuSection title={<MenuTitle />}>
      {currentData.map((collection) => (<CollectionMenuItem key={`collections_sidemenu_${collection.id}`} collection={collection} isPersonalSpaceDisabled={isPersonalSpaceDisabledResult.isDisabled}/>))}

      {isPaginationNeeded && remaining > 0 && (<Button sx={{ ml: '8px' }} intensity="quiet" onClick={loadMore}>
          {translate(I18N_KEYS.SEE_MORE, {
                count: remaining,
            })}
        </Button>)}
      {isPaginationNeeded && remaining <= 0 && (<Button sx={{ ml: '8px' }} intensity="quiet" onClick={clear}>
          {translate(I18N_KEYS.SHOW_LESS)}
        </Button>)}
    </SidemenuSection>);
};
export const CollectionsMenu = () => {
    const { translate } = useTranslate();
    const { isSideMenuCollapsed } = useSideMenuCollapsedContext();
    const { routes } = useRouterGlobalSettingsContext();
    const featureFlipsStatus = useFeatureFlips();
    if (isSideMenuCollapsed || featureFlipsStatus.status !== DataStatus.Success) {
        return null;
    }
    const isCollectionsPageEnabled = featureFlipsStatus.data[FEATURE_FLIPS_WITHOUT_MODULE.CollectionsPageEnabled];
    if (!isCollectionsPageEnabled) {
        return <PaginatedMenu />;
    }
    return (<SidemenuSection title={<MenuTitle />}>
      <MenuItem icon={() => <Icon name="FolderOutlined"/>} key={'collections_sidemenu_all_collections'} to={routes.userCollections}>
        {translate('collections_overview_title')}
      </MenuItem>
    </SidemenuSection>);
};
