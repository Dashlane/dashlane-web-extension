import { memo } from 'react';
import { jsx } from '@dashlane/design-system';
import { SocialSecurityIdIcon } from '../../../active-tab-list/lists/ids-list/social-security-ids-list';
import { openItemInWebapp } from '../../helpers';
import { Header } from '../../common/header';
interface Props {
    name: string;
    id: string;
    onClose: () => void;
}
const SocialSecurityIdDetailHeaderComponent = ({ name, id, onClose, }: Props) => (<Header Icon={<SocialSecurityIdIcon />} title={name} onEdit={() => {
        void openItemInWebapp(id, '/ids/social-security-ids');
    }} onClose={onClose}/>);
export const SocialSecurityIdDetailHeader = memo(SocialSecurityIdDetailHeaderComponent);
