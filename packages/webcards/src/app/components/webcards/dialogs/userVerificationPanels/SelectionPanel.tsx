import { Icon, IconName, jsx, Paragraph } from "@dashlane/design-system";
import { BrowseComponent, PageView } from "@dashlane/hermes";
import { useEffect } from "react";
import { useCommunication } from "../../../../context/communication";
import { useTranslate } from "../../../../context/i18n";
import { SecondaryActionButton } from "../../../common/generic/buttons/SecondaryActionButton";
import { SX_STYLES } from "./SelectionPanel.styles";
import { UserVerificationPanelProps } from "./UserVerificationPanelProps";
import { UserVerificationMethods } from "@dashlane/authentication-contracts";
export const I18N_KEYS = {
  MASTER_PASSWORD: "selectionPanelMasterPassword",
  BIOMETRIC: "selectionPanelBiometric",
  PIN: "selectionPanelPin",
  TITLE: "selectionPanelTitle",
  CANCEL: "cancel",
};
export const buttonLabels: Record<UserVerificationMethods, string> = {
  [UserVerificationMethods.MasterPassword]: I18N_KEYS.MASTER_PASSWORD,
  [UserVerificationMethods.Biometrics]: I18N_KEYS.BIOMETRIC,
  [UserVerificationMethods.Pin]: I18N_KEYS.PIN,
};
export interface SelectionPanelProps
  extends Omit<UserVerificationPanelProps, "onVerificationSucessful"> {
  readonly availableMethods: UserVerificationMethods[];
  readonly onChooseMethod: (method: UserVerificationMethods) => void;
}
const MethodButton = (
  leadingIcon: IconName,
  label: string,
  callback: () => void
) => (
  <button
    key={label}
    aria-label={label}
    sx={SX_STYLES.ROW}
    type="button"
    onClick={callback}
  >
    <div sx={SX_STYLES.ROW_LABEL_CONTAINER}>
      <Icon name={leadingIcon} size="large" color="ds.text.neutral.standard" />
      <Paragraph textStyle="ds.body.standard.regular">{label}</Paragraph>
    </div>
    <Icon
      name="CaretRightOutlined"
      size="large"
      color="ds.text.neutral.standard"
    />
  </button>
);
export const SelectionPanel = ({
  availableMethods,
  onChooseMethod,
  onCancel,
  makeUserVerificationDialog,
}: SelectionPanelProps) => {
  const { translate } = useTranslate();
  const { autofillEngineCommands } = useCommunication();
  useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView:
        PageView.AutofillNotificationAuthenticatePasskeyUserVerification,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands]);
  const getButtonForMethod = (method: UserVerificationMethods) => {
    const callback = () => onChooseMethod(method);
    const label = translate(buttonLabels[method]);
    const icon =
      method === UserVerificationMethods.Biometrics
        ? "FingerprintOutlined"
        : "LockOutlined";
    return MethodButton(icon, label, callback);
  };
  const content = (
    <div sx={SX_STYLES.MAIN}>
      <Paragraph textStyle="ds.body.standard.regular">
        {translate(I18N_KEYS.TITLE)}
      </Paragraph>
      {availableMethods.map(getButtonForMethod)}
    </div>
  );
  const customFooter = (
    <SecondaryActionButton
      onClick={onCancel}
      label={translate(I18N_KEYS.CANCEL)}
    />
  );
  return makeUserVerificationDialog(content, customFooter);
};
