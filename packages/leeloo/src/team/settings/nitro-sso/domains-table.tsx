import { ChangeEvent, Fragment, useCallback, useEffect, useMemo, useState, } from 'react';
import { Badge, BadgeProps, Button, Heading, Icon, jsx, TextField, } from '@dashlane/design-system';
import { DataStatus, useFeatureFlip, useModuleCommands, useModuleQuery, } from '@dashlane/framework-react';
import { confidentialSSOApi, DomainPendingReason, DomainVerificationStatus, } from '@dashlane/sso-scim-contracts';
import { GridChild, GridContainer } from '@dashlane/ui-components';
import { useTeamSpaceContext } from '../components/TeamSpaceContext';
import { DomainDetailModal } from './domain-detail-modal';
import useTranslate from 'libs/i18n/useTranslate';
import { debounceTime, map, Subject } from 'rxjs';
import { JustInTimeProvisioning } from '../just-in-time-provisioning/just-in-time-provisioning';
const I18N_KEYS = {
    VERIFY_DOMAIN_TITLE: 'sso_confidential_verify_domain_step_title',
    TABLE_HEADER_STATUS: 'sso_confidential_verify_domain_step_table_header_status',
    TABLE_HEADER_DOMAIN: 'sso_confidential_verify_domain_step_table_header_domain',
    SSO_STATUS_ACTIVE: 'sso_confidential_verify_domain_step_sso_status_active',
    SSO_STATUS_VERIFIED: 'sso_confidential_verify_domain_step_sso_status_verified',
    SSO_STATUS_UNVERIFIED: 'sso_confidential_verify_domain_step_sso_status_unverified',
    SSO_STATUS_ERROR: 'sso_confidential_verify_domain_step_sso_status_error',
    DOMAIN_INPUT_LABEL: 'sso_confidential_verify_domain_step_domain_input_label',
    DOMAIN_INPUT_FEEDBACK_SSO_ACTIVE: 'sso_confidential_verify_domain_step_domain_input_feedback_sso_active',
    DOMAIN_INPUT_FEEDBACK_SSO_ERROR_INVALID_TOKEN: 'sso_confidential_verify_domain_step_domain_input_feedback_sso_error_invalid_token',
    DOMAIN_INPUT_FEEDBACK_SSO_ERROR_TOKEN_NOT_FOUND: 'sso_confidential_verify_domain_step_domain_input_feedback_sso_error_token_not_found',
    DOMAIN_INPUT_FEEDBACK_SSO_ERROR_GENERIC: 'sso_confidential_verify_domain_step_domain_input_feedback_sso_error_generic',
    DOMAIN_INPUT_BUTTON_VERIFY: 'sso_confidential_verify_domain_step_domain_input_button_verify',
    DOMAIN_INPUT_BUTTON_VIEW_DETAILS: 'sso_confidential_verify_domain_step_domain_input_button_view_details',
    ADD_DOMAIN_BUTTON_LABEL: 'sso_confidential_verify_domain_step_add_domain_button_label',
    ERROR_DOMAIN_ALREADY_PROVISIONED: 'sso_confidential_verify_domain_error_domain_already_provisioned',
};
const DOMAIN_TABLE_SORTING_SCALE = {
    valid: 3,
    pending: 2,
    expired: 1,
    invalid: 0,
} as const;
type DomainStatusBadgeProps = {
    status: DomainVerificationStatus | null;
    ssoActive?: boolean;
};
type DomainRowProps = {
    domainName: string;
    ssoActive: boolean;
    onModalOpen: () => void;
    onDeleteDomain: () => void;
    onTextInputChange: (newDomainValue: string) => void;
    disabled: boolean;
    duplicate: boolean;
};
const DomainStatusBadge = ({ status, ssoActive }: DomainStatusBadgeProps) => {
    const { translate } = useTranslate();
    let statusLabel: string;
    let mood: BadgeProps['mood'];
    let intensity: BadgeProps['intensity'];
    switch (status) {
        case DomainVerificationStatus.enum.valid:
            statusLabel = ssoActive
                ? translate(I18N_KEYS.SSO_STATUS_ACTIVE)
                : translate(I18N_KEYS.SSO_STATUS_VERIFIED);
            intensity = ssoActive ? 'catchy' : 'quiet';
            mood = 'positive';
            break;
        case DomainVerificationStatus.enum.expired:
        case DomainVerificationStatus.enum.invalid:
            statusLabel = translate(I18N_KEYS.SSO_STATUS_ERROR);
            mood = 'danger';
            intensity = 'quiet';
            break;
        case DomainVerificationStatus.enum.pending:
        default:
            statusLabel = translate(I18N_KEYS.SSO_STATUS_UNVERIFIED);
            intensity = 'quiet';
            mood = 'neutral';
            break;
    }
    return <Badge mood={mood} intensity={intensity} label={statusLabel}/>;
};
const DomainRow = ({ domainName, ssoActive, onModalOpen, onDeleteDomain, onTextInputChange, disabled, duplicate, }: DomainRowProps) => {
    const { translate } = useTranslate();
    const { provisionDomain, deleteDomain } = useModuleCommands(confidentialSSOApi);
    const ssoProvisioningState = useModuleQuery(confidentialSSOApi, 'ssoProvisioning');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const domainUpdate$ = useMemo(() => new Subject<ChangeEvent<HTMLInputElement>>(), []);
    const updateDomain = useCallback(onTextInputChange, [onTextInputChange]);
    const domainVerificationInfo = !duplicate
        ? ssoProvisioningState.data?.domainVerificationInfo[domainName]
        : undefined;
    useEffect(() => {
        domainUpdate$
            .asObservable()
            .pipe(map((event) => {
            return event.currentTarget.value;
        }), debounceTime(200))
            .subscribe((newDomainValue) => {
            if (newDomainValue) {
                updateDomain(newDomainValue);
            }
        });
    }, [domainUpdate$, updateDomain]);
    const provisionDomainClicked = async () => {
        if (!domainVerificationInfo) {
            setIsLoading(true);
            await provisionDomain({ domainName });
            setIsLoading(false);
        }
        onModalOpen();
    };
    const deleteDomainClicked = async () => {
        if (domainVerificationInfo && !duplicate) {
            setIsLoading(true);
            try {
                await deleteDomain({ domainName });
                onDeleteDomain();
            }
            finally {
                setIsLoading(false);
            }
        }
    };
    return (<>
      <GridChild sx={{ display: 'flex', alignItems: 'center' }}>
        <DomainStatusBadge status={domainVerificationInfo?.pendingReason || duplicate
            ? 'invalid'
            : domainVerificationInfo?.verificationStatus ?? null} ssoActive={ssoActive && !duplicate}/>
      </GridChild>
      <GridChild>
        <TextField label={translate(I18N_KEYS.DOMAIN_INPUT_LABEL)} placeholder={translate(I18N_KEYS.DOMAIN_INPUT_LABEL)} labelPersists={false} autoCorrect="off" autoComplete="off" disabled={disabled} hasClearAction={domainVerificationInfo?.verificationStatus !==
            DomainVerificationStatus.enum.valid} readOnly={domainVerificationInfo?.verificationStatus ===
            DomainVerificationStatus.enum.valid} onChange={(event) => domainUpdate$.next(event)} value={domainName} sx={{ width: '400px' }} error={domainVerificationInfo?.verificationStatus ===
            DomainVerificationStatus.enum.invalid ||
            (domainVerificationInfo?.verificationStatus ===
                DomainVerificationStatus.enum.pending &&
                !!domainVerificationInfo?.pendingReason) ||
            duplicate} feedback={duplicate
            ? { text: translate(I18N_KEYS.ERROR_DOMAIN_ALREADY_PROVISIONED) }
            : domainVerificationInfo?.verificationStatus ===
                DomainVerificationStatus.enum.valid && ssoActive
                ? {
                    text: translate(I18N_KEYS.DOMAIN_INPUT_FEEDBACK_SSO_ACTIVE),
                }
                : domainVerificationInfo?.verificationStatus ===
                    DomainVerificationStatus.enum.pending &&
                    domainVerificationInfo?.pendingReason ===
                        DomainPendingReason.enum.invalidToken
                    ? {
                        text: translate(I18N_KEYS.DOMAIN_INPUT_FEEDBACK_SSO_ERROR_INVALID_TOKEN),
                    }
                    : domainVerificationInfo?.verificationStatus ===
                        DomainVerificationStatus.enum.pending &&
                        domainVerificationInfo?.pendingReason ===
                            DomainPendingReason.enum.tokenNotFound
                        ? {
                            text: translate(I18N_KEYS.DOMAIN_INPUT_FEEDBACK_SSO_ERROR_TOKEN_NOT_FOUND),
                        }
                        : domainVerificationInfo?.verificationStatus ===
                            DomainVerificationStatus.enum.invalid
                            ? {
                                text: translate(I18N_KEYS.DOMAIN_INPUT_FEEDBACK_SSO_ERROR_GENERIC),
                            }
                            : undefined}/>
      </GridChild>
      {domainVerificationInfo?.verificationStatus ===
            DomainVerificationStatus.enum.valid &&
            ssoActive &&
            !duplicate ? (<GridChild justifySelf="end" alignSelf="center" gridColumnStart="3" gridColumnEnd="5">
          <Button mood="neutral" intensity="quiet" onClick={onModalOpen} disabled={disabled || duplicate}>
            {translate(I18N_KEYS.DOMAIN_INPUT_BUTTON_VIEW_DETAILS)}
          </Button>
        </GridChild>) : domainVerificationInfo?.verificationStatus ===
            DomainVerificationStatus.enum.valid ? (<GridChild justifySelf="end" alignSelf="center">
          <Button mood="neutral" intensity="quiet" onClick={onModalOpen} disabled={disabled || duplicate}>
            {translate(I18N_KEYS.DOMAIN_INPUT_BUTTON_VIEW_DETAILS)}
          </Button>
        </GridChild>) : (<GridChild justifySelf="end" alignSelf="center">
          <Button mood="brand" intensity="quiet" disabled={!domainName || disabled || duplicate} isLoading={isLoading} onClick={provisionDomainClicked} sx={{ position: 'relative' }}>
            {translate(I18N_KEYS.DOMAIN_INPUT_BUTTON_VERIFY)}
          </Button>
        </GridChild>)}

      {!(domainVerificationInfo?.verificationStatus ===
            DomainVerificationStatus.enum.valid && ssoActive) ? (<GridChild justifySelf="end" alignSelf="center" sx={{ display: 'flex', alignItems: 'center' }}>
          <Button mood="danger" intensity="supershy" layout="iconOnly" icon={<Icon name="ActionDeleteOutlined"/>} isLoading={isLoading} onClick={deleteDomainClicked} sx={{ position: 'relative' }} disabled={disabled}/>
        </GridChild>) : null}
    </>);
};
export const DomainsTable = () => {
    const { translate } = useTranslate();
    const [domains, setDomains] = useState<string[]>([]);
    const [modalDomain, setModalDomain] = useState<string | null>(null);
    const { spaceDetails } = useTeamSpaceContext();
    const ssoProvisioningState = useModuleQuery(confidentialSSOApi, 'ssoProvisioning');
    const isJITProvisioningEnabled = useFeatureFlip('setup_rollout_sso_jit_setting');
    const [, initialDomainValue] = spaceDetails?.associatedEmail.split('@') ?? [
        '',
        '',
    ];
    const addDomainClicked = () => {
        setDomains([...domains, '']);
    };
    const onOpenModal = async (domainIndex: number) => {
        const domain = domains[domainIndex];
        setDomains([...domains]);
        setModalDomain(domain);
    };
    const deleteDomainClicked = async (domainIndex: number) => {
        domains.splice(domainIndex, 1);
        setDomains([...domains]);
    };
    const closeModal = () => {
        setModalDomain(null);
    };
    const onDomainUpdate = (domainIndex: number, newDomainValue: string) => {
        const newDomains = domains.map((domain, i) => i === domainIndex ? newDomainValue : domain);
        setDomains(newDomains);
    };
    const domainVerificationInfo = ssoProvisioningState.data?.domainVerificationInfo;
    const sortDomainRow = useCallback((a: string, b: string) => {
        if (!domainVerificationInfo) {
            return 0;
        }
        const aVerificationDomain = domainVerificationInfo[a];
        const bVerificationDomain = domainVerificationInfo[b];
        if (aVerificationDomain?.verificationStatus === null &&
            bVerificationDomain?.verificationStatus === null) {
            return 0;
        }
        const aScaleValue = aVerificationDomain?.verificationStatus
            ? DOMAIN_TABLE_SORTING_SCALE[aVerificationDomain.verificationStatus]
            : -1;
        const bScaleValue = bVerificationDomain?.verificationStatus
            ? DOMAIN_TABLE_SORTING_SCALE[bVerificationDomain.verificationStatus]
            : -1;
        if (aScaleValue > bScaleValue) {
            return -1;
        }
        else if (bScaleValue > aScaleValue) {
            return 1;
        }
        const lowerCaseA = a.toLowerCase().replace(/ /g, '');
        const lowerCaseB = b.toLowerCase().replace(/ /g, '');
        if (lowerCaseA === lowerCaseB) {
            return 0;
        }
        if (lowerCaseB < lowerCaseA) {
            return lowerCaseB !== '' ? 1 : -1;
        }
        else if (lowerCaseA < lowerCaseB) {
            return lowerCaseA !== '' ? -1 : 1;
        }
        return 0;
    }, [domainVerificationInfo]);
    const ssoActive = ssoProvisioningState.data?.enableSSO.ssoEnabled ?? false;
    const isTeamProvisionedInNitro = ssoProvisioningState.data?.global.isTeamProvisionedInNitro ?? false;
    const isFormReady = isTeamProvisionedInNitro &&
        ssoProvisioningState.data?.idpMetadata.metadataValue;
    useEffect(() => {
        if (ssoProvisioningState.data?.domainVerificationInfo &&
            domains.length === 0) {
            const savedDomains = Object.keys(ssoProvisioningState.data?.domainVerificationInfo ?? {}).sort((a, b) => sortDomainRow(a, b));
            setDomains(savedDomains.length > 0
                ? savedDomains.map((dm) => dm)
                : [initialDomainValue]);
        }
    }, [
        domains.length,
        initialDomainValue,
        ssoProvisioningState.data?.domainVerificationInfo,
        sortDomainRow,
    ]);
    if (ssoProvisioningState.status !== DataStatus.Success) {
        return null;
    }
    const makeDomainRows = () => {
        const alreadyVerifiedDomain = new Set();
        return domains.map((domainItem, domainIndex) => {
            const components = domainVerificationInfo ? (<DomainRow key={domainIndex} domainName={domainItem} ssoActive={ssoActive} onTextInputChange={(newDomainName) => onDomainUpdate(domainIndex, newDomainName)} onModalOpen={() => onOpenModal(domainIndex)} onDeleteDomain={() => deleteDomainClicked(domainIndex)} disabled={!isFormReady} duplicate={alreadyVerifiedDomain.has(domainItem)}/>) : undefined;
            alreadyVerifiedDomain.add(domainItem);
            return components;
        });
    };
    return (<div sx={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Heading as="h3" color="ds.text.neutral.standard" textStyle="ds.title.section.medium">
        {translate(I18N_KEYS.VERIFY_DOMAIN_TITLE)}
      </Heading>
      
      <GridContainer gap="16px 10px" gridTemplateColumns="100px 1fr 126px 40px" sx={{
            '& > *::after': {
                content: '""',
                position: 'absolute',
                borderBottom: '1px solid #8C8F90',
            },
        }}>
        <GridChild sx={{
            '& > ::after': {
                content: '""',
                borderBottom: '1px solid #8C8F90',
            },
        }}>
          <Heading as="h4" color="ds.text.neutral.quiet" textStyle="ds.title.supporting.small">
            {translate(I18N_KEYS.TABLE_HEADER_STATUS)}
          </Heading>
        </GridChild>
        <GridChild gridColumnStart={2} gridColumnEnd={5}>
          <Heading as="h4" color="ds.text.neutral.quiet" textStyle="ds.title.supporting.small">
            {translate(I18N_KEYS.TABLE_HEADER_DOMAIN)}
          </Heading>
        </GridChild>
        {makeDomainRows()}
        <GridChild gridColumnStart={2}>
          <Button mood="brand" intensity="supershy" layout="iconLeading" icon={<Icon name="ActionAddOutlined"/>} size="small" onClick={addDomainClicked} disabled={!isFormReady}>
            {translate(I18N_KEYS.ADD_DOMAIN_BUTTON_LABEL)}
          </Button>
        </GridChild>
      </GridContainer>
      {isJITProvisioningEnabled ? <JustInTimeProvisioning /> : null}
      <DomainDetailModal domainName={modalDomain ?? ''} showModal={modalDomain !== null} onClose={closeModal}/>
    </div>);
};
