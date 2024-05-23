import { MAIL_TO_SUPPORT_GDPR_ACCESS, MAIL_TO_SUPPORT_GDPR_COMPLAINT, MAIL_TO_SUPPORT_GDPR_DATA_PORTABILITY, MAIL_TO_SUPPORT_GDPR_ERASURE, MAIL_TO_SUPPORT_GDPR_OBJECT, MAIL_TO_SUPPORT_GDPR_RECTIFICATION, MAIL_TO_SUPPORT_GDPR_RESTRICTION_PROCESSING, } from 'app/routes/constants';
import { CheckboxState } from './types';
const I18N_KEYS = {
    WITHDRAW_CONSENT_TITLE: 'webapp_privacy_settings_withdraw_consent_title',
    WITHDRAW_CONSENT_DESCRIPTION: 'webapp_privacy_settings_withdraw_consent_description',
    ERASURE_TITLE: 'webapp_privacy_settings_erasure_title',
    ERASURE_DESCRIPTION: 'webapp_privacy_settings_erasure_description',
    ACCESS_TITLE: 'webapp_privacy_settings_access_title',
    ACCESS_DESCRIPTION: 'webapp_privacy_settings_access_description',
    RECTIFICATION_TITLE: 'webapp_privacy_settings_rectification_title',
    RECTIFICATION_DESCRIPTION: 'webapp_privacy_settings_rectification_description',
    RESTRICTION_PROCESSING_TITLE: 'webapp_privacy_settings_restriction_processing_title',
    RESTRICTION_PROCESSING_DESCRIPTION: 'webapp_privacy_settings_restriction_processing_description',
    DATA_PORTABILITY_TITLE: 'webapp_privacy_settings_data_portability_title',
    DATA_PORTABILITY_DESCRIPTION: 'webapp_privacy_settings_data_portability_description',
    OBJECT_TITLE: 'webapp_privacy_settings_object_title',
    OBJECT_DESCRIPTION: 'webapp_privacy_settings_object_description',
    COMPLAINT_TITLE: 'webapp_privacy_settings_complaint_title',
    COMPLAINT_DESCRIPTION: 'webapp_privacy_settings_complaint_description',
    SEND_REQUEST_CTA_LABEL: 'webapp_privacy_settings_request_cta_label',
};
export const privacyItemList = [
    {
        title: I18N_KEYS.WITHDRAW_CONSENT_TITLE,
        description: I18N_KEYS.WITHDRAW_CONSENT_DESCRIPTION,
    },
    {
        title: I18N_KEYS.ERASURE_TITLE,
        description: I18N_KEYS.ERASURE_DESCRIPTION,
        cta: {
            label: I18N_KEYS.SEND_REQUEST_CTA_LABEL,
            link: MAIL_TO_SUPPORT_GDPR_ERASURE,
        },
    },
    {
        title: I18N_KEYS.ACCESS_TITLE,
        description: I18N_KEYS.ACCESS_DESCRIPTION,
        cta: {
            label: I18N_KEYS.SEND_REQUEST_CTA_LABEL,
            link: MAIL_TO_SUPPORT_GDPR_ACCESS,
        },
    },
    {
        title: I18N_KEYS.RECTIFICATION_TITLE,
        description: I18N_KEYS.RECTIFICATION_DESCRIPTION,
        cta: {
            label: I18N_KEYS.SEND_REQUEST_CTA_LABEL,
            link: MAIL_TO_SUPPORT_GDPR_RECTIFICATION,
        },
    },
    {
        title: I18N_KEYS.RESTRICTION_PROCESSING_TITLE,
        description: I18N_KEYS.RESTRICTION_PROCESSING_DESCRIPTION,
        cta: {
            label: I18N_KEYS.SEND_REQUEST_CTA_LABEL,
            link: MAIL_TO_SUPPORT_GDPR_RESTRICTION_PROCESSING,
        },
    },
    {
        title: I18N_KEYS.DATA_PORTABILITY_TITLE,
        description: I18N_KEYS.DATA_PORTABILITY_DESCRIPTION,
        cta: {
            label: I18N_KEYS.SEND_REQUEST_CTA_LABEL,
            link: MAIL_TO_SUPPORT_GDPR_DATA_PORTABILITY,
        },
    },
    {
        title: I18N_KEYS.OBJECT_TITLE,
        description: I18N_KEYS.OBJECT_DESCRIPTION,
        cta: {
            label: I18N_KEYS.SEND_REQUEST_CTA_LABEL,
            link: MAIL_TO_SUPPORT_GDPR_OBJECT,
        },
    },
    {
        title: I18N_KEYS.COMPLAINT_TITLE,
        description: I18N_KEYS.COMPLAINT_DESCRIPTION,
        cta: {
            label: I18N_KEYS.SEND_REQUEST_CTA_LABEL,
            link: MAIL_TO_SUPPORT_GDPR_COMPLAINT,
        },
    },
];
export const consentToCheckboxMap: Record<string, CheckboxState> = {
    emailsOffersAndTips: {
        initialValue: true,
        value: false,
    },
    privacyPolicyAndToS: {
        initialValue: true,
        value: false,
    },
};
