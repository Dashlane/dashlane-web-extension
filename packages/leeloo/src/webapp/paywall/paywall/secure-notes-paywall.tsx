import * as React from "react";
import {
  colors,
  FolderIcon,
  PaperClipIcon,
  SharingCenterIcon,
} from "@dashlane/ui-components";
import { GenericPaywall, PaywallProps, PaywallTarget } from "./generic-paywall";
import { PAYWALL_SUBTYPE } from "../logs";
const SECURE_NOTES_FEATURES = [
  {
    icon: <SharingCenterIcon size={50} color={colors["--dash-green-02"]} />,
    key: "file_storage",
    title: "webapp_paywall_secure_note_file_storage_title",
    description: "webapp_paywall_secure_note_file_storage_description",
  },
  {
    icon: <FolderIcon size={50} color={colors["--dash-green-02"]} />,
    key: "folder",
    title: "webapp_paywall_secure_note_folder_title",
    description: "webapp_paywall_secure_note_folder_description",
  },
  {
    icon: <PaperClipIcon size={50} color={colors["--dash-green-02"]} />,
    key: "secure_sharing",
    title: "webapp_paywall_secure_note_secure_sharing_title",
    description: "webapp_paywall_secure_note_secure_sharing_description",
  },
];
export const SecureNotesPaywall = ({
  mode,
  closePaywall,
}: Pick<PaywallProps, "mode" | "closePaywall">) => {
  return (
    <GenericPaywall
      paywallType={PAYWALL_SUBTYPE.SECURE_NOTES}
      title="webapp_paywall_secure_note_title"
      description="webapp_paywall_secure_note_description"
      mode={mode}
      closePaywall={closePaywall}
      paywallFeatures={SECURE_NOTES_FEATURES}
      target={PaywallTarget.Premium}
      withDefaultFooter
    />
  );
};
