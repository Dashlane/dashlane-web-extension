import React, { MouseEvent } from 'react';
import { Heading, Icon, Paragraph } from '@dashlane/design-system';
import { ShareableCollection } from '@dashlane/sharing-contracts';
import { redirect, useRouterGlobalSettingsContext } from 'libs/router';
import useTranslate from 'libs/i18n/useTranslate';
import { ActionsMenu } from 'webapp/sidemenu/collections-menu/actions-menu';
import { SpaceAndSharingIconsRow } from 'webapp/components/space-and-sharing-icons/space-and-sharing-icons-row';
import { ArticleCard } from './layout/article-card';
import { SpaceBetween } from './layout/space-between';
interface Props {
    collection: ShareableCollection;
}
export const CollectionArticle = ({ collection }: Props) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const onCardClick = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        redirect(routes.userCollection(collection.id));
    };
    return (<ArticleCard onClick={onCardClick}>
      <SpaceBetween>
        <Icon name="FolderOutlined" size="large" color="ds.text.neutral.quiet"/>
        
        <div onClick={(event) => event.stopPropagation()}>
          <ActionsMenu collection={collection}/>
        </div>
      </SpaceBetween>
      <SpaceAndSharingIconsRow isShared={!!collection.isShared} spaceId={collection.spaceId}>
        <Heading as="h3" textStyle="ds.title.block.medium" style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginRight: '6px',
        }}>
          {collection.name}
        </Heading>
      </SpaceAndSharingIconsRow>
      <Paragraph color="ds.text.neutral.quiet" style={{
            fontWeight: '600',
        }}>
        {collection.vaultItems.length}{' '}
        {translate('collections_overview_items_count')}
      </Paragraph>
    </ArticleCard>);
};
