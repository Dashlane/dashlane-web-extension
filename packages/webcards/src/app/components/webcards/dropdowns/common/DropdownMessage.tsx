import * as React from "react";
import {
  Icon,
  jsx,
  mergeSx,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { AutofillDropdownWebcardWarningType } from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { COMMON_SX_STYLES } from "../../../../../styles";
import { I18nContext } from "../../../../context/i18n";
import { LinkButton } from "../../../common/generic/buttons/LinkButton";
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  DROPDOWN_MESSAGE: mergeSx([
    COMMON_SX_STYLES.FOOTNOTE_TEXT,
    {
      display: "flex",
      alignItems: "center",
      svg: {
        display: "block",
        flexShrink: "0",
        marginRight: "8px",
      },
    },
  ]),
  RED_WARNING: {
    display: "flex",
    width: "100%",
    alignItems: "flex-start",
    padding: "16px",
    color: "ds.text.warning.quiet",
    backgroundColor: "ds.container.expressive.warning.quiet.idle",
  },
  BLUE_WARNING: {
    display: "flex",
    width: "100%",
    alignItems: "flex-start",
    padding: "16px",
    color: "ds.text.brand.standard",
    backgroundColor: "ds.container.expressive.brand.quiet.idle",
  },
};
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
        <div sx={SX_STYLES.RED_WARNING}>
          <Icon
            name="FeedbackInfoOutlined"
            size="small"
            color="ds.text.warning.quiet"
          />
          <span>
            {type === AutofillDropdownWebcardWarningType.UnsecureProtocol &&
              translate("websiteUnsecure")}
            {type === AutofillDropdownWebcardWarningType.UnsecureIframe &&
              translate("websiteUnsecureIframe")}
          </span>
        </div>
      );
      break;
    case AutofillDropdownWebcardWarningType.PasswordGenerationDashlaneLogin:
      body = (
        <div sx={SX_STYLES.RED_WARNING}>
          <Icon
            name="FeedbackInfoOutlined"
            size="small"
            color="ds.text.warning.quiet"
          />
          <span>{translate("contactEmailGeneration")}</span>
        </div>
      );
      break;
    case AutofillDropdownWebcardWarningType.PossibleDuplicateRegistration:
      body = onSeeCredentialOnWebapp && (
        <div sx={SX_STYLES.BLUE_WARNING}>
          <Icon
            name="FeedbackInfoOutlined"
            size="small"
            color="ds.text.brand.standard"
          />
          <span>
            {translate("existingPassword")}{" "}
            <LinkButton
              onClick={onSeeCredentialOnWebapp}
              colorToken={"ds.text.brand.standard"}
              withUnderline={true}
            >
              {translate("seePasswordLink")}
            </LinkButton>
          </span>
        </div>
      );
      break;
  }
  return (
    <div sx={SX_STYLES.DROPDOWN_MESSAGE} id={"webcard-dropdown-message"}>
      {body}
    </div>
  );
};
