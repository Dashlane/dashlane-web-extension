import { SharingCenterIcon } from "@dashlane/ui-components";
import { Permission } from "@dashlane/sharing-contracts";
import { Origin } from "@dashlane/hermes";
import useTranslate from "../../../libs/i18n/useTranslate";
import { EmptyView } from "../../empty-view/empty-view";
import { SharingButton } from "../../sharing-invite/sharing-button";
import { ItemsTabs, SharingInviteStep } from "../../sharing-invite/types";
import styles from "./styles.css";
const I18N_KEYS = {
  EMPTY_CTA: "webapp_sharing_center_empty_cta",
  DESCRIPTION: "webapp_sharing_center_empty_description",
  TITLE: "webapp_sharing_center_empty_title",
};
export const EmptyList = () => {
  const { translate } = useTranslate();
  return (
    <EmptyView
      icon={<SharingCenterIcon size={72} color="ds.text.neutral.quiet" />}
      title={translate(I18N_KEYS.TITLE)}
    >
      <p className={styles.description}>{translate(I18N_KEYS.DESCRIPTION)}</p>
      <SharingButton
        hideIcon
        tooltipPlacement="bottom"
        text={translate(I18N_KEYS.EMPTY_CTA)}
        sharing={{
          permission: Permission.Limited,
          selectedCredentials: [],
          selectedGroups: [],
          selectedNotes: [],
          selectedUsers: [],
          selectedPrivateCollections: [],
          selectedSharedCollections: [],
          selectedSecrets: [],
          step: SharingInviteStep.Elements,
          tab: ItemsTabs.Passwords,
        }}
        origin={Origin.ItemListView}
      />
    </EmptyView>
  );
};
