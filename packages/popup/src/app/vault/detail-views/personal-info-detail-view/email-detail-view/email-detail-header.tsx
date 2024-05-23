import React, { memo } from 'react';
import { EmailIcon } from '../../../active-tab-list/lists/personal-info-list/emails/email-icon';
import { openItemInWebapp } from '../../helpers';
import { Header } from '../../common/header';
interface EmailDetailHeaderProps {
    name: string;
    id: string;
    onClose: () => void;
}
const EmailDetailHeaderComponent = ({ name, id, onClose, }: EmailDetailHeaderProps) => (<Header Icon={<EmailIcon />} title={name} onEdit={() => {
        void openItemInWebapp(id, '/personal-info/emails');
    }} onClose={onClose}/>);
export const EmailDetailHeader = memo(EmailDetailHeaderComponent);
