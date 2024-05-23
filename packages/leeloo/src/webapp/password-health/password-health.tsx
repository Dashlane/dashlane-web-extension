import { Fragment, useEffect, useMemo } from 'react';
import { Heading, jsx } from '@dashlane/design-system';
import { Alert, AlertSeverity, AlertWrapper, FlexContainer, GridChild, GridContainer, LoadingIcon, } from '@dashlane/ui-components';
import { Lee } from 'lee';
import useTranslate from 'libs/i18n/useTranslate';
import { getCurrentSpaceId } from 'libs/webapp';
import { PasswordHealthScores } from 'webapp/password-health/scores/PasswordHealthScores';
import { TipManager } from 'webapp/password-health/tips/tip-manager/tip-manager';
import { PersonalDataSectionView } from 'webapp/personal-data-section-view/personal-data-section-view';
import { Connected as NotificationsDropdown } from 'webapp/bell-notifications/connected';
import { sendPasswordHealthViewPageLog } from 'webapp/password-health/logs/logs';
import { Header } from 'webapp/components/header/header';
import { HeaderAccountMenu } from 'webapp/components/header/header-account-menu';
import { usePasswordHealthState } from './hooks/use-password-health-state';
import { passwordHealthStyles } from './password-health-styles';
import { PasswordHealthList } from './list/password-health-list';
const I18N_KEYS = {
    PAGE_TITLE: 'webapp_password_health_page_title',
    PAGE_LOADING_ALERT: 'webapp_password_health_page_loading_alert',
};
interface PasswordHealthProps {
    lee: Lee;
}
const endWidget = (<>
    <HeaderAccountMenu />
    <NotificationsDropdown />
  </>);
export const PasswordHealth = ({ lee }: PasswordHealthProps) => {
    const { translate } = useTranslate();
    const spaceId = getCurrentSpaceId(lee.globalState);
    const { counters, isInitialized } = usePasswordHealthState(spaceId);
    const nonExcludedCredentialsCount = useMemo(() => (isInitialized && counters ? counters.total - counters.excluded : 5), [isInitialized, counters]);
    const passwordHealthScore = counters?.score && isInitialized ? counters.score : null;
    const startWidgets = () => (<Heading as="h1" textStyle="ds.title.section.large" color="ds.text.neutral.catchy">
      {translate(I18N_KEYS.PAGE_TITLE)}
    </Heading>);
    useEffect(() => {
        sendPasswordHealthViewPageLog();
    }, []);
    return (<PersonalDataSectionView>
      {!isInitialized ? (<AlertWrapper>
          <Alert severity={AlertSeverity.SUBTLE} showIcon={false}>
            <GridContainer as={'span'} gap={20} gridTemplateColumns={'20px 1fr'} alignItems={'center'} sx={{ paddingRight: '4px' }}>
              <LoadingIcon size={24} color={'ds.text.brand.standard'}/>
              {translate(I18N_KEYS.PAGE_LOADING_ALERT)}
            </GridContainer>
          </Alert>
        </AlertWrapper>) : null}
      <div sx={passwordHealthStyles.rootContainer}>
        <FlexContainer sx={passwordHealthStyles.headerContainer}>
          <Header startWidgets={startWidgets} endWidget={endWidget}/>
        </FlexContainer>
        <GridContainer gridTemplateAreas="'score tips' 'list list'" gridTemplateColumns="1fr auto" sx={passwordHealthStyles.passwordHealthGrid}>
          <GridChild as={FlexContainer} gridArea="score" alignItems="center" justifyContent="center" sx={passwordHealthStyles.passwordHealthScore}>
            <PasswordHealthScores compromisedPasswordCount={counters?.compromised ?? 0} passwordHealthScore={passwordHealthScore} reusedPasswordCount={counters?.reused ?? 0} totalPasswordCount={counters?.total ?? 0} weakPasswordCount={counters?.weak ?? 0}/>
          </GridChild>
          <GridChild as={FlexContainer} gridArea="tips" justifyContent="center" sx={passwordHealthStyles.passwordHealthTips}>
            <TipManager nonExcludedCredentialsCount={nonExcludedCredentialsCount}/>
          </GridChild>
          <GridChild as={GridContainer} gridArea="list" gridTemplateRows="auto 1fr">
            <PasswordHealthList spaceId={spaceId}/>
          </GridChild>
        </GridContainer>
      </div>
    </PersonalDataSectionView>);
};
