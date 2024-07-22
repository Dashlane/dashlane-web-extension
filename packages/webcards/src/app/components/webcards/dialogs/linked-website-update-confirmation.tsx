import { useContext, useEffect, useRef } from "react";
import {
  Button,
  Icon,
  jsx,
  Logo,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { LinkedWebsiteUpdateConfirmationData } from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { useCommunication } from "../../../context/communication";
import { I18nContext } from "../../../context/i18n";
import { CardLayout } from "../../common/layout/CardLayout";
import { WebcardPropsBase } from "../config";
import styles from "./linked-website-update-confirmation.module.scss";
import DOMPurify from "dompurify";
const CLOSE_WEBCARD_DELAY_MS = 5000;
const I18N_KEYS = {
  CANCEL: "cancel",
  TITLE: "title",
  SUBTITLE: "subtitle",
};
interface Props extends WebcardPropsBase {
  data: LinkedWebsiteUpdateConfirmationData;
}
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  CONTAINER: {
    display: "flex",
    paddingX: "24px",
    justifyContent: "space-between",
  },
  CONTENT: {
    display: "flex",
    flexDirection: "column",
  },
  CONTENT_CONTAINER: {
    overflow: "hidden",
  },
  ACTION_CONTAINER: {
    display: "flex",
    alignItems: "flex-start",
  },
  LOGO: {
    marginRight: "16px",
    flexShrink: 0,
  },
  SUBTITLE: {
    color: "ds.text.neutral.quiet",
    fontSize: "10px",
  },
};
export const LinkedWebsiteUpdateConfirmation = ({
  data,
  closeWebcard,
}: Props) => {
  const { translate } = useContext(I18nContext);
  const { autofillEngineCommands } = useCommunication();
  const closeWebcardTimeout = useRef<NodeJS.Timeout>();
  const { operation } = data;
  const handleCancel = () => {
    autofillEngineCommands?.removeLinkedWebsite(
      operation.credentialId,
      operation.linkedWebsite
    );
    closeWebcard();
  };
  useEffect(() => {
    closeWebcardTimeout.current = setTimeout(() => {
      closeWebcard();
    }, CLOSE_WEBCARD_DELAY_MS);
    return () =>
      closeWebcardTimeout.current && clearTimeout(closeWebcardTimeout.current);
  }, [closeWebcard]);
  const keyTitle = translate(I18N_KEYS.TITLE, {
    0: `<span class=${styles.fullDomain}>${operation.credentialName}</span>`,
  });
  const sanitizedKeyTitle = DOMPurify.sanitize(keyTitle);
  return (
    <CardLayout>
      <div sx={SX_STYLES.CONTAINER}>
        <Logo sx={SX_STYLES.LOGO} height={32} name="DashlaneLogomark" />
        <div sx={SX_STYLES.CONTENT_CONTAINER}>
          <Paragraph
            sx={SX_STYLES.CONTENT}
            dangerouslySetInnerHTML={{
              __html: sanitizedKeyTitle,
            }}
          />

          <Paragraph sx={SX_STYLES.SUBTITLE}>
            {translate(I18N_KEYS.SUBTITLE)}
          </Paragraph>
        </div>
        <div sx={SX_STYLES.ACTION_CONTAINER}>
          <Button
            size="medium"
            type="button"
            intensity="quiet"
            icon={<Icon name="ActionCloseOutlined" />}
            onClick={() => handleCancel()}
            aria-label={translate("closeWindow")}
          >
            {translate(I18N_KEYS.CANCEL)}
          </Button>
        </div>
      </div>
    </CardLayout>
  );
};
