import * as React from "react";
import { Infobox, jsx } from "@dashlane/design-system";
import { AutofillDropdownWebcardWarningType } from "@dashlane/autofill-engine/types";
import { I18nContext } from "../../../../context/i18n";
import { LinkButton } from "../../../common/generic/buttons/LinkButton";
interface Props {
  type: AutofillDropdownWebcardWarningType;
  onSeeCredentialOnWebapp?: () => void;
}
export const DropdownMessage = ({ type, onSeeCredentialOnWebapp }: Props) => {
  const { translate } = React.useContext(I18nContext);
  let body = null;
  switch (type) {
    case AutofillDropdownWebcardWarningType.UnsecureProtocol:
    case AutofillDropdownWebcardWarningType.UnsecureIframe:
      body = (
        <Infobox
          mood="danger"
          icon="FeedbackInfoOutlined"
          title={
            type === AutofillDropdownWebcardWarningType.UnsecureIframe
              ? translate("websiteUnsecureIframe")
              : translate("websiteUnsecure")
          }
        />
      );
      break;
    case AutofillDropdownWebcardWarningType.PasswordGenerationDashlaneLogin:
      body = (
        <Infobox
          mood="danger"
          icon="FeedbackInfoOutlined"
          title={translate("contactEmailGeneration")}
        />
      );
      break;
    case AutofillDropdownWebcardWarningType.PossibleDuplicateRegistration:
      body = onSeeCredentialOnWebapp && (
        <Infobox
          mood="warning"
          icon="FeedbackInfoOutlined"
          title={translate("existingPassword")}
          description={
            <LinkButton
              onClick={onSeeCredentialOnWebapp}
              colorToken={"ds.text.brand.standard"}
              withUnderline={true}
            >
              {translate("seePasswordLink")}
            </LinkButton>
          }
        />
      );
      break;
    case AutofillDropdownWebcardWarningType.B2BDiscontinued:
      body = (
        <Infobox
          sx={{ marginBottom: "8px" }}
          title={translate("infoboxTitleB2BTrialDiscontinued")}
          description={translate("infoboxDescriptionB2BTrialDiscontinued")}
          mood="warning"
          icon="FeedbackFailOutlined"
        />
      );
      break;
  }
  return <div id={"webcard-dropdown-message"}>{body}</div>;
};
