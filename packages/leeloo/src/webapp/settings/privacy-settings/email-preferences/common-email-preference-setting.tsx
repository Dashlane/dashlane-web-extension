import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import {
  Button,
  Checkbox,
  Flex,
  IndeterminateLoader,
} from "@dashlane/design-system";
import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import { userConsentsApi } from "@dashlane/privacy-contracts";
import {
  FlowStep,
  UserUpdateCommunicationsPreferencesEvent,
} from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../libs/logs/logEvent";
import { Setting } from "../../shared/setting";
import {
  ActionTrigger,
  CheckboxState,
  ConsentData,
  FormValues,
} from "../resources/types";
import { consentToCheckboxMap } from "../resources/data";
const I18N_KEYS = {
  TITLE: "webapp_privacy_settings_email_title",
  DESCRIPTION: "webapp_privacy_settings_edit_description",
  OFFERS_AND_TIPS_CHECKBOX_LABEL:
    "webapp_privacy_settings_offers_and_tips_checkbox_label",
  SAVE_CTA_LABEL: "webapp_privacy_settings_save_cta_label",
  SAVED_CTA_LABEL: "webapp_privacy_settings_save_cta_label_saved",
  SAVE_ERROR: "webapp_privacy_settings_save_error",
};
export const CommonEmailPreferenceSetting = () => {
  const { translate } = useTranslate();
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [checkboxValues, setCheckboxValues] =
    useState<Record<string, CheckboxState>>(consentToCheckboxMap);
  const defaultValue: ConsentData = {
    emailsOffersAndTips: { status: "refused" },
    privacyPolicyAndToS: { status: "accepted" },
  };
  const [consentsData, setConsentsData] = useState(defaultValue);
  const { updateConsents } = useModuleCommands(userConsentsApi);
  const getConsentsResult = useModuleQuery(userConsentsApi, "getConsents", {
    format: "two-consents",
  });
  const newConsentsData =
    getConsentsResult.status === DataStatus.Success && getConsentsResult.data
      ? getConsentsResult.data.consents
      : defaultValue;
  const emailOffersAndTipsCheckboxValue =
    checkboxValues["emailsOffersAndTips"].value;
  const initialValues: FormValues = {
    EmailsOffersAndTips: emailOffersAndTipsCheckboxValue,
  };
  const updateConsentCheckboxState = (data: ConsentData) => {
    const values: Record<string, CheckboxState> = {};
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (consentToCheckboxMap[key]) {
        const type = consentToCheckboxMap[key];
        const status = data[key].status === "accepted";
        type.initialValue = status;
        type.value = status;
        values[key] = type;
      }
    });
    setIsLoading(false);
    setCheckboxValues(values);
  };
  useEffect(() => {
    if (getConsentsResult.status !== DataStatus.Success) {
      return;
    }
    if (JSON.stringify(consentsData) !== JSON.stringify(newConsentsData)) {
      setConsentsData(newConsentsData);
    }
    updateConsentCheckboxState(consentsData);
  }, [consentsData, getConsentsResult.status, newConsentsData]);
  const loadData = (emailConsentData: ConsentData) => {
    setIsLoading(true);
    updateConsentCheckboxState(emailConsentData);
    setIsLoading(false);
  };
  const onSubmit = async () => {
    const emailConsent: ConsentData = {
      emailsOffersAndTips: {
        status: emailOffersAndTipsCheckboxValue ? "accepted" : "refused",
      },
    };
    setIsUpdating(true);
    logEvent(
      new UserUpdateCommunicationsPreferencesEvent({
        flowStep: FlowStep.Complete,
        isMarketingOptIn: emailOffersAndTipsCheckboxValue,
      })
    );
    try {
      const result = await updateConsents({
        triggerBy: ActionTrigger.PRIVACY_SETTINGS,
        consents: emailConsent,
      });
      if (result.tag === "success") {
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
    } catch (err) {
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
    updatedValues["emailsOffersAndTips"].value = value;
    setCheckboxValues(updatedValues);
    setDataHasChanged(
      updatedValues["emailsOffersAndTips"].value !==
        checkboxValues["emailsOffersAndTips"].initialValue
    );
    logEvent(
      new UserUpdateCommunicationsPreferencesEvent({
        flowStep: FlowStep.Start,
        isMarketingOptIn: value,
      })
    );
  };
  const getButtonLabel = () => {
    if (isUpdating) {
      return (
        <>
          <IndeterminateLoader size="small" />
          {translate(I18N_KEYS.SAVE_CTA_LABEL)}
        </>
      );
    }
    if (displaySuccess) {
      return translate(I18N_KEYS.SAVED_CTA_LABEL);
    }
    return translate(I18N_KEYS.SAVE_CTA_LABEL);
  };
  return (
    <Setting
      title={translate(I18N_KEYS.TITLE)}
      description={translate(I18N_KEYS.DESCRIPTION)}
    >
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <Flex gap="16px" sx={{ flexDirection: "column", marginTop: "8px" }}>
            <Checkbox
              name="emailsOffersAndTips"
              label={translate(I18N_KEYS.OFFERS_AND_TIPS_CHECKBOX_LABEL)}
              checked={emailOffersAndTipsCheckboxValue}
              disabled={isLoading}
              onChange={(e) => {
                handleChange(e.target.checked);
              }}
              feedback={
                displayError
                  ? {
                      type: "error",
                      id: I18N_KEYS.SAVE_ERROR,
                      text: translate(I18N_KEYS.SAVE_ERROR),
                    }
                  : undefined
              }
            />

            <Button
              intensity="quiet"
              disabled={!dataHasChanged || isLoading || isUpdating}
              type="submit"
            >
              {getButtonLabel()}
            </Button>
          </Flex>
        </Form>
      </Formik>
    </Setting>
  );
};
