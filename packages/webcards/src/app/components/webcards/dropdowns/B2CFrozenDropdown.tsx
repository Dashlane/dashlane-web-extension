import * as React from "react";
import { OtherSourceType, VaultSourceType } from "@dashlane/autofill-contracts";
import { AccountFrozenDropdownWebcardData } from "@dashlane/autofill-engine/types";
import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import {
  Button,
  Infobox,
  jsx,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { I18nContext } from "../../../context/i18n";
import { useCommunication } from "../../../context/communication";
import { vaultSourceTypeKeyMap } from "../../../utils/formatter/keys";
import { vaultSourceTypeToWebappRouteNameMap } from "../../../utils/routes/routes";
import { DropdownContainer } from "../../common/layout/DropdownContainer";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { WebcardPropsBase } from "../config";
import { AutofillFooter } from "./AutofillFooter";
const I18N_KEYS = {
  CTA: "B2CFrozenCTA",
  INFOBOX_DESC: "B2CFrozenInfoboxDesc",
  INFOBOX_TITLE: "B2CFrozenInfoboxTitle",
  PASSWORD_GEN_CARD_TITLE: "generatePasswordDropdownTitle",
  FALLBACK_CARD_TITLE: "B2CFrozenFallbackCardTitle",
};
const SX_STYLES: Record<string, ThemeUIStyleObject> = {
  INFOBOX: {
    marginX: "8px",
    marginBottom: "8px",
  },
};
interface Props extends WebcardPropsBase {
  data: AccountFrozenDropdownWebcardData;
}
export const B2CFrozenDropdown = ({ data, closeWebcard }: Props) => {
  const { cardTitleSourceType, passwordLimit } = data;
  const { translate } = React.useContext(I18nContext);
  const { autofillEngineCommands, setAutofillEngineActionsHandlers } =
    useCommunication();
  if (!autofillEngineCommands || !setAutofillEngineActionsHandlers) {
    return null;
  }
  const cardTitle = cardTitleSourceType
    ? cardTitleSourceType === OtherSourceType.NewPassword
      ? translate(I18N_KEYS.PASSWORD_GEN_CARD_TITLE)
      : translate(`types_${vaultSourceTypeKeyMap[cardTitleSourceType]}`)
    : translate(I18N_KEYS.FALLBACK_CARD_TITLE);
  const onClick = async () => {
    autofillEngineCommands?.logEvent(
      new UserClickEvent({
        button: HermesButton.UnfreezeAccount,
        clickOrigin: ClickOrigin.AutofillDropdown,
      })
    );
    autofillEngineCommands?.openWebapp({
      route: vaultSourceTypeToWebappRouteNameMap[VaultSourceType.Credential],
      query: { b2cFrozen: "true" },
    });
    closeWebcard();
  };
  return (
    <DropdownContainer
      closeWebcard={closeWebcard}
      headerContent={<HeaderTitle title={cardTitle} />}
      footerContent={
        <div>
          <Infobox
            title={translate(I18N_KEYS.INFOBOX_TITLE)}
            description={translate(I18N_KEYS.INFOBOX_DESC, {
              count: passwordLimit,
            })}
            mood="danger"
            icon="FeedbackFailOutlined"
            size="medium"
            sx={SX_STYLES.INFOBOX}
          />
          <AutofillFooter closeWebcard={closeWebcard} />
        </div>
      }
      isSearchActive={false}
      srcElementValue={""}
      webcardData={data}
      withHeaderLogo
      withHeaderOptionsButton={false}
      withHeaderSearchButton={false}
      withFooterPadding={false}
      withNoContentCardWrapper
    >
      <Button onClick={onClick} fullsize>
        {translate(I18N_KEYS.CTA)}
      </Button>
    </DropdownContainer>
  );
};
