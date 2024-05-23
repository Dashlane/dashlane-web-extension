import { jsx } from '@dashlane/design-system';
import { AccountSubPanel } from 'webapp/account/account-subpanel/account-subpanel';
import { ExportCSVData } from 'webapp/account/export-data/export-csv-data/export-csv-data';
import { ExportDashData } from 'webapp/account/export-data/export-dash-data/export-dash-data';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    HEADING: 'webapp_account_import_export_data_heading',
};
export interface Props {
    onNavigateOut: () => void;
    reportError: (error: Error) => void;
}
export const ExportData = ({ onNavigateOut, reportError }: Props) => {
    const { translate } = useTranslate();
    return (<AccountSubPanel headingText={translate(I18N_KEYS.HEADING)} onNavigateOut={onNavigateOut}>
      <hr sx={{
            border: 'none',
            borderTop: '1px solid',
            margin: '0 8px',
            borderColor: 'ds.border.neutral.quiet.idle',
        }}/>
      <ExportDashData reportError={reportError}/>
      <hr sx={{
            border: 'none',
            borderTop: '1px solid',
            margin: '0 8px',
            borderColor: 'ds.border.neutral.quiet.idle',
        }}/>
      <ExportCSVData reportError={reportError}/>
    </AccountSubPanel>);
};
