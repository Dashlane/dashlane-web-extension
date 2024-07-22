import * as React from "react";
import { FieldDisabledNotificationWebcardData } from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import {
  BrowseComponent,
  HelpCenterArticleCta,
  PageView,
  UserOpenHelpCenterEvent,
} from "@dashlane/hermes";
import { FlexContainer, IconButton } from "@dashlane/ui-components";
import { Icon, jsx, ThemeUIStyleObject } from "@dashlane/design-system";
import Logo from "../../../assets/svg/dashlane_logo.svg";
import { I18nContext } from "../../../context/i18n";
import { useCommunication } from "../../../context/communication";
import { LinkButton } from "../../common/generic/buttons/LinkButton";
import { DropdownContainer } from "../../common/layout/DropdownContainer";
import { WebcardPropsBase } from "../config";
import styles from "./FieldDisabledNotification.module.scss";
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  MAIN_CONTAINER: {
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
    paddingLeft: "8px",
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
    autofillEngineCommands?.openNewTabWithUrl("*****");
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
      withAllBordersRounded
    >
      <div className={styles.main} sx={SX_STYLES.MAIN_CONTAINER}>
        <Logo className={styles.logo} />

        <span className={styles.feedback}>
          {translate(I18N_KEYS.SHUSH_FEEDBACK)}
          <LinkButton
            onClick={onClickLearnMore}
            withUnderline={true}
            colorToken={"ds.text.brand.standard"}
            sxStyle={SX_STYLES.INLINE_LINK}
          >
            <span>{translate(I18N_KEYS.LEARN_MORE)}</span>
          </LinkButton>
        </span>

        <FlexContainer sx={SX_STYLES.ICON_CONTAINER}>
          <IconButton
            aria-label={translate(I18N_KEYS.DISMISS)}
            icon={<Icon name="ActionCloseOutlined" />}
            onClick={onClose}
          />
        </FlexContainer>
      </div>
    </DropdownContainer>
  );
};
