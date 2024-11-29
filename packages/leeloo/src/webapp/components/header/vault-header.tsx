import { Icon, Tooltip } from "@dashlane/design-system";
import {
  useHistory,
  useRouterGlobalSettingsContext,
} from "../../../libs/router";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useFrozenState } from "../../../libs/frozen-state/frozen-state-dialog-context";
import { Connected as NotificationsDropdown } from "../../bell-notifications/connected";
import { Header } from "./header";
import PasswordHistoryButton from "../../password-history/password-history-button";
import { VaultHeaderButton } from "./vault-header-button";
import { HeaderAccountMenu } from "./header-account-menu";
const I18N_KEYS = {
  ADD: "credentials_header_add_password",
  IMPORT_DATA_BUTTON: "webapp_account_root_import_data",
};
interface VaultHeaderProps {
  handleAddNew: (event: React.MouseEvent<HTMLElement>) => void;
  shareButtonElement?: JSX.Element | null;
  addNewDisabled?: boolean;
  tooltipPassThrough?: boolean;
  tooltipContent?: string;
  shouldDisplayPasswordHistoryButton?: boolean;
  shouldDisplayNewAccountImportButton?: boolean;
  shouldDisplayAddButton?: boolean;
}
export const VaultHeader = ({
  handleAddNew,
  tooltipContent,
  tooltipPassThrough = false,
  addNewDisabled = false,
  shareButtonElement = null,
  shouldDisplayPasswordHistoryButton = false,
  shouldDisplayNewAccountImportButton = false,
  shouldDisplayAddButton = true,
}: VaultHeaderProps) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const history = useHistory();
  const { shouldShowFrozenStateDialog } = useFrozenState();
  const shouldDisplayImportButton =
    shouldShowFrozenStateDialog !== null &&
    !shouldShowFrozenStateDialog &&
    shouldDisplayNewAccountImportButton;
  return (
    <Header
      startWidgets={
        <>
          {shouldDisplayAddButton ? (
            <Tooltip
              location="bottom"
              passThrough={tooltipPassThrough}
              content={tooltipContent}
              wrapTrigger
            >
              <VaultHeaderButton
                onClick={handleAddNew}
                disabled={addNewDisabled}
                icon={<Icon name="ActionAddOutlined" />}
                isPrimary
              >
                {translate(I18N_KEYS.ADD)}
              </VaultHeaderButton>
            </Tooltip>
          ) : null}
          {shouldDisplayImportButton ? (
            <VaultHeaderButton
              role="link"
              icon="ImportOutlined"
              mood="brand"
              intensity="quiet"
              onClick={() => history.push(routes.importData)}
            >
              {translate(I18N_KEYS.IMPORT_DATA_BUTTON)}
            </VaultHeaderButton>
          ) : null}
          {shareButtonElement}
          {shouldDisplayPasswordHistoryButton ? (
            <PasswordHistoryButton />
          ) : null}
        </>
      }
      endWidget={
        <>
          <HeaderAccountMenu />
          <NotificationsDropdown />
        </>
      }
    />
  );
};
