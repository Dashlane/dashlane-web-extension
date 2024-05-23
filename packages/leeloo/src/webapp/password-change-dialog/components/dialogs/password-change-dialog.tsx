import { jsx, Paragraph } from '@dashlane/design-system';
import { Fragment, PropsWithChildren, useCallback } from 'react';
import { colors, DialogFooter, FlexContainer, GridChild, GridContainer, OpenWebsiteIcon, } from '@dashlane/ui-components';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'libs/carbon/connector';
import { openUrl } from 'libs/external-urls';
import useTranslate from 'libs/i18n/useTranslate';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
import { NumberBadge } from 'webapp/components/number-badge/number-badge';
import { useCredential } from 'webapp/password-change-dialog/hooks/use-credential';
import { MissingURLDialog } from 'webapp/password-change-dialog/components/dialogs/missing-url-dialog';
import styles from './password-change-dialog.css';
import { OpenWebsiteStep } from '../open-website-step';
const I18N_KEYS = {
    TITLE: 'webapp_change_password_dialog_title',
    SUBTITLE: 'webapp_change_password_dialog_subtitle',
    DISMISS: 'webapp_change_password_dialog_dismiss',
    CONFIRM: 'webapp_change_password_dialog_confirm',
    OPEN_WEBSITE: 'webapp_change_password_dialog_open_website',
    GO_TO_SETTINGS: 'webapp_change_password_dialog_go_to_settings',
    DASHLANE_AUTO_REPLACE: 'webapp_change_password_dialog_dashlane_auto_replace',
};
type DialogStep = {
    name: string;
    content: JSX.Element | string;
};
export interface PasswordChangeManagerProps {
    credentialId: string;
    dismissCallback: () => void;
}
const PasswordChangeDialogStep = ({ rank, content, }: PropsWithChildren<Omit<DialogStep, 'name'> & {
    rank: number;
}>) => {
    return (<GridContainer as="li" gap="16px" gridTemplateColumns="35px 1fr" alignItems="center" justifyContent="flex-start" sx={{
            width: '100%',
        }}>
      <GridChild as={NumberBadge} rank={rank}/>
      {typeof content === 'string' ? (<Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.standard">
          {content}
        </Paragraph>) : (content)}
    </GridContainer>);
};
export const PasswordChangeDialog = ({ credentialId, dismissCallback, }: PasswordChangeManagerProps) => {
    const { translate } = useTranslate();
    const credentialData = useCredential(credentialId);
    const credential = credentialData.status === DataStatus.Success && credentialData.data;
    const onSuccess = useCallback(() => {
        if (credential) {
            openUrl(credential.url);
        }
        dismissCallback();
    }, [credential]);
    if (!credential) {
        return null;
    }
    if (!credential.url) {
        return (<MissingURLDialog credential={credential} onSuccess={async (update: {
                url: string;
            }) => {
                await carbonConnector.updateCredential({
                    id: credential.id,
                    update: {
                        ...update,
                        isUrlSelectedByUser: true,
                    },
                });
            }} onDismiss={dismissCallback}/>);
    }
    const { hostname } = new URL(credential.url);
    const dialogSteps: DialogStep[] = [
        {
            name: 'open-website',
            content: (<OpenWebsiteStep key="open" hostname={hostname} domainIcon={credential.domainIcon} translation={translate(I18N_KEYS.OPEN_WEBSITE, { icon: null })}/>),
        },
        {
            name: 'go-to-settings',
            content: translate(I18N_KEYS.GO_TO_SETTINGS),
        },
        {
            name: 'auto-replace',
            content: translate(I18N_KEYS.DASHLANE_AUTO_REPLACE),
        },
    ];
    return (<SimpleDialog isOpen onRequestClose={dismissCallback} disableBackgroundPanelClose footer={<DialogFooter primaryButtonTitle={<>
              <div className={styles.innerIcon}>
                <OpenWebsiteIcon aria-hidden="true" color={colors.white}/>
              </div>
              {translate(I18N_KEYS.CONFIRM, { domain: hostname })}
            </>} primaryButtonOnClick={onSuccess} secondaryButtonTitle={translate(I18N_KEYS.DISMISS)} secondaryButtonOnClick={dismissCallback} intent="primary"/>} title={translate(I18N_KEYS.TITLE)}>
      <Paragraph color="ds.text.neutral.standard" textStyle="ds.body.standard.regular">
        {translate(I18N_KEYS.SUBTITLE)}
      </Paragraph>
      <div className={styles.container}>
        <FlexContainer as="ol" gap="16px">
          {dialogSteps.map(({ name, content }, index) => (<PasswordChangeDialogStep rank={index + 1} key={name} content={content}/>))}
        </FlexContainer>
      </div>
    </SimpleDialog>);
};
