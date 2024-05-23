import React, { memo, useEffect } from 'react';
import { PageView } from '@dashlane/hermes';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { vaultItemsCrudApi, VaultItemType } from '@dashlane/vault-contracts';
import { logPageView } from 'src/libs/logs/logEvent';
import { PassportDetailHeader } from './passport-header';
import { PassportDetailForm } from './passport-form';
interface Props {
    onClose: () => void;
    itemId: string;
}
const PassportDetailViewComponent = ({ onClose, itemId }: Props) => {
    const { status, data } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Passport],
        ids: [itemId],
    });
    useEffect(() => {
        logPageView(PageView.ItemPassportDetails);
    }, []);
    if (status !== DataStatus.Success || !data.passportsResult.items.length) {
        return null;
    }
    const passport = data.passportsResult.items[0];
    return (<>
      <PassportDetailHeader name={passport.idName} id={passport.id} onClose={onClose}/>
      <PassportDetailForm passport={passport}/>
    </>);
};
export const PassportDetailView = memo(PassportDetailViewComponent);
