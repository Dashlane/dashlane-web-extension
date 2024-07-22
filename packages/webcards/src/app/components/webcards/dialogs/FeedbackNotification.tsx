import * as React from "react";
import { BrowseComponent, PageView } from "@dashlane/hermes";
import { Button, Icon, jsx } from "@dashlane/design-system";
import {
  CredentialOperationType,
  FeedbackNotificationWebcardData,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { I18nContext } from "../../../context/i18n";
import { CardLayout } from "../../common/layout/CardLayout";
import { useCommunication } from "../../../context/communication";
import { WebcardPropsBase } from "../config";
import { SX_STYLES } from "./FeedbackNotification.styles";
const CLOSE_WEBCARD_DELAY_MS = 5000;
interface Props extends WebcardPropsBase {
  data: FeedbackNotificationWebcardData;
}
export const FeedbackNotification = ({ data, closeWebcard }: Props) => {
  const { translate } = React.useContext(I18nContext);
  const { autofillEngineCommands } = useCommunication();
  const closeWebcardTimeout = React.useRef<NodeJS.Timeout>();
  const { operation } = data;
  const isUpdateAction =
    operation.type === CredentialOperationType.UpdateCredential;
  const handleCloseButton = () => {
    closeWebcardTimeout.current && clearTimeout(closeWebcardTimeout.current);
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
      closeWebcard();
    }, CLOSE_WEBCARD_DELAY_MS);
    autofillEngineCommands?.logPageView({
      pageView: isUpdateAction
        ? PageView.AutofillNotificationLoginUpdated
        : PageView.AutofillNotificationLoginCreated,
      browseComponent: BrowseComponent.Webcard,
    });
    return () =>
      closeWebcardTimeout.current && clearTimeout(closeWebcardTimeout.current);
  }, [autofillEngineCommands, closeWebcard, isUpdateAction]);
  const loginFeedback = isUpdateAction
    ? `${translate("loginUpdated")} `
    : `${translate("loginCreated")} `;
  return (
    <CardLayout>
      <div sx={SX_STYLES.FEEDBACK_CONTAINER}>
        <Icon name="FeedbackSuccessOutlined" size="xlarge" />
        <div>
          <div sx={SX_STYLES.DOMAIN}>{operation.fullDomain}</div>
          <h1 sx={SX_STYLES.H1}>{loginFeedback}</h1>

          <button onClick={handleEdit} sx={SX_STYLES.EDIT}>
            {translate("editButton")}
          </button>
        </div>

        <Button
          mood="neutral"
          intensity="supershy"
          size="medium"
          type="button"
          layout="iconOnly"
          icon={<Icon name="ActionCloseOutlined" />}
          onClick={() => handleCloseButton()}
          aria-label={translate("closeWindow")}
        />
      </div>
    </CardLayout>
  );
};
