import React from "react";
import { VaultItemType } from "@dashlane/vault-contracts";
import { Lee } from "../../../../lee";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { getCurrentSpaceId } from "../../../../libs/webapp";
import { AddPanel } from "../add-panel";
import { FiscalIdFormFields } from "../../types";
import { FiscalIdForm } from "../../form/documents/fiscal-id-form";
import { getCurrentCountry } from "../../helpers";
import { Header } from "../../form/header";
interface Props {
  lee: Lee;
  listRoute: string;
}
const I18N_KEYS = {
  SUCCESS_DEFAULT: "webapp_id_creation_fiscalid_alert_add_success_default",
  SUCCESS_BR: "webapp_id_creation_fiscalid_alert_add_success_br",
  SUCCESS_JP: "webapp_id_creation_fiscalid_alert_add_success_jp",
  TITLE_DEFAULT: "webapp_id_creation_fiscalid_title_default",
};
const countryToKeys = () => ({
  title: I18N_KEYS.TITLE_DEFAULT,
  success: I18N_KEYS.SUCCESS_DEFAULT,
});
export const FiscalIdAddPanel = ({ lee, listRoute }: Props) => {
  const { translate } = useTranslate();
  const currentCountry = getCurrentCountry(lee.carbon.currentLocation);
  const currentSpaceId = getCurrentSpaceId(lee.globalState) ?? "";
  const initialValues: FiscalIdFormFields = {
    fiscalNumber: "",
    teledeclarantNumber: "",
    country: currentCountry,
    spaceId: currentSpaceId,
  };
  return (
    <AddPanel<FiscalIdFormFields>
      initialValues={initialValues}
      listRoute={listRoute}
      reportError={lee.reportError}
      countryToKeys={countryToKeys}
      type={VaultItemType.FiscalId}
      requiredProperty="fiscalNumber"
      header={(country) => (
        <Header
          title={translate(countryToKeys().title)}
          country={country}
          type={VaultItemType.FiscalId}
        />
      )}
    >
      {() => <FiscalIdForm variant="add" />}
    </AddPanel>
  );
};
