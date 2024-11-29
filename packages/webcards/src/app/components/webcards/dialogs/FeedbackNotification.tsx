import * as React from "react";
import { BrowseComponent, PageView } from "@dashlane/hermes";
import {
  Button,
  ExpressiveIcon,
  Flex,
  ItemHeader,
  jsx,
} from "@dashlane/design-system";
import {
  CredentialOperationType,
  FeedbackNotificationWebcardData,
} from "@dashlane/autofill-engine/types";
import { I18nContext } from "../../../context/i18n";
import { useCommunication } from "../../../context/communication";
import { WebcardPropsBase } from "../config";
import { DialogContainer } from "../../../components/common/layout/DialogContainer";
import { HeaderTitle } from "../../../components/common/layout/HeaderTitle";
const CLOSE_WEBCARD_DELAY_MS = 5000;
const UPDATE_CLOSING_TIME_INTERVAL_MS = 200;
interface Props extends WebcardPropsBase {
  data: FeedbackNotificationWebcardData;
}
export const FeedbackNotification = ({ data, closeWebcard }: Props) => {
  const { translate } = React.useContext(I18nContext);
  const { autofillEngineCommands } = useCommunication();
  const closeWebcardTimeout = React.useRef<NodeJS.Timeout>();
  const closeWebcardInterval = React.useRef<NodeJS.Timeout>();
  const [closingTime, setClosingTime] = React.useState(CLOSE_WEBCARD_DELAY_MS);
  const { operation } = data;
  const isUpdateAction =
    operation.type === CredentialOperationType.UpdateCredential;
  const handleCloseButton = () => {
    closeWebcardTimeout.current && clearTimeout(closeWebcardTimeout.current);
    closeWebcardInterval.current && clearInterval(closeWebcardInterval.current);
    closeWebcard();
  };
  const handleEdit = () => {
    autofillEngineCommands?.openWebapp({
      route: "/passwords",
      id: operation.credentialId,
    });
  };
  React.useEffect(() => {
    closeWebcardTimeout.current = setTimeout(() => {
      closeWebcardInterval.current &&
        clearInterval(closeWebcardInterval.current);
      closeWebcard();
    }, CLOSE_WEBCARD_DELAY_MS);
    closeWebcardInterval.current = setInterval(() => {
      setClosingTime((prev) => prev - UPDATE_CLOSING_TIME_INTERVAL_MS);
    }, UPDATE_CLOSING_TIME_INTERVAL_MS);
    autofillEngineCommands?.logPageView({
      pageView: isUpdateAction
        ? PageView.AutofillNotificationLoginUpdated
        : PageView.AutofillNotificationLoginCreated,
      browseComponent: BrowseComponent.Webcard,
    });
    return () => {
      closeWebcardTimeout.current && clearTimeout(closeWebcardTimeout.current);
      closeWebcardInterval.current &&
        clearInterval(closeWebcardInterval.current);
    };
  }, [autofillEngineCommands, closeWebcard, isUpdateAction]);
  const loginFeedback = isUpdateAction
    ? `${translate("loginUpdated")} `
    : `${translate("loginCreated")} `;
  const countdownPercentage = (closingTime / CLOSE_WEBCARD_DELAY_MS) * 100;
  return (
    <DialogContainer
      closeWebcard={handleCloseButton}
      headerContent={<HeaderTitle title={loginFeedback} />}
      withHeaderLogo
      withHeaderCloseButton
      countdownPercentage={countdownPercentage}
    >
      <Flex
        justifyContent="space-between"
        flexWrap="unset"
        sx={{ padding: "8px" }}
      >
        <ItemHeader
          thumbnail={<ExpressiveIcon name="ItemLoginOutlined" />}
          title={operation.fullDomain}
          description={operation.emailOrLogin}
          sx={{ overflow: "hidden" }}
        />
        <Button
          id="feedback-edit-button"
          layout="iconOnly"
          mood="brand"
          intensity="supershy"
          icon="ActionEditOutlined"
          onClick={handleEdit}
        />
      </Flex>
    </DialogContainer>
  );
};
