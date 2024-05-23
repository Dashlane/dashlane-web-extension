import { memo } from 'react';
import { jsx } from '@dashlane/design-system';
import { IdCardIcon } from '../../../active-tab-list/lists/ids-list';
import { openItemInWebapp } from '../../helpers';
import { Header } from '../../common/header';
interface Props {
    name: string;
    id: string;
    onClose: () => void;
}
const IdCardDetailHeaderComponent = ({ name, id, onClose }: Props) => (<Header Icon={<IdCardIcon />} title={name} onEdit={() => {
        void openItemInWebapp(id, '/ids/id-cards');
    }} onClose={onClose}/>);
export const IdCardDetailHeader = memo(IdCardDetailHeaderComponent);
