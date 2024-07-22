import { Fragment, useContext } from "react";
import { Icon, jsx, ThemeUIStyleObject } from "@dashlane/design-system";
import { VaultSourceType } from "@dashlane/autofill-contracts";
import {
  AutofillButton,
  PageView,
  UserAutofillClickEvent,
} from "@dashlane/hermes";
import { I18nContext } from "../../../context/i18n";
import { useCommunication } from "../../../context/communication";
import { vaultSourceTypeToWebappRouteNameMap } from "../../../utils/routes/routes";
import { vaultSourceTypeKeyMap } from "../../../utils/formatter/keys";
import styles from "./EmptyPanel.module.scss";
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  DIVIDER: {
    border: "none",
    borderTop: "1px solid",
    borderTopColor: "ds.border.neutral.quiet.idle",
    padding: "0",
    margin: "0 0",
  },
  EMPTY_STATE_ADD_ITEM: {
    backgroundColor: "ds.container.agnostic.neutral.supershy",
    color: "ds.text.brand.quiet",
  },
  EMPTY_STATE_MESSAGE: {
    display: "flex",
    alignItems: "center",
    color: "ds.text.neutral.quiet",
    height: "40px",
    paddingLeft: "18px",
    paddingRight: "10px",
    fontSize: "12px",
  },
};
interface Props {
  fieldType: VaultSourceType;
  onAddNewItem: () => void;
  tabUrl?: string;
  tabRootDomain?: string;
  withAddNewButton?: boolean;
}
export const vaultSourceTypeToPageViewMap: Partial<
  Record<VaultSourceType, PageView>
> = {
  [VaultSourceType.Address]: PageView.AutofillDropdownAddAddress,
  [VaultSourceType.Credential]: PageView.AutofillDropdownAddPassword,
  [VaultSourceType.BankAccount]: PageView.AutofillDropdownAddBankStatement,
  [VaultSourceType.Company]: PageView.AutofillDropdownAddCompany,
  [VaultSourceType.DriverLicense]: PageView.AutofillDropdownAddDriverLicense,
  [VaultSourceType.Email]: PageView.AutofillDropdownAddEmail,
  [VaultSourceType.FiscalId]: PageView.AutofillDropdownAddFiscal,
  [VaultSourceType.IdCard]: PageView.AutofillDropdownAddIdCard,
  [VaultSourceType.Identity]: PageView.AutofillDropdownAddIdentity,
  [VaultSourceType.PaymentCard]: PageView.AutofillDropdownAddCreditCard,
  [VaultSourceType.Phone]: PageView.AutofillDropdownAddPhone,
  [VaultSourceType.SocialSecurityId]:
    PageView.AutofillDropdownAddSocialSecurity,
  [VaultSourceType.PersonalWebsite]: PageView.AutofillDropdownAddWebsite,
};
export const EmptyPanel = ({
  fieldType,
  tabUrl,
  tabRootDomain,
  onAddNewItem,
  withAddNewButton,
}: Props) => {
  const { translate } = useContext(I18nContext);
  const { autofillEngineCommands } = useCommunication();
  const noDataNotification = translate(
    fieldType === VaultSourceType.Credential
      ? "emptyStateWebcard_noLogin"
      : "emptyStateWebcard_noOtherInfo",
    { domain: tabRootDomain ?? "" }
  );
  const onClickAddNewItem = async () => {
    if (vaultSourceTypeToWebappRouteNameMap[fieldType]) {
      autofillEngineCommands?.openWebapp({
        id: "new",
        route: vaultSourceTypeToWebappRouteNameMap[fieldType],
        query: { website: tabUrl ?? "" },
      });
      autofillEngineCommands?.logEvent(
        new UserAutofillClickEvent({
          autofillButton: AutofillButton.AddNewItem,
        })
      );
    }
    onAddNewItem();
  };
  return (
    <div className={styles.emptyState}>
      <div sx={SX_STYLES.EMPTY_STATE_MESSAGE}>{noDataNotification}</div>
      {withAddNewButton ? (
        <>
          <hr sx={SX_STYLES.DIVIDER} />
          <button
            className={styles.emptyStateAddItem}
            sx={SX_STYLES.EMPTY_STATE_ADD_ITEM}
            onClick={onClickAddNewItem}
            data-keyboard-accessible={translate(
              `v5_addNew_${vaultSourceTypeKeyMap[fieldType]}`
            )}
          >
            <div className={styles.iconWrapper}>
              <Icon name="ActionAddOutlined" size="xsmall" />
            </div>
            {translate(`v5_addNew_${vaultSourceTypeKeyMap[fieldType]}`)}
          </button>
        </>
      ) : null}
    </div>
  );
};
