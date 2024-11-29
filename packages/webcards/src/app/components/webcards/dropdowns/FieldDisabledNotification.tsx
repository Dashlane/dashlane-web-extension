import * as React from "react";
import { FieldDisabledNotificationWebcardData } from "@dashlane/autofill-engine/types";
import {
  BrowseComponent,
  HelpCenterArticleCta,
  PageView,
  UserOpenHelpCenterEvent,
} from "@dashlane/hermes";
import {
  Button,
  Flex,
  jsx,
  Logo,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { I18nContext } from "../../../context/i18n";
import { useCommunication } from "../../../context/communication";
import { LinkButton } from "../../common/generic/buttons/LinkButton";
import { DropdownContainer } from "../../common/layout/DropdownContainer";
import { WebcardPropsBase } from "../config";
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  MAIN_CONTAINER: {
    width: "100%",
    height: "100%",
    color: "ds.text.brand.standard",
    fontSize: "12px",
    fontWeight: "500",
    padding: "0px 16px",
    paddingRight: "8px",
  },
  ICON_CONTAINER: {
    ml: "auto",
    pr: 0,
    alignSelf: "center",
  },
  INLINE_LINK: {
    fontWeight: "500",
  },
  FEEDBACK: {
    display: "flow-root",
    lineHeight: "16px",
    padding: "10px",
    paddingLeft: "18px",
  },
};
const I18N_KEYS = {
  SHUSH_FEEDBACK: "shush_feedback",
  LEARN_MORE: "shush_feedback_learnMore",
  DISMISS: "_common_alert_dismiss_button",
};
interface Props extends WebcardPropsBase {
  data: FieldDisabledNotificationWebcardData;
}
export const FieldDisabledNotification = ({ closeWebcard, data }: Props) => {
  const { translate } = React.useContext(I18nContext);
  const { autofillEngineCommands } = useCommunication();
  React.useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView: PageView.AutofillNotificationAutofillIsDisabled,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands]);
  const onClickLearnMore = () => {
    autofillEngineCommands?.openNewTabWithUrl("__REDACTED__");
    autofillEngineCommands?.logEvent(
      new UserOpenHelpCenterEvent({
        helpCenterArticleCta: HelpCenterArticleCta.GetHelp,
      })
    );
    closeWebcard();
  };
  const onClose = () => {
    closeWebcard();
  };
  return (
    <DropdownContainer
      closeWebcard={closeWebcard}
      webcardData={data}
      withNoMainPadding
      withNoContentCardWrapper
    >
      <Flex
        className="main"
        alignItems="center"
        gap="8px"
        sx={{ padding: "8px" }}
      >
        <Logo height={24} name="DashlaneMicroLogomark" sx={{ margin: "8px" }} />

        <Paragraph id="field-disabled-title">
          {translate(I18N_KEYS.SHUSH_FEEDBACK)}
        </Paragraph>
        <LinkButton
          onClick={onClickLearnMore}
          withUnderline={true}
          colorToken={"ds.text.brand.standard"}
          sxStyle={SX_STYLES.INLINE_LINK}
        >
          <span>{translate(I18N_KEYS.LEARN_MORE)}</span>
        </LinkButton>

        <Button
          onClick={onClose}
          icon="ActionCloseOutlined"
          layout="iconOnly"
          mood="neutral"
          intensity="supershy"
          aria-label={translate(I18N_KEYS.DISMISS)}
          size="small"
        />
      </Flex>
    </DropdownContainer>
  );
};
