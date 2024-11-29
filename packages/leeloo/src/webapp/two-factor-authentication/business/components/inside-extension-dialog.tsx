import {
  colors,
  DialogBody,
  DialogFooter,
  DialogTitle,
  MultiDeviceIcon,
  Paragraph,
} from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
interface Props {
  onPrimaryButtonAction: () => void;
  onSecondaryButtonAction: () => void;
}
export const InsideExtensionDialog = ({
  onPrimaryButtonAction,
  onSecondaryButtonAction,
}: Props) => {
  const { translate } = useTranslate();
  const I18N_KEYS = {
    ACTION: "webapp_two_factor_authentication_enforcement_dialog_action",
    DIALOG_TITLE: "webapp_two_factor_authentication_enforcement_dialog_title",
    COMPANY_REQUIREMENT:
      "webapp_two_factor_authentication_enforcement_dialog_description_1",
    ENABLEMENT_DESCRIPTION:
      "webapp_two_factor_authentication_enforcement_dialog_description_2",
    LOGOUT: "webapp_logout_dialog_confirm",
  };
  return (
    <>
      <MultiDeviceIcon size={96} />
      <DialogTitle id="dialogTitle" title={translate(I18N_KEYS.DIALOG_TITLE)} />
      <DialogBody>
        <Paragraph color={colors.grey00}>
          {translate(I18N_KEYS.COMPANY_REQUIREMENT)}
        </Paragraph>
        <Paragraph color={colors.grey00} sx={{ marginTop: "20px" }}>
          {translate(I18N_KEYS.ENABLEMENT_DESCRIPTION)}
        </Paragraph>
      </DialogBody>
      <DialogFooter
        primaryButtonTitle={translate(I18N_KEYS.ACTION)}
        primaryButtonOnClick={onPrimaryButtonAction}
        secondaryButtonTitle={translate(I18N_KEYS.LOGOUT)}
        secondaryButtonOnClick={onSecondaryButtonAction}
      />
    </>
  );
};
