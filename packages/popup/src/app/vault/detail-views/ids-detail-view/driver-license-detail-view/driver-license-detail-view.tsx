import React, { memo, useEffect } from 'react';
import { PageView } from '@dashlane/hermes';
import { vaultItemsCrudApi, VaultItemType } from '@dashlane/vault-contracts';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { logPageView } from 'src/libs/logs/logEvent';
import { DriverLicenseDetailHeader } from './driver-license-detail-header';
import { DriverLicenseDetailForm } from './driver-license-detail-form';
interface DriverLicenseDetailViewComponentProps {
    onClose: () => void;
    itemId: string;
}
const DriverLicenseDetailViewComponent = ({ onClose, itemId, }: DriverLicenseDetailViewComponentProps) => {
    const { status, data } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.DriversLicense],
        ids: [itemId],
    });
    useEffect(() => {
        logPageView(PageView.ItemDriverLicenceDetails);
    }, []);
    if (status !== DataStatus.Success ||
        !data.driversLicensesResult.items.length) {
        return null;
    }
    const driversLicense = data.driversLicensesResult.items[0];
    return (<>
      <DriverLicenseDetailHeader name={driversLicense.idName} id={driversLicense.id} onClose={onClose}/>
      <DriverLicenseDetailForm driversLicense={driversLicense}/>
    </>);
};
export const DriverLicenseDetailView = memo(DriverLicenseDetailViewComponent);
