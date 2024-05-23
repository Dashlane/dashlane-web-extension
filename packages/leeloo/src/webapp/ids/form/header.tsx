import React from 'react';
import { colors } from '@dashlane/ui-components';
import { PanelHeader } from 'webapp/panel';
import { IdVaultItemType, ThumbnailSize } from 'webapp/ids/types';
import { IdThumbnail } from 'webapp/ids/content/thumbnails/id-thumbnail';
import { Props as TabProps } from 'libs/dashlane-style/tabs/tab';
interface Props {
    country: string;
    description?: string;
    title: string;
    type: IdVaultItemType;
    tabs?: TabProps[];
}
const RawHeader = ({ country, description, title, type, tabs }: Props) => {
    return (<PanelHeader icon={<IdThumbnail size={ThumbnailSize.Large} country={country} type={type}/>} iconBackgroundColor={colors.dashGreen06} title={title} titleDescription={description?.toUpperCase()} tabs={tabs}/>);
};
export const Header = React.memo(RawHeader);
