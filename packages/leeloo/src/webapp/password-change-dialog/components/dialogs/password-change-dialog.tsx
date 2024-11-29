import { PropsWithChildren, useCallback } from "react";
import { Dialog, Flex, Paragraph } from "@dashlane/design-system";
import { GridChild, GridContainer } from "@dashlane/ui-components";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { ParsedURL } from "@dashlane/url-parser";
import { carbonConnector } from "../../../../libs/carbon/connector";
import { openUrl } from "../../../../libs/external-urls";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { allIgnoreClickOutsideClassName } from "../../../variables";
import { NumberBadge } from "../../../components/number-badge/number-badge";
import { useCredential } from "../../hooks/use-credential";
import { OpenWebsiteStep } from "../open-website-step";
import { MissingURLDialog } from "./missing-url-dialog";
const I18N_KEYS = {
  TITLE: "webapp_change_password_dialog_title",
  SUBTITLE: "webapp_change_password_dialog_subtitle",
  DISMISS: "webapp_change_password_dialog_dismiss",
  CONFIRM: "webapp_change_password_dialog_confirm",
  OPEN_WEBSITE: "webapp_change_password_dialog_open_website",
  GO_TO_SETTINGS: "webapp_change_password_dialog_go_to_settings",
  DASHLANE_AUTO_REPLACE: "webapp_change_password_dialog_dashlane_auto_replace",
};
type DialogStep = {
  name: string;
  content: JSX.Element | string;
};
export interface PasswordChangeManagerProps {
  credentialId: string;
  dismissCallback: () => void;
}
const PasswordChangeDialogStep = ({
  rank,
  content,
}: PropsWithChildren<
  Omit<DialogStep, "name"> & {
    rank: number;
  }
>) => {
  return (
    <GridContainer
      as="li"
      gap="16px"
      gridTemplateColumns="35px 1fr"
      alignItems="center"
      justifyContent="flex-start"
      sx={{
        width: "100%",
      }}
    >
      <GridChild as={NumberBadge} rank={rank} />
      {typeof content === "string" ? (
        <Paragraph
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.standard"
        >
          {content}
        </Paragraph>
      ) : (
        content
      )}
    </GridContainer>
  );
};
export const PasswordChangeDialog = ({
  credentialId,
  dismissCallback,
}: PasswordChangeManagerProps) => {
  const { translate } = useTranslate();
  const credentialData = useCredential(credentialId);
  const credential =
    credentialData.status === DataStatus.Success && credentialData.data;
  const onSuccess = useCallback(() => {
    if (credential) {
      openUrl(credential.url);
    }
    dismissCallback();
  }, [credential]);
  if (!credential) {
    return null;
  }
  if (!credential.url) {
    return (
      <MissingURLDialog
        credential={credential}
        onSuccess={async (update: { url: string }) => {
          await carbonConnector.updateCredential({
            id: credential.id,
            update: {
              ...update,
              isUrlSelectedByUser: true,
            },
          });
        }}
        onDismiss={dismissCallback}
      />
    );
  }
  const credentialUrlHostname = new ParsedURL(credential.url).getHostname();
  const credentialDomain = new ParsedURL(credential.url).getRootDomain();
  const dialogSteps: DialogStep[] = [
    {
      name: "open-website",
      content: (
        <OpenWebsiteStep
          key="open"
          hostname={credentialUrlHostname}
          domain={credentialDomain}
          translation={translate(I18N_KEYS.OPEN_WEBSITE, { icon: null })}
        />
      ),
    },
    {
      name: "go-to-settings",
      content: translate(I18N_KEYS.GO_TO_SETTINGS),
    },
    {
      name: "auto-replace",
      content: translate(I18N_KEYS.DASHLANE_AUTO_REPLACE),
    },
  ];
  return (
    <Dialog
      isOpen
      dialogClassName={allIgnoreClickOutsideClassName}
      closeActionLabel={translate(I18N_KEYS.DISMISS)}
      onClose={dismissCallback}
      actions={{
        primary: {
          onClick: onSuccess,
          layout: "iconLeading",
          icon: "ActionOpenExternalLinkOutlined",
          children: translate(I18N_KEYS.CONFIRM, {
            domain: credentialUrlHostname,
          }),
        },
        secondary: {
          children: translate(I18N_KEYS.DISMISS),
        },
      }}
      title={translate(I18N_KEYS.TITLE)}
    >
      <Paragraph
        color="ds.text.neutral.standard"
        textStyle="ds.body.standard.regular"
      >
        {translate(I18N_KEYS.SUBTITLE)}
      </Paragraph>
      <div sx={{ marginTop: "32px" }}>
        <Flex as="ol" gap="16px">
          {dialogSteps.map(({ name, content }, index) => (
            <PasswordChangeDialogStep
              rank={index + 1}
              key={name}
              content={content}
            />
          ))}
        </Flex>
      </div>
    </Dialog>
  );
};
