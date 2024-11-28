import {
  ChangeEvent,
  FormEvent,
  Fragment,
  FunctionComponent,
  memo,
  useState,
} from "react";
import {
  Checkbox,
  colors,
  InfoBox,
  jsx,
  Link,
  Paragraph,
} from "@dashlane/ui-components";
import { DataStatus } from "@dashlane/framework-react";
import { REMEMBER_ME_FOR_SSO_PREFERENCE } from "../../../libs/local-storage-constants";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useIsAutoSsoLoginDisabled } from "../../../libs/api/killswitch/useIsAutoSsoLoginDisabled";
import FormWrapper from "../FormWrapper";
import { FormActionsProps } from "../FormWrapper/FormActions";
import { DASHLANE_SSO_MORE_INFO } from "../../../libs/externalUrls";
import styles from "./styles.css";
const I18N_KEYS = {
  DESCRIPTION: "login/sso_sign_in_description",
  LOG_IN_WITH_SSO: "login/sso_sign_in",
  TITLE: "login/sso_sign_in_title",
  AUTOMATIC_SSO: "login/auto_trigger_sso",
  INFOBOX_TITLE: "login/auto_trigger_sso_infobox_title",
  INFOBOX_LINK: "login/auto_trigger_sso_infobox_link",
};
interface SSOStepProps {
  onSSOSignInClicked: (rememberMeForSSOPreference: boolean) => Promise<void>;
}
const SSOStep: FunctionComponent<SSOStepProps> = (props: SSOStepProps) => {
  const rememberMeForSSOStatus =
    localStorage.getItem(REMEMBER_ME_FOR_SSO_PREFERENCE) !== "false";
  const { translate } = useTranslate();
  const [loading, setLoading] = useState(false);
  const [rememberMeForSSOPreference, setRememberMeForSSOPreference] = useState(
    rememberMeForSSOStatus
  );
  const isAutoSsoLoginDisabled = useIsAutoSsoLoginDisabled();
  const onRememberMeWithSSOCheckBoxChanged = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    setRememberMeForSSOPreference(e.target.checked);
  };
  const formActionProps: FormActionsProps = {
    isLoading: loading,
    primaryButtonText: translate(I18N_KEYS.LOG_IN_WITH_SSO),
  };
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    void props.onSSOSignInClicked(rememberMeForSSOPreference);
  };
  return (
    <FormWrapper
      formActionsProps={formActionProps}
      handleSubmit={handleFormSubmit}
    >
      <h1 className={styles.title}>{translate(I18N_KEYS.TITLE)}</h1>
      <p className={styles.description}>{translate(I18N_KEYS.DESCRIPTION)}</p>
      {isAutoSsoLoginDisabled.status === DataStatus.Success &&
      !isAutoSsoLoginDisabled.data ? (
        <>
          <Checkbox
            sx={{ marginTop: "24px", marginBottom: "24px" }}
            checked={rememberMeForSSOPreference}
            onChange={onRememberMeWithSSOCheckBoxChanged}
            label={
              <Paragraph size="x-small" color={colors.white}>
                {translate(I18N_KEYS.AUTOMATIC_SSO)}
              </Paragraph>
            }
          />
          <InfoBox
            size="small"
            severity="subtle"
            title={
              <div sx={{ display: "flex", flexDirection: "column" }}>
                <span>{translate(I18N_KEYS.INFOBOX_TITLE)}</span>
                <Link href={DASHLANE_SSO_MORE_INFO}>
                  {translate(I18N_KEYS.INFOBOX_LINK)}
                </Link>
              </div>
            }
          />
        </>
      ) : null}
    </FormWrapper>
  );
};
export default memo(SSOStep);
