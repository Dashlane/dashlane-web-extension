import { useContext, useEffect, useRef } from "react";
import {
  Button,
  Icon,
  jsx,
  Logo,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { LinkedWebsiteUpdateConfirmationData } from "@dashlane/autofill-engine/types";
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
    padding: "8px",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "8px",
  },
  TITLE: {
    marginY: "7px",
  },
  CONTENT_CONTAINER: {
    overflow: "hidden",
  },
  ACTION_CONTAINER: {
    display: "flex",
    alignItems: "flex-start",
  },
  LOGO: {
    margin: "8px",
    flexShrink: 0,
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
    <CardLayout withNoContentCardWrapper withNoMainPadding>
      <div sx={SX_STYLES.CONTAINER}>
        <Logo sx={SX_STYLES.LOGO} height={16} name="DashlaneMicroLogomark" />
        <div sx={SX_STYLES.CONTENT_CONTAINER}>
          <Paragraph
            sx={SX_STYLES.TITLE}
            dangerouslySetInnerHTML={{
              __html: sanitizedKeyTitle,
            }}
          />

          <Paragraph
            color="ds.text.neutral.quiet"
            textStyle="ds.body.reduced.regular"
          >
            {translate(I18N_KEYS.SUBTITLE)}
          </Paragraph>
        </div>
        <div sx={SX_STYLES.ACTION_CONTAINER}>
          <Button
            size="small"
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
