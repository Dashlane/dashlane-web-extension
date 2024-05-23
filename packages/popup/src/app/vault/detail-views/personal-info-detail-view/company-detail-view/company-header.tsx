import { memo } from 'react';
import { jsx } from '@dashlane/design-system';
import { CompanyIcon } from '../../../active-tab-list/lists/personal-info-list/companies/company-icon';
import { openItemInWebapp } from '../../helpers';
import { Header } from '../../common/header';
interface Props {
    name: string;
    id: string;
    onClose: () => void;
}
const CompanyDetailHeaderComponent = ({ name, id, onClose }: Props) => (<Header Icon={<CompanyIcon />} title={name} onEdit={() => {
        void openItemInWebapp(id, '/personal-info/companies');
    }} onClose={onClose}/>);
export const CompanyDetailHeader = memo(CompanyDetailHeaderComponent);
