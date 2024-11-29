import React from "react";
import { VaultItemType } from "@dashlane/vault-contracts";
import { Lee } from "../../../../lee";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { getCurrentSpaceId } from "../../../../libs/webapp";
import { DriverLicenseFormFields } from "../../types";
import { getBritishSpellingLabel, getCurrentCountry } from "../../helpers";
import { Header } from "../../form/header";
import { DriverLicenseForm } from "../../form/documents/driver-license-form";
import { AddPanel } from "../add-panel";
interface Props {
  lee: Lee;
  listRoute: string;
}
const I18N_KEYS = {
  SUCCESS_DEFAULT: "webapp_id_creation_driverlicense_alert_add_success_default",
  TITLE_DEFAULT: "webapp_id_creation_driverlicense_title_default",
};
const countryToKeys = () => ({
  title: I18N_KEYS.TITLE_DEFAULT,
  success: I18N_KEYS.SUCCESS_DEFAULT,
});
export const DriverLicenseAddPanel = ({ lee, listRoute }: Props) => {
  const { translate } = useTranslate();
  const currentCountry = getCurrentCountry(lee.carbon.currentLocation);
  const currentSpaceId = getCurrentSpaceId(lee.globalState) ?? "";
  const handleError = (error: Error) => {
    lee.reportError(error);
  };
  const initialValues: DriverLicenseFormFields = {
    idName: "",
    idNumber: "",
    expirationDate: "",
    issueDate: "",
    country: currentCountry,
    spaceId: currentSpaceId,
    state: "",
  };
  return (
    <AddPanel<DriverLicenseFormFields>
      initialValues={initialValues}
      listRoute={listRoute}
      reportError={lee.reportError}
      countryToKeys={countryToKeys}
      type={VaultItemType.DriversLicense}
      header={(country) => (
        <Header
          title={getBritishSpellingLabel(
            translate(countryToKeys().title),
            translate.getLocale(),
            country
          )}
          country={country}
          type={VaultItemType.DriversLicense}
        />
      )}
    >
      {({ values }) => (
        <DriverLicenseForm
          variant="add"
          handleError={handleError}
          country={values.country}
        />
      )}
    </AddPanel>
  );
};
