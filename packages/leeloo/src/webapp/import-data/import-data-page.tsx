import { Fragment, useEffect } from 'react';
import { colors, FlexContainer, Heading, jsx } from '@dashlane/ui-components';
import { Redirect } from 'libs/router';
import { Route, Switch, useLocation, useRouteMatch } from 'libs/router/dom';
import useTranslate from 'libs/i18n/useTranslate';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { Connected as NotificationsDropdown } from 'webapp/bell-notifications/connected';
import { HeaderAccountMenu } from 'webapp/components/header/header-account-menu';
import { Header } from 'webapp/components/header/header';
import { UpgradeCard } from 'webapp/import-data/import/upgrade/upgrade-card';
import { ImportDataRoutes } from './routes';
import { ImportPreview } from './preview/import-preview';
import { ImportSummary } from './summary/import-summary';
import { ImportSelect } from './import/import-select';
import { ImportSource } from './import/import-source';
import { SecureImport } from './import/secure-import';
import { ImportPreviewContextProvider } from './hooks/useImportPreviewContext';
import { ImportSpaceSelect } from './import/import-space-select';
import { DirectImport } from './direct-import/direct-import';
const I18N_KEYS = {
    PAGE_TITLE: 'webapp_import_title',
};
export const ImportDataPage = () => {
    const { path } = useRouteMatch();
    const { pathname } = useLocation();
    const { translate } = useTranslate();
    const { openDialog: openTrialDiscontinuedDialog, shouldShowTrialDiscontinuedDialog, } = useTrialDiscontinuedDialogContext();
    const fullWidthPaths = new Set([`${path}/${ImportDataRoutes.ImportPreview}`]);
    useEffect(() => {
        if (shouldShowTrialDiscontinuedDialog) {
            openTrialDiscontinuedDialog();
        }
    }, [shouldShowTrialDiscontinuedDialog]);
    return (<ImportPreviewContextProvider>
      <FlexContainer flexDirection="column" sx={{
            bg: colors.white,
            padding: '16px',
            height: '100%',
            overflowY: 'scroll',
            flexWrap: 'nowrap',
        }}>
        <Header startWidgets={() => (<FlexContainer flexDirection="column">
              <Heading>{translate(I18N_KEYS.PAGE_TITLE)}</Heading>
            </FlexContainer>)} endWidget={<>
              <HeaderAccountMenu />
              <NotificationsDropdown />
            </>}/>
        <hr sx={{
            marginX: '24px',
            border: 'none',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'ds.border.neutral.quiet.idle',
        }}/>
        <FlexContainer flexDirection="row" sx={{ gap: '24px' }}>
          <FlexContainer flexDirection="column" sx={{
            margin: '32px 0 0 32px',
            maxWidth: fullWidthPaths.has(pathname) ? '100%' : '500px',
        }}>
            <Switch>
              <Route exact={true} path={`${path}/${ImportDataRoutes.ImportSource}`} component={ImportSource}/>
              <Route path={`${path}/${ImportDataRoutes.ImportSelect}`} component={ImportSelect}/>
              <Route path={`${path}/${ImportDataRoutes.ImportSpaceSelect}`} component={ImportSpaceSelect}/>
              <Route path={`${path}/${ImportDataRoutes.SecureImport}`} component={SecureImport}/>
              <Route path={`${path}/${ImportDataRoutes.ImportPreview}`} component={ImportPreview}/>
              <Route path={`${path}/${ImportDataRoutes.ImportSummary}`} component={ImportSummary}/>
              <Route path={`${path}/${ImportDataRoutes.DirectImport}/:source`} component={DirectImport}/>
              
              <Redirect exact from="*" to={`${path}/${ImportDataRoutes.ImportSource}`}/>
            </Switch>
          </FlexContainer>
          <UpgradeCard />
        </FlexContainer>
      </FlexContainer>
    </ImportPreviewContextProvider>);
};
