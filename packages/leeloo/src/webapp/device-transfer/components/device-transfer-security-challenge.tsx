import { Fragment, useEffect, useState } from 'react';
import { Button, Dialog, Heading, jsx, Paragraph, TextField, } from '@dashlane/design-system';
import { FlexContainer } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { DeviceTransferContracts } from '@dashlane/authentication-contracts';
import { useModuleCommands } from '@dashlane/framework-react';
const PASSPHRASE_SEPARATOR = ' ';
export const I18N_KEYS = {
    TITLE: 'webapp_device_transfer_page_security_challenge_title',
    DESCRIPTION: 'webapp_device_transfer_page_security_challenge_description_markup',
    INPUT_PLACEHOLDER: 'webapp_device_transfer_page_security_challenge_input_label',
    INVALID_PASSPHRASE: 'webapp_device_transfer_page_security_challenge_invalid_passphrase_error',
    SUBMIT_BUTTON: '_common_action_confirm',
    CANCEL_BUTTON: '_common_action_cancel',
    DIALOG_TITLE: 'webapp_device_transfer_page_security_challenge_cancel_title',
    DIALOG_DESCRIPTION: 'webapp_device_transfer_page_security_challenge_cancel_desc',
    DIALOG_CANCEL_BUTTON: 'webapp_device_transfer_page_security_challenge_cancel_primary',
    DIALOG_DISMISS_BUTTON: 'webapp_device_transfer_page_security_challenge_cancel_secondary',
    CLOSE_DIALOG: '_common_dialog_dismiss_button',
};
type Props = Omit<DeviceTransferContracts.TrustedDeviceFlowDisplayChallengeView, 'step'>;
export const DeviceTransferSecurityChallenge = ({ passphrase, untrustedDeviceName, error, }: Props) => {
    const { translate } = useTranslate();
    const { submitPassphraseChallenge, cancelRequest } = useModuleCommands(DeviceTransferContracts.deviceTransferApi);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [missingWord, setMissingWord] = useState('');
    const [missingWordPosition, setMissingWordPosition] = useState(-1);
    const [passphraseChallengeError, setPassphraseChallengeError] = useState<DeviceTransferContracts.TrustedDeviceFlowErrors | undefined>(undefined);
    const handleSubmitChallenge = () => {
        const passphraseChallengeArray = [...passphrase];
        passphraseChallengeArray[missingWordPosition] = missingWord;
        const passphraseChallenge = passphraseChallengeArray.join(PASSPHRASE_SEPARATOR);
        submitPassphraseChallenge({ passphraseChallenge });
    };
    useEffect(() => {
        if (error) {
            setPassphraseChallengeError(error);
        }
    }, [error]);
    return (<>
      <Heading as="h2" textStyle="ds.title.section.medium" sx={{ marginBottom: '8px' }}>
        {translate(I18N_KEYS.TITLE)}
      </Heading>
      <Paragraph>
        {translate.markup(I18N_KEYS.DESCRIPTION, {
            deviceName: untrustedDeviceName,
        })}
      </Paragraph>
      <FlexContainer sx={{
            flexDirection: 'column',
            gap: '18px',
            bg: 'ds.container.agnostic.neutral.quiet',
            borderRadius: '8px',
            padding: '24px 16px',
            margin: '24px 0',
        }}>
        {passphrase.map((word, wordPosition) => word === '' ? (<TextField key="missing-word" error={Boolean(passphraseChallengeError)} feedback={{
                text: passphraseChallengeError
                    ? translate(I18N_KEYS[passphraseChallengeError])
                    : '',
            }} value={missingWord} label={translate(I18N_KEYS.INPUT_PLACEHOLDER)} onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    handleSubmitChallenge();
                }
            }} onChange={(event) => {
                setPassphraseChallengeError(undefined);
                setMissingWord(event.target.value);
                setMissingWordPosition(wordPosition);
            }}/>) : (<Paragraph key={word} textStyle="ds.body.standard.monospace" style={{ paddingLeft: '12px' }}>
              {word}
            </Paragraph>))}
      </FlexContainer>
      <FlexContainer justifyContent="right">
        <Button mood="neutral" intensity="quiet" sx={{ marginRight: '8px' }} onClick={() => setIsCancelDialogOpen(true)}>
          {translate(I18N_KEYS.CANCEL_BUTTON)}
        </Button>
        <Button onClick={handleSubmitChallenge} disabled={!missingWord}>
          {translate(I18N_KEYS.SUBMIT_BUTTON)}
        </Button>
        <Dialog actions={{
            primary: {
                children: translate(I18N_KEYS.DIALOG_CANCEL_BUTTON),
                onClick: () => cancelRequest(),
            },
            secondary: {
                children: translate(I18N_KEYS.DIALOG_DISMISS_BUTTON),
                onClick: () => setIsCancelDialogOpen(false),
            },
        }} isOpen={isCancelDialogOpen} isDestructive closeActionLabel={I18N_KEYS.CLOSE_DIALOG} onClose={() => setIsCancelDialogOpen(false)} title={translate(I18N_KEYS.DIALOG_TITLE)}>
          <Paragraph>{translate(I18N_KEYS.DIALOG_DESCRIPTION)}</Paragraph>
        </Dialog>
      </FlexContainer>
    </>);
};
