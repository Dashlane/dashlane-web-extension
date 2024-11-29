import { useFeatureFlip } from "@dashlane/framework-react";
import { SharingCenterCarbon } from "./sharing-center-carbon";
import { SharingCenterGraphene } from "./sharing-center-graphene";
export interface SharingCenterProps {
  children: React.ReactNode;
}
export const SharingCenterDataProvider = ({ ...props }: SharingCenterProps) => {
  const grapheneSharingSyncFF = useFeatureFlip(
    "sharingVault_web_sharingSyncGrapheneMigration_dev"
  );
  if (grapheneSharingSyncFF === null) {
    return null;
  }
  return grapheneSharingSyncFF ? (
    <SharingCenterGraphene {...props} />
  ) : (
    <SharingCenterCarbon {...props} />
  );
};
