import React, { Fragment, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import { Lee } from 'lee';
import { Button, Checkbox, Heading, jsx, Paragraph, } from '@dashlane/design-system';
import { FlexChild, FlexContainer, LoadingIcon } from '@dashlane/ui-components';
import { DataStatus, useModuleCommands, useModuleQuery, } from '@dashlane/framework-react';
import { userConsentsApi } from '@dashlane/privacy-contracts';
import { FlowStep, PageView, UserUpdateCommunicationsPreferencesEvent, } from '@dashlane/hermes';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { Connected as NotificationsDropdown } from 'webapp/bell-notifications/connected';
import { Header } from 'webapp/components/header/header';
import { HeaderAccountMenu } from 'webapp/components/header/header-account-menu';
import { DataRightsSection } from './data-rights-section';
import { TermsAndPrivacySettings } from './terms-and-privacy-settings';
import { ActionTrigger, CheckboxState, ConsentData } from './resources/types';
import { consentToCheckboxMap } from './resources/data';
const I18N_KEYS = {
    PAGE_TITLE: 'webapp_privacy_settings_page_title',
    EDIT_DESCRIPTION: 'webapp_privacy_settings_edit_description',
    OFFERS_AND_TIPS_CHECKBOX_LABEL: 'webapp_privacy_settings_offers_and_tips_checkbox_label',
    SAVE_CTA_LABEL: 'webapp_privacy_settings_save_cta_label',
    SAVED_CTA_LABEL: 'webapp_privacy_settings_save_cta_label_saved',
    SAVE_ERROR: 'webapp_privacy_settings_save_error',
};
interface FormValues {
    EmailsOffersAndTips: boolean;
}
const endWidget = (<>
    <HeaderAccountMenu />
    <NotificationsDropdown />
  </>);
export const PrivacySettings = ({ lee }: {
    lee: Lee;
}) => {
    const { translate } = useTranslate();
    const [dataHasChanged, setDataHasChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);
    const [displayError, setDisplayError] = useState(false);
    const [checkboxValues, setCheckboxValues] = useState<Record<string, CheckboxState>>(consentToCheckboxMap);
    const defaultValue: ConsentData = {
        emailsOffersAndTips: { status: 'refused' },
        privacyPolicyAndToS: { status: 'accepted' },
    };
    const [consentsData, setConsentsData] = useState(defaultValue);
    const { updateConsents } = useModuleCommands(userConsentsApi);
    const getConsentsResult = useModuleQuery(userConsentsApi, 'getConsents', {
        format: 'two-consents',
    });
    const newConsentsData = getConsentsResult.status === DataStatus.Success && getConsentsResult.data
        ? getConsentsResult.data.consents
        : defaultValue;
    const emailOffersAndTipsCheckboxValue = checkboxValues['emailsOffersAndTips'].value;
    const initialValues: FormValues = {
        EmailsOffersAndTips: emailOffersAndTipsCheckboxValue,
    };
    const isEu = lee.carbon.currentLocation.isEu;
    const startWidgets = () => (<Heading as="h1" textStyle="ds.title.section.large" color="ds.text.neutral.catchy">
      {translate(I18N_KEYS.PAGE_TITLE)}
    </Heading>);
    const updateConsentCheckboxState = (data: ConsentData) => {
        const values: Record<string, CheckboxState> = {};
        const keys = Object.keys(data);
        keys.forEach((key) => {
            if (consentToCheckboxMap[key]) {
                const type = consentToCheckboxMap[key];
                const status = data[key].status === 'accepted';
                type.initialValue = status;
                type.value = status;
                values[key] = type;
            }
        });
        setIsLoading(false);
        setCheckboxValues(values);
    };
    const loadData = (emailConsentData: ConsentData) => {
        setIsLoading(true);
        updateConsentCheckboxState(emailConsentData);
        setIsLoading(false);
    };
    useEffect(() => {
        logPageView(PageView.PrivacySettings);
    }, []);
    useEffect(() => {
        if (consentsData !== newConsentsData) {
            setConsentsData(newConsentsData);
        }
        updateConsentCheckboxState(consentsData);
    }, [consentsData, newConsentsData]);
    const onSubmit = async () => {
        const emailConsent: ConsentData = {
            emailsOffersAndTips: {
                status: emailOffersAndTipsCheckboxValue ? 'accepted' : 'refused',
            },
        };
        setIsUpdating(true);
        logEvent(new UserUpdateCommunicationsPreferencesEvent({
            flowStep: FlowStep.Complete,
            isMarketingOptIn: emailOffersAndTipsCheckboxValue,
        }));
        try {
            const result = await updateConsents({
                triggerBy: ActionTrigger.PRIVACY_SETTINGS,
                consents: emailConsent,
            });
            if (result.tag === 'success') {
                setDisplaySuccess(true);
                setTimeout(() => {
                    setDataHasChanged(false);
                    setIsUpdating(false);
                    setIsLoading(false);
                }, 1000);
                setTimeout(() => {
                    setDisplaySuccess(false);
                    loadData(emailConsent);
                }, 2000);
            }
        }
        catch (err) {
            setDisplayError(true);
            setIsUpdating(false);
            setIsLoading(false);
            setTimeout(() => {
                setDisplayError(false);
            }, 2000);
        }
    };
    const handleChange = (value: boolean) => {
        const updatedValues = Object.assign({}, checkboxValues);
        updatedValues['emailsOffersAndTips'].value = value;
        setCheckboxValues(updatedValues);
        setDataHasChanged(updatedValues['emailsOffersAndTips'].value !==
            checkboxValues['emailsOffersAndTips'].initialValue);
        logEvent(new UserUpdateCommunicationsPreferencesEvent({
            flowStep: FlowStep.Start,
            isMarketingOptIn: value,
        }));
    };
    const getContent = () => {
        if (isUpdating) {
            return (<>
          <LoadingIcon color="ds.text.brand.standard"/>
          <span>{translate(I18N_KEYS.SAVE_CTA_LABEL)}</span>
        </>);
        }
        if (displaySuccess) {
            return <span>{translate(I18N_KEYS.SAVED_CTA_LABEL)}</span>;
        }
        return <span>{translate(I18N_KEYS.SAVE_CTA_LABEL)}</span>;
    };
    return (<FlexContainer sx={{ overflow: 'auto', height: '100%' }}>
      <FlexContainer gap="32px" sx={{ padding: '16px 0' }}>
        <Header startWidgets={startWidgets} endWidget={endWidget}/>
        <FlexChild sx={{ width: '100%', margin: '0 32px', height: '100%' }}>
          <Paragraph>{translate(I18N_KEYS.EDIT_DESCRIPTION)}</Paragraph>
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            <Form>
              <FlexContainer gap="16px" sx={{ flexDirection: 'column', marginTop: '8px' }}>
                <Checkbox name="emailsOffersAndTips" label={translate(I18N_KEYS.OFFERS_AND_TIPS_CHECKBOX_LABEL)} checked={emailOffersAndTipsCheckboxValue} disabled={isLoading} onChange={(e) => {
            handleChange(e.target.checked);
        }}/>
                {displayError ? (<Paragraph color="ds.text.danger.standard" textStyle="ds.body.reduced.regular">
                    {translate(I18N_KEYS.SAVE_ERROR)}
                  </Paragraph>) : null}
                <Button intensity="quiet" disabled={!dataHasChanged || isLoading || isUpdating} type="submit">
                  {getContent()}
                </Button>
              </FlexContainer>
            </Form>
          </Formik>
        </FlexChild>
      </FlexContainer>
      {isEu ? (<FlexContainer sx={{ margin: '32px', width: '100%' }}>
          <TermsAndPrivacySettings />
          <DataRightsSection />
        </FlexContainer>) : null}
    </FlexContainer>);
};
