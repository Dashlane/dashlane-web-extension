import { jsx } from "@dashlane/ui-components";
import { useModuleCommands } from "@dashlane/framework-react";
import { UserLockAppEvent } from "@dashlane/hermes";
import { Flex, Paragraph } from "@dashlane/design-system";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { runtimeGetManifest } from "@dashlane/webextensions-apis";
import useTranslate from "../../libs/i18n/useTranslate";
import { formatExtensionVersion } from "./formatter";
import * as moreToolsHelpers from "./helpers";
import { logEvent } from "../../libs/logs/logEvent";
import { useLogout } from "../../libs/hooks/useLogout";
import { Footer } from "./footer/footer";
import { EmailField } from "./email-field/email-field";
import { MoreToolsList } from "./more-tools-list/more-tools-list";
import { LogOutDialog } from "./dialog/log-out-dialog";
import { useState } from "react";
import { useIsMPlessUser } from "../../libs/api/account/useIsMPLessAccount";
import { usePinCodeStatus } from "../../libs/api/account/use-pin-code-status";
interface Props {
  login: string;
}
const WAIT_BEFORE_LOGOUT = 1000;
export const I18N_KEYS = {
  OPEN_APP: {
    TITLE: "more_tools/current_item_go_to_app",
    EXPLANATION: "more_tools/current_item_go_to_app_explanation",
  },
  OPEN_TEAM_CONSOLE: {
    TITLE: "more_tools/current_item_go_to_console",
    EXPLANATION: "more_tools/current_item_go_to_console_explanation",
  },
  REFER_A_FRIEND: {
    TITLE: "more_tools/current_item_refer_a_friend_title:",
    EXPLANATION: "more_tools/current_item_refer_a_friend_explanation:",
  },
  DASHLANE_SUPPORT: {
    TITLE: "more_tools/current_item_dashlane_support_title",
    EXPLANATION: "more_tools/current_item_dashlane_support_explanation",
  },
  EXTENSION_VERSION: {
    EXPLANATION: "more_tools/current_item_extension_version_explanation:",
  },
  LOGOUT: {
    TITLE: "more_tools/current_item_log_out",
  },
};
export const MoreTools = ({ login }: Props) => {
  const extensionVersion = runtimeGetManifest().version;
  const logout = useLogout();
  const { translate } = useTranslate();
  const { lockSession } = useModuleCommands(
    AuthenticationFlowContracts.authenticationFlowApi
  );
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { isMPLessUser } = useIsMPlessUser();
  const { isPinCodeEnabled, isPinCodeStatusLoading } = usePinCodeStatus();
  const isDefaultLoginType = !isMPLessUser && !isPinCodeEnabled;
  const handleLogoutClick = async () => {
    const maximumWaitBeforeLogOut = new Promise((resolve) =>
      setTimeout(resolve, WAIT_BEFORE_LOGOUT)
    );
    try {
      await Promise.race([
        moreToolsHelpers.logoutLogs(),
        maximumWaitBeforeLogOut,
      ]);
    } catch (error) {}
    void logout();
  };
  const handleLockoutClick = () => {
    void logEvent(new UserLockAppEvent({}));
    void lockSession();
  };
  const handleDismissLogoutDialog = () => {
    setIsLogoutDialogOpen(false);
  };
  return (
    <Flex
      flexDirection="column"
      sx={{
        height: "100%",
        backgroundColor: "ds.container.agnostic.neutral.quiet",
      }}
    >
      <Flex
        flexDirection="column"
        flexWrap="nowrap"
        gap="8px"
        sx={{
          padding: "0 16px",
          overflowY: "auto",
          boxSizing: "border-box",
          width: "100%",
          height: `calc(var(--app-height) - var(--tabs-height) - var(--more-footer-height))`,
        }}
      >
        <EmailField login={login} />
        <MoreToolsList />
        <Paragraph
          textStyle="ds.body.helper.regular"
          color="ds.text.neutral.quiet"
        >
          Dashlane -{" "}
          <span>
            {translate(I18N_KEYS.EXTENSION_VERSION.EXPLANATION, {
              version: formatExtensionVersion(extensionVersion),
            })}
          </span>
        </Paragraph>
      </Flex>
      <Footer
        onLockSession={() => {
          void handleLockoutClick();
        }}
        onLogOutClick={() => {
          void (isDefaultLoginType
            ? handleLogoutClick()
            : setIsLogoutDialogOpen(true));
        }}
      />
      <Flex>
        <LogOutDialog
          isOpen={isLogoutDialogOpen}
          isPasswordlessUser={isMPLessUser}
          isPinCodeUnlockUser={
            !isPinCodeStatusLoading && Boolean(isPinCodeEnabled)
          }
          onLogout={() => {
            void handleLogoutClick();
          }}
          onDismiss={() => handleDismissLogoutDialog()}
        />
      </Flex>
    </Flex>
  );
};
