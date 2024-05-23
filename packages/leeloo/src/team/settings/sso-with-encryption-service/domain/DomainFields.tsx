import { Button, CheckCircleIcon, colors, CrossCircleIcon, Eyebrow, FlexContainer, GridContainer, jsx, LoadingIcon, Paragraph, TrashIcon, } from '@dashlane/ui-components';
import { useFeatureFlip } from '@dashlane/framework-react';
import { Fragment, useState } from 'react';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { Domain, DomainStatus, RegisterTeamDomainResultFailure, } from '@dashlane/communication';
import { IconButton } from 'libs/dashlane-style/buttons/IconButton';
import useTranslate from 'libs/i18n/useTranslate';
import { carbonConnector } from 'libs/carbon/connector';
import { DeactivateDomainDialog } from 'team/settings/sso/domain/steps/deactivate-dialog';
import { VerifyDomainDialog } from './VerifyDomainDialog';
import { DomainField } from './DomainField';
import validator from 'validator';
import { JustInTimeProvisioning } from 'team/settings/just-in-time-provisioning/just-in-time-provisioning';
const { accessibleValidatorGreen, orange00, dashGreen02 } = colors;
const I18N_KEYS = {
    DOMAIN_FIELD_LABEL: 'team_settings_domain_title',
    DOMAIN_FIELD_DESCRIPTION: 'team_settings_es_sso_setup_domain_description',
    DOMAIN_FIELD_PLACEHOLDER: 'team_settings_es_sso_domain_url_placeholder',
    VERIFY_DOMAIN_BUTTON: 'team_settings_es_sso_setup_verify_button',
    ADD_DOMAIN_BUTTON: 'team_settings_es_sso_setup_add_domain',
    REGISTER_INVALID: 'team_settings_domain_register_invalid_error',
    REGISTER_DUPLICATED: 'team_settings_domain_register_duplicated_error',
    CONTACT_SUPPORT: 'team_settings_domain_register_contact_support',
    REGISTER_FAILED_IS_PUBLIC_DOMAIN: 'team_settings_domain_register_public_error',
};
export const DomainFields = <T extends string>({ fieldArrayName, domainLoadError, refreshDomains, }: {
    fieldArrayName: T;
    domainLoadError?: string;
    refreshDomains: () => Promise<void>;
}) => {
    const { translate } = useTranslate();
    const { values } = useFormikContext<Record<T, Domain[]>>();
    const [registrationErrors, setRegistrationErrors] = useState<Record<string, string>>({});
    const [domainsUpdating, setDomainsUpdating] = useState<Record<string, boolean>>({});
    const [verifyingDomainName, setVerifyingDomainName] = useState('');
    const [domainRemovalRequested, setDomainRemovalRequested] = useState<Domain | null>(null);
    const isJITProvisioningEnabled = useFeatureFlip('setup_rollout_sso_jit_setting');
    const domainDoneLoading = (url: string) => {
        setDomainsUpdating(({ [url]: unset, ...rest }) => rest);
    };
    const addDomainLoading = (url: string) => {
        setDomainsUpdating((current) => ({
            ...current,
            [url]: true,
        }));
    };
    const addRegistrationError = (url: string, error: string) => {
        setRegistrationErrors((current) => ({
            ...current,
            [url]: error,
        }));
    };
    const addDomain = async (url: string): Promise<void> => {
        const trimmedUrl = url.trim();
        if (!validator.isFQDN(trimmedUrl)) {
            throw new Error(translate(I18N_KEYS.REGISTER_INVALID));
        }
        if (values[fieldArrayName].reduce((previousValue, currentValue) => {
            return currentValue.name === trimmedUrl
                ? previousValue + 1
                : previousValue;
        }, 0) > 1) {
            throw new Error(translate(I18N_KEYS.REGISTER_DUPLICATED));
        }
        addDomainLoading(url);
        const registerResult = await carbonConnector.registerTeamDomain({
            domain: trimmedUrl,
        });
        domainDoneLoading(url);
        if (!registerResult.success) {
            const errorI18nKey: Partial<Record<RegisterTeamDomainResultFailure['error']['code'], string>> = {
                INVALID_PUBLIC_DOMAIN: I18N_KEYS.REGISTER_FAILED_IS_PUBLIC_DOMAIN,
                DOMAIN_CONTAINS_EXISTING_NONTEAM_USERS: I18N_KEYS.CONTACT_SUPPORT,
            };
            throw new Error(translate(errorI18nKey[registerResult.error.code] ?? I18N_KEYS.REGISTER_INVALID));
        }
    };
    const addDomainAndRefresh = async (domain: Domain) => {
        await addDomain(domain.name);
        await refreshDomains();
    };
    const validateDomain = async (domain: Domain) => {
        try {
            if (domain.status === undefined) {
                await addDomainAndRefresh(domain);
            }
            setVerifyingDomainName(domain.name);
        }
        catch (e) {
            addRegistrationError(domain.name, e.message);
        }
    };
    const removeDomain = async (url: string) => {
        if (!url) {
            return;
        }
        const removalResult = await carbonConnector.deactivateTeamDomain({
            domain: url,
        });
        if (removalResult.success) {
            return;
        }
        else {
            return removalResult.error.code;
        }
    };
    if (domainLoadError) {
        return (<FlexContainer fullWidth justifyContent="center">
        <Eyebrow color="errors.4">{domainLoadError}</Eyebrow>
      </FlexContainer>);
    }
    return (<>
      <Paragraph as="label" htmlFor={`${fieldArrayName}.${values[fieldArrayName].length - 1}`} bold sx={{ display: 'inline-block', mb: '8px' }}>
        {translate(I18N_KEYS.DOMAIN_FIELD_LABEL)}
      </Paragraph>
      <Paragraph size="small" sx={{ mb: '24px' }}>
        {translate(I18N_KEYS.DOMAIN_FIELD_DESCRIPTION)}
      </Paragraph>
      <FieldArray name={fieldArrayName}>
        {(arrayHelpers: FieldArrayRenderProps) => (<GridContainer justifyContent="stretch" gridTemplateColumns="auto" gap="8px" gridAutoRows="auto">
            {values[arrayHelpers.name].map((domain: Domain, index: number) => {
                const isUpdating = domainsUpdating[domain.name];
                const isValid = domain.status === DomainStatus.valid;
                const isNotVerified = domain.status === DomainStatus.pending ||
                    domain.status === DomainStatus.invalid ||
                    domain.status === DomainStatus.expired;
                const endIcon = isUpdating ? (<LoadingIcon color="primaries.5" size={20}/>) : isValid ? (<CheckCircleIcon color={accessibleValidatorGreen}/>) : isNotVerified ? (<CrossCircleIcon color={domain.status === DomainStatus.pending
                        ? dashGreen02
                        : orange00}/>) : undefined;
                return (<Fragment key={`${arrayHelpers.name}.${domain.id ?? index}`}>
                  <DomainField placeholder={translate(I18N_KEYS.DOMAIN_FIELD_PLACEHOLDER)} fieldName={`${arrayHelpers.name}.${index}`} readOnly={!!domain.status ?? isUpdating} autoFocus={index === values[arrayHelpers.name].length - 1} endIcon={endIcon} feedbackType={!domain.status && registrationErrors[domain.name]
                        ? 'error'
                        : undefined} feedbackText={!domain.status
                        ? registrationErrors[domain.name]
                        : undefined} handleAdd={async () => {
                        try {
                            await addDomainAndRefresh(domain);
                            setVerifyingDomainName(domain.name);
                        }
                        catch (e) {
                            addRegistrationError(domain.name, e.message);
                        }
                    }} actions={<>
                        {[undefined, DomainStatus.pending].includes(domain.status) ? (<Button nature="secondary" type="button" disabled={isUpdating} onClick={() => validateDomain(domain)}>
                            {translate(domain.status === undefined
                                ? I18N_KEYS.ADD_DOMAIN_BUTTON
                                : I18N_KEYS.VERIFY_DOMAIN_BUTTON)}
                          </Button>) : null}
                        {domain.name.length && domain.status !== undefined ? (<IconButton nature="secondary" type="button" disabled={isUpdating} onClick={() => setDomainRemovalRequested(domain)} icon={<TrashIcon />}/>) : null}
                      </>}/>
                </Fragment>);
            })}
          </GridContainer>)}
      </FieldArray>
      {isJITProvisioningEnabled ? <JustInTimeProvisioning /> : null}
      {verifyingDomainName ? (<VerifyDomainDialog domainName={verifyingDomainName} onSuccess={async () => {
                setVerifyingDomainName('');
                await refreshDomains();
            }} onDismiss={() => setVerifyingDomainName('')}/>) : null}
      {domainRemovalRequested ? (<DeactivateDomainDialog domain={domainRemovalRequested} onDismiss={() => setDomainRemovalRequested(null)} onConfirm={async () => {
                await removeDomain(domainRemovalRequested.name);
                await refreshDomains();
            }}/>) : null}
    </>);
};
