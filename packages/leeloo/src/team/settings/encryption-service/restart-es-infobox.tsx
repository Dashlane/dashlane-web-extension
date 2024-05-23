import { ReactNode, useEffect, useState } from 'react';
import { Button, Infobox, jsx } from '@dashlane/design-system';
import { EncryptionServiceDeploymentLocation } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { useTeamDevice } from '../hooks/useTeamDevice';
import { useEncryptionServiceConfig } from '../hooks/useEncryptionServiceConfig';
export type RestartESContext = 'GENERIC' | 'SSO' | 'SCIM' | 'ES';
type RestartInfoBoxCopy = {
    [key in RestartESContext]: {
        TITLE: string;
        CONTENT: string | ReactNode;
        BUTTON?: string;
    };
};
const restartESGuideUrls: {
    [K in EncryptionServiceDeploymentLocation]: string;
} = {
    AWS: '*****',
    'Microsoft Azure': '*****',
};
interface RestartEncryptionServiceInfoboxProps extends Omit<Parameters<typeof Infobox>[0], 'title'> {
    context?: RestartESContext;
}
export const RestartEncryptionServiceInfobox = ({ context = 'GENERIC', ...infoBoxProps }: RestartEncryptionServiceInfoboxProps) => {
    const { esConfig, esConfigLoading } = useEncryptionServiceConfig();
    const { teamDevice, teamDeviceLoading } = useTeamDevice(esConfig?.deviceAccessKey);
    const [shouldRestartES, setShouldRestartES] = useState(false);
    const { translate } = useTranslate();
    const restartESInfoBoxContent = {
        CONTENT: translate.markup('team_settings_encryption_service_restart_failed_info_content_markup', {
            helpArticle: restartESGuideUrls[esConfig?.deploymentLocation ?? ''] ?? '',
            supportLink: '*****',
        }, {
            linkTarget: '_blank',
        }),
    };
    const RESTART_ES_INFOBOX_COPY: RestartInfoBoxCopy = {
        GENERIC: {
            TITLE: translate('team_settings_encryption_service_restart_failed_info_title'),
            ...restartESInfoBoxContent,
        },
        SCIM: {
            TITLE: translate('team_settings_encryption_service_restart_failed_info_title_scim'),
            ...restartESInfoBoxContent,
        },
        ES: {
            TITLE: translate('team_settings_encryption_service_restart_failed_info_title_es'),
            ...restartESInfoBoxContent,
        },
        SSO: {
            TITLE: translate('team_settings_encryption_service_restart_failed_info_title_sso'),
            ...restartESInfoBoxContent,
        },
    };
    useEffect(() => {
        const isDataLoading = teamDeviceLoading || esConfigLoading;
        if (!isDataLoading && teamDevice && esConfig) {
            const shouldRenderESRestart = (!teamDevice.hasLatestConfig && context === 'GENERIC') ||
                context !== 'GENERIC';
            setShouldRestartES(shouldRenderESRestart);
        }
    }, [teamDevice, esConfig, teamDeviceLoading, esConfigLoading, context]);
    const dismissESRestart = () => {
        setShouldRestartES(false);
    };
    return shouldRestartES ? (<Infobox mood="warning" size="large" title={RESTART_ES_INFOBOX_COPY[context].TITLE} description={RESTART_ES_INFOBOX_COPY[context].CONTENT} actions={RESTART_ES_INFOBOX_COPY[context].BUTTON
            ? [
                <Button mood="brand" intensity="catchy" key="primary" onClick={dismissESRestart}>
                {RESTART_ES_INFOBOX_COPY[context].BUTTON}
              </Button>,
            ]
            : undefined} {...infoBoxProps}/>) : null;
};
