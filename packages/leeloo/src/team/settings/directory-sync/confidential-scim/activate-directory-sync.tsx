import { Heading, jsx, Paragraph, Toggle, useToast, } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { GridChild, GridContainer } from '@dashlane/ui-components';
import { scimApi } from '@dashlane/sso-scim-contracts';
import { useModuleCommands } from '@dashlane/framework-react';
import { logEvent } from 'libs/logs/logEvent';
import { ScimSetupStep, UserSetupConfidentialScimEvent, } from '@dashlane/hermes';
import { useEffect, useRef } from 'react';
const I18N_KEYS = {
    HEADER: 'tac_settings_confidential_scim_activate_header',
    HEADER_HELPER: 'tac_settings_confidential_scim_activate_header_helper',
    ACTIVATE_AUTOMATIC_PROVISIONING: 'tac_settings_activate_automatic_provisioning',
    DEACTIVATE_AUTOMATIC_PROVISIONING: 'tac_settings_deactivate_automatic_provisioning',
};
interface ActivateDirectoryScimProps {
    active: boolean;
}
export const ActivateDirectoryScim = ({ active, }: ActivateDirectoryScimProps) => {
    const ref = useRef(false);
    const { translate } = useTranslate();
    const { updateScimConfiguration } = useModuleCommands(scimApi);
    const { showToast } = useToast();
    useEffect(() => {
        if (ref.current === true) {
            showToast({
                description: active
                    ? translate(I18N_KEYS.ACTIVATE_AUTOMATIC_PROVISIONING)
                    : translate(I18N_KEYS.DEACTIVATE_AUTOMATIC_PROVISIONING),
                closeActionLabel: 'close',
            });
        }
        return () => {
            ref.current = true;
        };
    }, [active]);
    return (<GridContainer gridTemplateAreas="'title title' 'description button'">
      <GridChild gridArea="title" as={Heading} innerAs="h2" textStyle="ds.title.section.medium" sx={{ marginBottom: '8px' }}>
        {translate(I18N_KEYS.HEADER)}
      </GridChild>
      <GridChild gridArea="description" as={Paragraph} color="ds.text.neutral.quiet">
        {translate(I18N_KEYS.HEADER_HELPER)}
      </GridChild>
      <GridChild justifySelf="end" gridArea="button" as={Toggle} onChange={() => {
            logEvent(new UserSetupConfidentialScimEvent({
                scimSetupStep: active
                    ? ScimSetupStep.DeactivateDirectorySync
                    : ScimSetupStep.ActivateDirectorySync,
            }));
            updateScimConfiguration({
                active: !active,
            });
        }} checked={active}/>
    </GridContainer>);
};
