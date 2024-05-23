import React, { FC } from 'react';
import { Website } from 'src/store/types';
import { useActiveTabInfoContext } from '../tabs-bar/active-tab-info-context';
import { CredentialListContainer, IdsListContainer, PaymentsListContainer, PersonalInfoListContainer, SecureNotesListContainer, } from './lists';
import { ListKeyboardNavProvider } from './lists/common';
import { TabName } from '../tabs-bar/tabs-data';
interface IProps {
    website: Website;
}
const ActiveTabList: FC<IProps> = ({ website }) => {
    const { activeTabInfo } = useActiveTabInfoContext();
    const renderActiveTab = () => {
        switch (activeTabInfo.name) {
            case TabName.Payments:
                return <PaymentsListContainer />;
            case TabName.Notes:
                return <SecureNotesListContainer />;
            case TabName.PersonalInfo:
                return <PersonalInfoListContainer />;
            case TabName.Ids:
                return <IdsListContainer />;
            case TabName.Passwords:
            default:
                return <CredentialListContainer website={website}/>;
        }
    };
    return <ListKeyboardNavProvider>{renderActiveTab()}</ListKeyboardNavProvider>;
};
export default ActiveTabList;
