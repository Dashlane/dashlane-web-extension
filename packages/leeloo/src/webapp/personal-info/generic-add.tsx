import { Ref, useEffect, useRef, useState } from "react";
import { PageView } from "@dashlane/hermes";
import { AlertSeverity } from "@dashlane/ui-components";
import { useModuleCommands } from "@dashlane/framework-react";
import {
  CreateVaultItemParam,
  vaultItemsCrudApi,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { Lee } from "../../lee";
import { redirect, useRouterGlobalSettingsContext } from "../../libs/router";
import { getCurrentSpaceId } from "../../libs/webapp";
import { useAlert } from "../../libs/alert-notifications/use-alert";
import useTranslate from "../../libs/i18n/useTranslate";
import { logPageView } from "../../libs/logs/logEvent";
import { useFrozenState } from "../../libs/frozen-state/frozen-state-dialog-context";
import { EditPanel, PanelHeader } from "../panel";
import PersonalInfoIcon, { IconSize, IconType } from "../personal-info-icon";
import { getNewPersonalInfoName } from "./services";
import { PersonalInfoForm, PersonalInfoItemType } from "./types";
import colorsVar from "../../libs/dashlane-style/globals/color-variables.css";
interface Props {
  lee: Lee;
}
type RenderAddForm<F> = (
  lee: Lee,
  ref: Ref<F>,
  signalEditedValues: () => void,
  currentSpaceId: string | null
) => JSX.Element;
interface GenericAddParams<F> {
  renderForm: RenderAddForm<F>;
  vaultItemType: PersonalInfoItemType;
  iconType: IconType;
}
export function getPersonalInfoAddPanel<F extends PersonalInfoForm>(
  params: GenericAddParams<F>
) {
  const { renderForm, vaultItemType, iconType } = params;
  const PersonalInfoAddPanel = ({ lee }: Props) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const alertContext = useAlert();
    const { createVaultItem } = useModuleCommands(vaultItemsCrudApi);
    const formRef = useRef<F>(null);
    const isFormValid = (): boolean => Boolean(formRef.current?.isFormValid());
    const getFormValues = () => formRef.current?.getValues();
    const {
      openDialog: openTrialDiscontinuedDialog,
      shouldShowFrozenStateDialog,
    } = useFrozenState();
    const [hasDataBeenModified, setHasDataBeenModified] = useState(false);
    useEffect(() => {
      const vaultItemTypeToPageView = {
        [VaultItemType.Address]: PageView.ItemAddressCreate,
        [VaultItemType.Company]: PageView.ItemCompanyCreate,
        [VaultItemType.Email]: PageView.ItemEmailCreate,
        [VaultItemType.Identity]: PageView.ItemIdentityCreate,
        [VaultItemType.Phone]: PageView.ItemPhoneCreate,
        [VaultItemType.Website]: PageView.ItemWebsiteCreate,
      };
      logPageView(vaultItemTypeToPageView[vaultItemType]);
    }, []);
    useEffect(() => {
      if (shouldShowFrozenStateDialog) {
        openTrialDiscontinuedDialog();
      }
    }, [shouldShowFrozenStateDialog]);
    const showListView = (): void => {
      logPageView(PageView.ItemPersonalInfoList);
      redirect(routes.userPersonalInfo);
    };
    const handleEditedForm = () => setHasDataBeenModified(true);
    const savePersonalInfo = async () => {
      const content = getFormValues();
      if (!content) {
        return;
      }
      const createResult = await createVaultItem({
        vaultItemType: vaultItemType,
        content: content,
      } as CreateVaultItemParam);
      if (createResult.tag !== "success") {
        alertContext.showAlert(
          translate("_common_generic_error"),
          AlertSeverity.ERROR
        );
      }
    };
    const submit = async (): Promise<void> => {
      if (!isFormValid()) {
        return;
      }
      await savePersonalInfo();
      showListView();
    };
    const currentSpaceId = getCurrentSpaceId(lee.globalState);
    const itemIcon = (
      <PersonalInfoIcon
        iconSize={IconSize.headerEditPanelIcon}
        iconType={iconType}
      />
    );
    const itemTitle = getNewPersonalInfoName(translate, vaultItemType);
    return (
      <EditPanel
        isUsingNewDesign
        isViewingExistingItem={false}
        itemHasBeenEdited={hasDataBeenModified}
        onNavigateOut={showListView}
        onSubmit={submit}
        formId="add_personalinfo_panel"
        header={
          <PanelHeader
            icon={itemIcon}
            iconBackgroundColor={colorsVar["--dash-green-00"]}
            title={itemTitle}
          />
        }
      >
        {renderForm(lee, formRef, handleEditedForm, currentSpaceId)}
      </EditPanel>
    );
  };
  return PersonalInfoAddPanel;
}
