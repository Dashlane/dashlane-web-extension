import { memo } from 'react';
import { jsx } from '@dashlane/design-system';
import { WebsiteIcon } from '../../../active-tab-list/lists/personal-info-list/websites/website-icon';
import { openItemInWebapp } from '../../helpers';
import { Header } from '../../common/header';
interface Props {
    name: string;
    id: string;
    onClose: () => void;
}
const WebsiteDetailHeaderComponent = ({ name, id, onClose }: Props) => (<Header Icon={<WebsiteIcon />} title={name} onEdit={() => {
        void openItemInWebapp(id, '/personal-info/websites');
    }} onClose={onClose}/>);
export const WebsiteDetailHeader = memo(WebsiteDetailHeaderComponent);
