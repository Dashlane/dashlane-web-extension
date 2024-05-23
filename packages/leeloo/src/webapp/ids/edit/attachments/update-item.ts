import { BaseIdUpdateModel, DataModelDetailView, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
import { Id } from 'webapp/ids/types';
export async function updateItem(updatedItem: DataModelDetailView & BaseIdUpdateModel, type: Id) {
    switch (type) {
        case 'idCards':
            await carbonConnector.editIdCard(updatedItem);
            break;
        case 'driverLicenses':
            await carbonConnector.editDriverLicense(updatedItem);
            break;
        case 'fiscalIds':
            await carbonConnector.editFiscalId(updatedItem);
            break;
        case 'passports':
            await carbonConnector.editPassport(updatedItem);
            break;
        case 'socialSecurityIds':
            await carbonConnector.editSocialSecurityId(updatedItem);
            break;
        default:
            throw new Error(`Unsupported id type ${type}`);
    }
}
