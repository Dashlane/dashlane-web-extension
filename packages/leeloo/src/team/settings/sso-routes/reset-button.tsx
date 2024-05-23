import React, { useState } from 'react';
import { useModuleCommands } from '@dashlane/framework-react';
import { isSuccess } from '@dashlane/framework-types';
import { confidentialSSOApi } from '@dashlane/sso-scim-contracts';
import { Button, Paragraph } from '@dashlane/design-system';
import { GridContainer } from '@dashlane/ui-components';
import { useTeamSpaceContext } from '../components/TeamSpaceContext';
import { MinimalCard } from '../components/layout/minimal-card';
import { I18N_VALUES } from './choose-sso-entrypoint/text-content';
export const ResetButton = () => {
    const [resetLoading, setResetLoading] = useState(false);
    const [doesResetFailed, setDoesResetFailed] = useState(false);
    const { teamId } = useTeamSpaceContext();
    const { clearSettings, initSsoProvisioning } = useModuleCommands(confidentialSSOApi);
    return (<GridContainer as={MinimalCard} backgroundColor="ds.background.default" paddingSize="normal" gridTemplateRows="auto 1fr auto" justifyItems="center">
      <Paragraph color="ds.text.neutral.standard" textStyle="ds.body.standard.regular">
        {I18N_VALUES.RESET_DESCRIPTION}
      </Paragraph>
      <Button layout="iconLeading" tooltip="Reset SSO configuration" aria-label="Reset SSO Button" icon="ActionRefreshOutlined" type={'button'} isLoading={resetLoading} onClick={async () => {
            try {
                setResetLoading(true);
                const clearSettingsResult = await clearSettings();
                if (isSuccess(clearSettingsResult) && teamId) {
                    await initSsoProvisioning({ teamId });
                }
            }
            catch (e) {
                console.error(e);
                setDoesResetFailed(true);
            }
            finally {
                setResetLoading(false);
            }
        }}>
        Reset
      </Button>
      {doesResetFailed ? (<Paragraph color="ds.text.danger.standard" textStyle="ds.body.standard.regular">
          Reset has fail, please check the console
        </Paragraph>) : null}
    </GridContainer>);
};
