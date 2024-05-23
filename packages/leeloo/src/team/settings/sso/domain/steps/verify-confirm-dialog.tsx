import { colors, Dialog, DialogBody, DialogFooter, DialogTitle, GridContainer, jsx, Link, LoadingIcon, Paragraph, PropsOf, } from '@dashlane/ui-components';
import { Fragment, useEffect, useState } from 'react';
import { Domain } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { carbonConnector } from 'libs/carbon/connector';
import { InputWithCopyButton } from 'libs/dashlane-style/text-input-with-action-button/input-with-copy-button';
import { DomainVerificationStep, UserVerifyDomainEvent, } from '@dashlane/hermes';
import { logEvent } from 'libs/logs/logEvent';
const I18N_KEYS = {
    VERIFY_CONFIRM: 'team_settings_domain_verify_confirm',
    VERIFY_TITLE: 'team_settings_domain_verify_title',
    VERIFY_DESCRIPTION: 'team_settings_domain_verify_description_markup',
    VERIFY_HOST: 'team_settings_domain_verify_host',
    VERIFY_HOST_COPY: 'team_settings_domain_verify_host_copy_tag',
    VERIFY_TXT: 'team_settings_domain_verify_txt',
    VERIFY_TXT_COPY: 'team_settings_domain_verify_txt_copy_tag',
    VERIFY_SETUP: 'team_settings_domain_verify_setup',
    VERIFY_LOAD_ERROR: 'team_settings_domain_verify_load_error',
    CLOSE: '_common_dialog_dismiss_button',
};
interface VerifyConfirmDialogProps {
    description?: string | React.ReactNode;
    isDarkWebInsights?: boolean;
    secondaryDescription?: string;
    domainName: string;
    href?: string;
    linkLabel?: string;
    onClick?: () => void;
    onDismiss: () => void;
    onConfirm: () => Promise<unknown>;
}
const DEFAULT_HREF = '*****';
export const VerifyConfirmDialog = ({ description, isDarkWebInsights, secondaryDescription, domainName, href = DEFAULT_HREF, linkLabel, onClick, onDismiss, onConfirm, }: VerifyConfirmDialogProps) => {
    const { translate } = useTranslate();
    const [domain, setDomain] = useState<Domain>({ id: 0, name: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const result = await carbonConnector.getTeamDomains();
                if (result.success) {
                    const toVerify = result.domains.find((v) => v.name === domainName);
                    if (toVerify) {
                        setDomain(toVerify);
                    }
                    else {
                        setError(translate(I18N_KEYS.VERIFY_LOAD_ERROR));
                    }
                }
            }
            catch (e) {
                setError(translate(I18N_KEYS.VERIFY_LOAD_ERROR));
            }
            finally {
                setLoading(false);
            }
        })();
    }, [domainName, translate]);
    const handleVerify = async () => {
        setVerifying(true);
        try {
            await onConfirm();
        }
        catch (e) {
            setError(e.message);
            if (isDarkWebInsights) {
                logEvent(new UserVerifyDomainEvent({
                    domainVerificationStep: DomainVerificationStep.DomainVerificationError,
                }));
            }
        }
        finally {
            setVerifying(false);
            if (isDarkWebInsights) {
                logEvent(new UserVerifyDomainEvent({
                    domainVerificationStep: DomainVerificationStep.TapVerifyDomainCtaWithDnsInformation,
                }));
            }
        }
    };
    const { dnsToken: { computedToken, challengeDomain } = {
        computedToken: '',
        challengeDomain: '',
    }, } = domain;
    const getFieldProps = ({ id, inputValue, labelText, }: {
        id: string;
        inputValue: string;
        labelText: string;
    }): PropsOf<typeof InputWithCopyButton> => ({
        textInputProps: {
            id,
            label: labelText,
            readOnly: true,
            disabled: loading,
            fullWidth: true,
            startAdornment: loading ? (<LoadingIcon color={colors.midGreen00}/>) : undefined,
        },
        iconButtonProps: {
            disabled: loading,
        },
        inputValue,
    });
    return (<Dialog isOpen onClose={onDismiss} closeIconName={translate(I18N_KEYS.CLOSE)}>
      <DialogTitle title={translate(I18N_KEYS.VERIFY_TITLE)}/>
      <DialogBody>
        <GridContainer gap="32px" gridTemplateColumns="1fr" gridAutoRows="auto">
          <Paragraph color={colors.grey00}>
            {description
            ? description
            : translate.markup(I18N_KEYS.VERIFY_DESCRIPTION, {
                domainUrl: domainName,
            })}
          </Paragraph>
          {error ? (<Paragraph color={colors.red00}>{error}</Paragraph>) : (<>
              <InputWithCopyButton {...getFieldProps({
            id: 'hostnameInput',
            labelText: translate(I18N_KEYS.VERIFY_HOST),
            inputValue: challengeDomain,
        })}/>

              <InputWithCopyButton {...getFieldProps({
            id: 'txtValueInput',
            labelText: translate(I18N_KEYS.VERIFY_TXT),
            inputValue: computedToken,
        })}/>
            </>)}
          {secondaryDescription ? (<Paragraph color={colors.grey00}>{secondaryDescription}</Paragraph>) : null}
        </GridContainer>
      </DialogBody>
      <DialogFooter primaryButtonTitle={translate(I18N_KEYS.VERIFY_CONFIRM)} primaryButtonOnClick={handleVerify} primaryButtonProps={{
            disabled: !!error || loading || verifying,
        }} intent="primary">
        <Link sx={{ alignSelf: 'center', mr: 'auto' }} color={colors.midGreen00} target="_blank" rel="noopener noreferrer" href={href} onClick={onClick}>
          {linkLabel ? linkLabel : translate(I18N_KEYS.VERIFY_SETUP)}
        </Link>
      </DialogFooter>
    </Dialog>);
};
