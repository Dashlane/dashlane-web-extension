import * as React from 'react';
import { Link, useHistory } from 'libs/router';
import { BackIcon, Button, colors, FlexContainer, Heading, jsx, LoadingIcon, MailIcon, Paragraph, } from '@dashlane/ui-components';
import { Lee } from 'lee';
import { carbonConnector } from 'libs/carbon/connector';
import useTranslate from 'libs/i18n/useTranslate';
import { LogOutContainer } from 'log-out-container/log-out-container';
import styles from './recovery-request-panel.css';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
export interface Props {
    dispatchGlobal: Lee['dispatchGlobal'];
    setShowGenericRecoveryError: (arg: boolean) => void;
}
const I18N_KEYS = {
    BACK_TO_LOGIN_LABEL: 'webapp_account_recovery_back_to_login',
    RECOVERY_REQUEST_HEADER: 'webapp_account_recovery_request_header',
    RECOVERY_REQUEST_DESCRIPTION: 'webapp_account_recovery_request_description',
    RECOVERY_REQUEST_CONFIRM_LABEL: 'webapp_account_recovery_request_confirm',
    PREVIOUS_STEP: 'webapp_account_recovery_previous_step',
};
export const RecoveryRequestPanel = ({ dispatchGlobal, setShowGenericRecoveryError, }: Props) => {
    const { translate } = useTranslate();
    const history = useHistory();
    const [isLoading, setIsLoading] = React.useState(false);
    const { routes } = useRouterGlobalSettingsContext();
    const handleSendRequest = async () => {
        try {
            setIsLoading(true);
            const result = await carbonConnector.sendRecoveryRequest();
            setIsLoading(false);
            if (!result.success) {
                setShowGenericRecoveryError(true);
                return;
            }
            history.replace(routes.userPendingRequest);
        }
        catch (err) {
            setShowGenericRecoveryError(true);
        }
    };
    const isDisabled = () => {
        return isLoading;
    };
    return (<div className={styles.recoveryRequestPanelContainer}>
      <div className={styles.content}>
        <LogOutContainer dispatchGlobal={dispatchGlobal}/>
        <div className={styles.inner}>
          <div className={styles.iconHolder}>
            <MailIcon color={colors.midGreen00} size={70}/>
          </div>
          <Heading sx={{ marginTop: '32px', marginBottom: '8px' }}>
            {translate(I18N_KEYS.RECOVERY_REQUEST_HEADER)}
          </Heading>
          <Paragraph color={colors.grey00}>
            {translate(I18N_KEYS.RECOVERY_REQUEST_DESCRIPTION)}
          </Paragraph>

          <FlexContainer sx={{ marginTop: '40px' }} justifyContent="space-between">
            <Link className={styles.previousStepContainer} to={routes.userCreateMasterPassword} replace>
              <BackIcon size={14}/>
              <Paragraph sx={{ marginLeft: '10px' }}>
                {translate(I18N_KEYS.PREVIOUS_STEP)}
              </Paragraph>
            </Link>
            <Button type="button" size="large" onClick={handleSendRequest} className={styles.sendButton} disabled={isDisabled()}>
              {isLoading ? (<LoadingIcon />) : (translate(I18N_KEYS.RECOVERY_REQUEST_CONFIRM_LABEL))}
            </Button>
          </FlexContainer>
        </div>
      </div>
    </div>);
};
