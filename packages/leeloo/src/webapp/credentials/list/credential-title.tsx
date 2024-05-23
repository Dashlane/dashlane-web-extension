import { ReactNode } from 'react';
import { jsx } from '@dashlane/design-system';
import { useModuleQuery } from '@dashlane/framework-react';
import { Credential, vaultItemsCrudApi } from '@dashlane/vault-contracts';
import { ParsedURL } from '@dashlane/url-parser';
import { CredentialInfo } from 'libs/dashlane-style/credential-info/credential-info';
import { CompromisedInfo } from 'webapp/credentials/list/compromised-info/compromised-info';
interface CredentialTitleProps {
    credential: Pick<Credential, 'email' | 'id' | 'itemName' | 'URL' | 'username'>;
    isCompromised: boolean;
    isShared: boolean;
    showTitleIcons?: boolean;
    tag?: ReactNode;
}
export const CredentialTitle = ({ credential, isCompromised, isShared, showTitleIcons, tag, }: CredentialTitleProps) => {
    const { itemName, URL, email, id, username } = credential;
    const { data } = useModuleQuery(vaultItemsCrudApi, 'tempCredentialPreferences', {
        credentialId: id,
    });
    return (<div sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
        }}>
      <CredentialInfo title={itemName} showTitleIcons={showTitleIcons} login={username} email={email} shared={isShared} autoProtected={Boolean(data?.requireMasterPassword)} domain={new ParsedURL(URL).getRootDomain()} tag={tag} sxProps={{
            maxWidth: '350px',
            minWidth: 0,
            marginRight: '8px',
        }}/>
      <div sx={{
            display: 'flex',
            flexGrow: '1',
            justifyContent: 'flex-end',
        }}>
        <CompromisedInfo compromised={isCompromised}/>
      </div>
    </div>);
};
