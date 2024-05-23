import { jsx } from '@dashlane/ui-components';
import { Route, RoutesProps } from 'libs/router';
import { ImportDataPage } from './import-data-page';
export enum ImportDataRoutes {
    ImportRoot = 'import',
    ImportSource = 'source',
    ImportSelect = 'select',
    SecureImport = 'secure-import',
    ImportPreview = 'preview',
    ImportSpaceSelect = 'space-select',
    ImportSummary = 'summary',
    DirectImport = 'direct-import'
}
export const ImportDataRouteWrapper = ({ path }: RoutesProps) => {
    return <Route path={path} component={ImportDataPage}/>;
};
