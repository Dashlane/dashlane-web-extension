import { Button, Icon, jsx } from "@dashlane/design-system";
import {
  TabName,
  useActiveVaultTypeTabContext,
} from "../../vault/tabs-bar/active-vault-type-tab-context";
import { openWebAppAndClosePopup } from "../../helpers";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useShowPasswordLimit } from "../../../libs/hooks/use-show-password-limit";
import { getAddNewInfo } from "./utility";
export const AddNewButton = () => {
  const { activeTabName } = useActiveVaultTypeTabContext();
  const { translate } = useTranslate();
  const passwordLimit = useShowPasswordLimit();
  if (passwordLimit === null) {
    return null;
  }
  const showPasswordLimitTooltip =
    passwordLimit.shouldDisplayPasswordLimitBanner &&
    activeTabName === TabName.Passwords;
  const addNewInfo = getAddNewInfo(activeTabName);
  const title = translate(addNewInfo.translationKey);
  const handleAddNew = () => {
    void openWebAppAndClosePopup({
      id: addNewInfo.routeId,
      route: addNewInfo.route,
    });
  };
  return (
    <Button
      onClick={handleAddNew}
      key="add-new"
      mood="neutral"
      layout="iconOnly"
      title={title}
      aria-label={title}
      tooltip={
        showPasswordLimitTooltip
          ? translate("footer/add_button/password_limit_reached")
          : null
      }
      role="link"
      intensity="supershy"
      icon={<Icon name="ActionAddOutlined" />}
    />
  );
};
