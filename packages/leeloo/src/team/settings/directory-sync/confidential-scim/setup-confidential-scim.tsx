import { jsx } from '@dashlane/design-system';
import { scimApi } from '@dashlane/sso-scim-contracts';
import { Card, FlexChild, FlexContainer } from '@dashlane/ui-components';
import { useModuleQuery } from '@dashlane/framework-react';
import { GenerateToken } from './generate-token';
import { CopyToken } from './copy-token';
import { ActivateDirectoryScim } from './activate-directory-sync';
export const SetupConfidentialScim = () => {
    const { data: scimConfiguration } = useModuleQuery(scimApi, 'scimConfiguration');
    const { data: scimEndpoint } = useModuleQuery(scimApi, 'scimEndpoint');
    if (!scimConfiguration) {
        return null;
    }
    return (<FlexContainer gap="32px" flexDirection="column" as={Card} sx={{ padding: '32px' }}>
      <FlexChild>
        <GenerateToken isTokenGenerated={!!scimConfiguration?.token}/>
      </FlexChild>
      <FlexChild>
        <CopyToken scimEndpoint={scimEndpoint?.endpoint} scimApiToken={scimConfiguration?.token}/>
      </FlexChild>
      <FlexChild>
        <ActivateDirectoryScim active={scimConfiguration.active}/>
      </FlexChild>
    </FlexContainer>);
};
